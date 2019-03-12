/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 5] */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const os = require('os')
const path = require('path')
const ma = require('multiaddr')
const { createDaemon } = require('../../src/daemon')
const Client = require('../../src/client')
const { createLibp2p } = require('../../src/libp2p')
const { isWindows } = require('../../src/util')
const {
  Request,
  Response
} = require('../../src/protocol')

const daemonAddr = isWindows
  ? ma('/ip4/0.0.0.0/tcp/8080')
  : ma(`/unix${path.resolve(os.tmpdir(), '/tmp/p2pd.sock')}`)

describe('core features', () => {
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
        hostAddrs: '/ip4/0.0.0.0/tcp/0,/ip4/0.0.0.0/tcp/0/ws',
        b: false,
        dht: true,
        dhtClient: false,
        connMgr: false,
        listen: daemonAddr.toString(),
        id: '',
        bootstrapPeers: ''
      }),
      createLibp2p({
        dht: true,
        hostAddrs: '/ip4/0.0.0.0/tcp/0'
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
    client = new Client(daemonAddr)

    await client.attach()

    const request = {
      type: Request.Type.CONNECT,
      connect: {
        peer: Buffer.from(libp2pPeer.peerInfo.id.toBytes()),
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

    const message = await stream.first()
    let response = Response.decode(message)
    expect(response.type).to.eql(Response.Type.OK)
    stream.end()
  })

  it('should be able to list peers', async () => {
    client = new Client(daemonAddr)

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

    const message = await stream.first()
    const response = Response.decode(message)
    expect(response.type).to.eql(Response.Type.OK)
    expect(response.peers).to.have.length(1)
    stream.end()
  })

  it('should be able to identify', async () => {
    client = new Client(daemonAddr)

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

    const response = Response.decode(await stream.first())
    expect(response.type).to.eql(Response.Type.OK)

    expect(response.identify).to.eql({
      id: daemon.libp2p.peerInfo.id.toBytes(),
      addrs: daemon.libp2p.peerInfo.multiaddrs.toArray().map(m => m.buffer)
    })
    stream.end()
  })
})
