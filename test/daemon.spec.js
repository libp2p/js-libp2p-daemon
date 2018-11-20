const chai = require('chai')
const expect = chai.expect
const { createDaemon } = require('../src/daemon')
const { Request, Response } = require('../src/protocol')
const mh = require('multihashes')
const multiaddr = require('multiaddr')
const net = require('net')
const path = require('path')

describe('daemon', () => {
  it('should be able to start and stop the daemon', async () => {
    const daemon = await createDaemon({
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
    })

    await daemon.start()
    await daemon.stop()
  })

  describe('connections', () => {
    let daemon1
    let daemon2

    before(() => {
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
        createDaemon({
          quiet: false,
          q: false,
          bootstrap: false,
          b: false,
          dht: false,
          dhtClient: false,
          connMgr: false,
          sock: '/tmp/p2pd2.sock',
          id: '',
          bootstrapPeers: ''
        })
      ]).then((daemons) => {
        daemon1 = daemons[0]
        daemon2 = daemons[1]

        return Promise.all([
          daemon1.start(),
          daemon2.start()
        ])
      })
    })

    after(async () => {
      try {
        await daemon1.stop()
      } catch (err) {}
      try {
        await daemon2.stop()
      } catch (err) {}
    })

    it('should be able to connect to another node', (done) => {
      const client = new net.Socket({
        readable: true,
        writable: true,
        allowHalfOpen: true
      })

      client.connect(path.resolve('/tmp/p2pd.sock'), async (err) => {
        if (err) return done(err)

        const connRequest = {
          peer: Buffer.from(daemon2.libp2p.peerInfo.id.toB58String()),
          addrs: daemon2.libp2p.peerInfo.multiaddrs.toArray().map(addr => addr.buffer)
        }
        const request = {
          type: Request.Type.CONNECT,
          connect: connRequest,
          streamOpen: null,
          streamHandler: null,
          dht: null,
          connManager: null
        }

        client.end(Request.encode(request))

        let message = Buffer.alloc(0)
        for await (const chunk of client) {
          message = Buffer.concat([message, chunk])
        }

        let response
        try {
          response = Response.decode(message)
        } catch (err) {
          return done(err)
        }

        expect(response.type).to.eql(Response.Type.OK)
        done()
      })
    })

    it('should be able to list peers', (done) => {
      const client = new net.Socket({
        readable: true,
        writable: true,
        allowHalfOpen: true
      })

      client.connect(path.resolve('/tmp/p2pd.sock'), async (err) => {
        if (err) return done(err)

        const request = {
          type: Request.Type.LIST_PEERS,
          connect: null,
          streamOpen: null,
          streamHandler: null,
          dht: null,
          connManager: null
        }

        client.end(Request.encode(request))

        let message = Buffer.alloc(0)
        for await (const chunk of client) {
          message = Buffer.concat([message, chunk])
        }

        let response
        try {
          response = Response.decode(message)
        } catch (err) {
          return done(err)
        }

        expect(response.type).to.eql(Response.Type.OK)
        expect(response.peers).to.have.length(1)
        done()
      })
    })

    it('should be able to identify', (done) => {
      const client = new net.Socket({
        readable: true,
        writable: true,
        allowHalfOpen: true
      })

      client.connect(path.resolve('/tmp/p2pd.sock'), async (err) => {
        if (err) return done(err)

        const request = {
          type: Request.Type.IDENTIFY,
          connect: null,
          streamOpen: null,
          streamHandler: null,
          dht: null,
          connManager: null
        }

        client.end(Request.encode(request))

        let message = Buffer.alloc(0)
        for await (const chunk of client) {
          message = Buffer.concat([message, chunk])
        }

        let response
        try {
          response = Response.decode(message)
        } catch (err) {
          return done(err)
        }

        expect(response.type).to.eql(Response.Type.OK)
        expect(response.identify).to.eql({
          id: daemon1.libp2p.peerInfo.id.toBytes(),
          addrs: daemon1.libp2p.peerInfo.multiaddrs.toArray().map(m => m.buffer)
        })
        done()
      })
    })
  })
})