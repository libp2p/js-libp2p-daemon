const chai = require('chai')
const expect = chai.expect
const { createDaemon } = require('../src/daemon')
const { Request, Response } = require('../src/protocol')
const net = require('net')
const path = require('path')
const { encode, decode } = require('length-prefixed-stream')
const LIMIT = 1 << 22 // 4MB

describe('daemon', () => {
  describe('connections', () => {
    let daemon1
    let daemon2
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
        daemon1 = daemons.shift()
        daemon2 = daemons.shift()

        return Promise.all([
          daemon1.start(),
          daemon2.start()
        ])
      })
    })

    after(() => {
      daemon1.stop()
      daemon2.stop()
    })

    afterEach(() => {
      client && client.destroy()
    })

    it('should be able to connect to another node', (done) => {
      client = new net.Socket({
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

        // Decode and pipe the response
        const dec = decode({ limit: LIMIT })
        client.pipe(dec)

        // Encode and pipe the request
        const enc = encode()
        enc.write(Request.encode(request))
        enc.pipe(client)

        for await (const message of dec) {
          let response
          try {
            response = Response.decode(message)
          } catch (err) {
            return done(err)
          }
          expect(response.type).to.eql(Response.Type.OK)
          done()
        }
      })
    })

    it('should be able to list peers', (done) => {
      client = new net.Socket({
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

        // Decode and pipe the response
        const dec = decode({ limit: LIMIT })
        client.pipe(dec)

        // Encode and pipe the request
        const enc = encode()
        enc.end(Request.encode(request))
        enc.pipe(client)

        for await (const message of dec) {
          let response
          try {
            response = Response.decode(message)
          } catch (err) {
            return done(err)
          }
          expect(response.type).to.eql(Response.Type.OK)
          expect(response.peers).to.have.length(1)
          done()
        }
      })
    })

    it('should be able to identify', (done) => {
      client = new net.Socket({
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

        // Decode and pipe the response
        const dec = decode({ limit: LIMIT })
        client.pipe(dec)

        // Encode and pipe the request
        const enc = encode()
        enc.end(Request.encode(request))
        enc.pipe(client)

        for await (const message of dec) {
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
        }
      })
    })
  })
})