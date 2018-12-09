/* eslint-env mocha */
'use strict'

const chai = require('chai')
const expect = chai.expect
const { createDaemon } = require('../src/daemon')
const Client = require('../src/client')
const { createLibp2p } = require('../src/libp2p')
const { decode } = require('length-prefixed-stream')
const CID = require('cids')
const {
  Request,
  DHTRequest,
  Response,
  DHTResponse,
  StreamInfo
} = require('../src/protocol')

describe('daemon', () => {
  let daemon
  let libp2pPeer
  let client

  before(function () {
    this.timeout(20e3)
    return Promise.all([
      createDaemon({
        quiet: false,
        q: false,
        bootstrap: false,
        b: false,
        dht: true,
        dhtClient: false,
        connMgr: false,
        sock: '/tmp/p2pd.sock',
        id: '',
        bootstrapPeers: ''
      }),
      createLibp2p({
        dht: true
      })
    ]).then((results) => {
      daemon = results.shift()
      libp2pPeer = results.shift()

      return Promise.all([
        daemon.start(),
        libp2pPeer.start()
      ])
    })
  })

  after(() => {
    return Promise.all([
      daemon.stop(),
      libp2pPeer.stop()
    ])
  })

  afterEach(async () => {
    await client && client.close()
  })

  it('should be able to connect to another node', async () => {
    client = new Client('/tmp/p2pd.sock')

    await client.attach()

    const request = {
      type: Request.Type.CONNECT,
      connect: {
        peer: Buffer.from(libp2pPeer.peerInfo.id.toB58String()),
        addrs: libp2pPeer.peerInfo.multiaddrs.toArray().map(addr => addr.buffer)
      },
      streamOpen: null,
      streamHandler: null,
      dht: null,
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    const stream = client.send(request)

    for await (const message of stream) {
      let response = Response.decode(message)
      expect(response.type).to.eql(Response.Type.OK)
      stream.end()
    }
  })

  it('should be able to list peers', async () => {
    client = new Client('/tmp/p2pd.sock')

    await client.attach()

    const request = {
      type: Request.Type.LIST_PEERS,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      dht: null,
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    const stream = client.send(request)

    for await (const message of stream) {
      const response = Response.decode(message)
      expect(response.type).to.eql(Response.Type.OK)
      expect(response.peers).to.have.length(1)
      stream.end()
    }
  })

  it('should be able to identify', async () => {
    client = new Client('/tmp/p2pd.sock')

    await client.attach()

    const request = {
      type: Request.Type.IDENTIFY,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      dht: null,
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    const stream = client.send(request)

    for await (const message of stream) {
      const response = Response.decode(message)
      expect(response.type).to.eql(Response.Type.OK)
      expect(response.identify).to.eql({
        id: daemon.libp2p.peerInfo.id.toBytes(),
        addrs: daemon.libp2p.peerInfo.multiaddrs.toArray().map(m => m.buffer)
      })
      stream.end()
    }
  })

  describe('streams', () => {
    it('should be able to open a stream and echo with it', async () => {
      // Have the peer echo our messages back
      libp2pPeer.handle('/echo/1.0.0', async (conn) => {
        conn.pipe(conn)
      })
      client = new Client('/tmp/p2pd.sock')

      await client.attach()

      const request = {
        type: Request.Type.STREAM_OPEN,
        connect: null,
        streamOpen: {
          peer: Buffer.from(libp2pPeer.peerInfo.id.toB58String()),
          proto: ['/echo/1.0.0']
        },
        streamHandler: null,
        dht: null,
        connManager: null
      }

      const stream = client.send(request)

      // Verify the response then break
      for await (const message of stream) {
        const response = Response.decode(message)
        expect(response.type).to.eql(Response.Type.OK)
        expect(response.streamInfo).to.eql({
          peer: libp2pPeer.peerInfo.id.toBytes(),
          addr: libp2pPeer.peerInfo.multiaddrs.toArray()[0].buffer,
          proto: '/echo/1.0.0'
        })
        break
      }

      const hello = Buffer.from('hello there')
      const peerStream = client.write(hello)
      for await (const message of peerStream) {
        expect(message).to.eql(hello)
        peerStream.end()
      }
    })

    it('should be able to register a stream handler and echo with it', async () => {
      client = new Client('/tmp/p2pd.sock')
      const socketPath = '/tmp/p2p-echo-handler.sock'

      await client.attach()
      // Start an echo server
      await client.startServer(socketPath, async (conn) => {
        // Decode the stream
        const dec = decode()
        conn.pipe(dec)

        // Read the stream info from the daemon, then pipe to echo
        for await (const message of dec) {
          let response
          expect(() => {
            response = StreamInfo.decode(message)
          }).to.not.throw()

          expect(response.peer).to.eql(libp2pPeer.peerInfo.id.toBytes())
          expect(response.proto).to.eql('/echo/1.0.0')
          conn.unpipe(dec)
          break
        }

        conn.pipe(conn)
      })

      const request = {
        type: Request.Type.STREAM_HANDLER,
        connect: null,
        streamOpen: null,
        streamHandler: {
          path: socketPath,
          proto: ['/echo/1.0.0']
        },
        dht: null,
        connManager: null
      }

      const stream = client.send(request)

      for await (const message of stream) {
        const response = Response.decode(message)
        expect(response.type).to.eql(Response.Type.OK)
        break
      }

      const { connection } = await libp2pPeer.dial(daemon.libp2p.peerInfo, '/echo/1.0.0')

      const hello = Buffer.from('hello, peer')
      connection.write(hello)

      // TODO: make this an iterator
      return new Promise((resolve) => {
        connection.on('data', (message) => {
          expect(message).to.eql(hello)
          connection.end()
          resolve()
        })
      })
    })
  })

  describe('dht', () => {
    const cid = new CID('QmVzw6MPsF96TyXBSRs1ptLoVMWRv5FCYJZZGJSVB2Hp38')
    const content = Buffer.from('oh hello there')

    it('should be able to find a peer', async () => {
      client = new Client('/tmp/p2pd.sock')

      await client.attach()

      const request = {
        type: Request.Type.DHT,
        connect: null,
        streamOpen: null,
        streamHandler: null,
        dht: {
          type: DHTRequest.Type.FIND_PEER,
          peer: libp2pPeer.peerInfo.id.toBytes()
        },
        disconnect: null,
        pubsub: null,
        connManager: null
      }

      const stream = client.send(request)

      for await (const message of stream) {
        const response = Response.decode(message)
        expect(response.type).to.eql(Response.Type.OK)
        expect(response.dht).to.eql({
          type: DHTResponse.Type.VALUE,
          peer: {
            id: libp2pPeer.peerInfo.id.toBytes(),
            addrs: libp2pPeer.peerInfo.multiaddrs.toArray().map(m => m.buffer)
          },
          value: null
        })
        stream.end()
      }
    })

    it('should be able to register as a provider', async () => {
      client = new Client('/tmp/p2pd.sock')

      await client.attach()

      const request = {
        type: Request.Type.DHT,
        connect: null,
        streamOpen: null,
        streamHandler: null,
        dht: {
          type: DHTRequest.Type.PROVIDE,
          cid: cid.buffer
        },
        disconnect: null,
        pubsub: null,
        connManager: null
      }

      const stream = client.send(request)

      for await (const message of stream) {
        const response = Response.decode(message)
        expect(response.type).to.eql(Response.Type.OK)
        stream.end()
      }

      // The peer should be able to find our daemon as a provider
      const providers = await libp2pPeer.contentRouting.findProviders(cid, { maxNumProviders: 1 })
      expect(daemon.libp2p.peerInfo.id.isEqual(providers[0].id)).to.eql(true)
    })

    it('should be able to find providers', async () => {
      // Register the peer as a provider
      const cid = new CID('QmaSNGNpisJ1UeuoH3WcKuia4hQVi2XkfhkszTbWak9TxB')
      await libp2pPeer.contentRouting.provide(cid)

      // Now find it as a provider
      client = new Client('/tmp/p2pd.sock')

      await client.attach()

      const request = {
        type: Request.Type.DHT,
        connect: null,
        streamOpen: null,
        streamHandler: null,
        dht: {
          type: DHTRequest.Type.FIND_PROVIDERS,
          cid: cid.buffer,
          count: 1
        },
        disconnect: null,
        pubsub: null,
        connManager: null
      }

      const stream = client.send(request)

      const expectedResponses = [
        (message) => {
          const response = Response.decode(message)
          expect(response.type).to.eql(Response.Type.OK)
          expect(response.dht).to.eql({
            type: DHTResponse.Type.BEGIN,
            peer: null,
            value: null
          })
        },
        (message) => {
          const response = DHTResponse.decode(message)
          expect(response.type).to.eql(DHTResponse.Type.VALUE)
          expect(response.peer).to.eql({
            id: libp2pPeer.peerInfo.id.toBytes(),
            addrs: libp2pPeer.peerInfo.multiaddrs.toArray().map(m => m.buffer)
          })
        },
        (message) => {
          const response = DHTResponse.decode(message)
          expect(response.type).to.eql(DHTResponse.Type.END)
          stream.end()
        }
      ]

      for await (const message of stream) {
        expectedResponses.shift()(message)
      }
    })
  })
})
