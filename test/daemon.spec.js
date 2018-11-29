const chai = require('chai')
const expect = chai.expect
const { createDaemon } = require('../src/daemon')
const Client = require('../src/client')
const { Request, Response } = require('../src/protocol')
const { createLibp2p } = require('../src/libp2p')

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
      daemon.stop().then(() => console.log('daemon stopped')),
      libp2pPeer.stop().then(() => console.log('libp2p stopped'))
    ])
  })

  afterEach(async () => {
    await client && client.close()
  })

  describe('connections', () => {
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
  })

  describe('streams', () => {
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
        const response = Response.decode(message)
        expect(response.type).to.eql(Response.Type.OK)
        stream.end()
      }
    })

    it('should be able to open a stream', async () => {
      client = new Client('/tmp/p2pd.sock')

      await client.attach()

      const request = {
        type: Request.Type.STREAM_OPEN,
        connect: null,
        streamOpen: {
          peer: Buffer.from(libp2pPeer.peerInfo.id.toB58String()),
          proto: ['/hello/1.0.0']
        },
        streamHandler: null,
        dht: null,
        connManager: null
      }

      const stream = client.send(request)

      for await (const message of stream) {
        const response = Response.decode(message)
        expect(response.type).to.eql(Response.Type.OK)
        expect(response.streamInfo).to.eql({
          peer: libp2pPeer.peerInfo.id.toBytes(),
          addr: libp2pPeer.peerInfo.multiaddrs.toArray()[0].buffer,
          proto: '/hello/1.0.0'
        })
        stream.end()
      }
    })
  })
})