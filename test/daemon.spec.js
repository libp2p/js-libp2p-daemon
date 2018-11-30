/* eslint-env mocha */
'use strict'

const chai = require('chai')
const expect = chai.expect
const { createDaemon } = require('../src/daemon')
const Client = require('../src/client')
const { Request, Response } = require('../src/protocol')
const { createLibp2p } = require('../src/libp2p')
const toIterator = require('pull-stream-to-async-iterator')

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
        dht: false,
        dhtClient: false,
        connMgr: false,
        sock: '/tmp/p2pd.sock',
        id: '',
        bootstrapPeers: ''
      }),
      createLibp2p()
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
      await client.startServer(socketPath, (conn) => {
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
      connection.on('data', (message) => {
        expect(message).to.eql(hello)
        connection.end()
      })
    })
  })
})
