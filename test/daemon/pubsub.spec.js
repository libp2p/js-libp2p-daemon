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
const { createLibp2p } = require('../../src/libp2p')
const Client = require('../../src/client')
const { isWindows } = require('../../src/util')
const { connect } = require('../util')
const {
  Request,
  Response,
  PSRequest,
  PSResponse,
  PSMessage
} = require('../../src/protocol')

const daemonAddr = isWindows
  ? ma('/ip4/0.0.0.0/tcp/8080')
  : ma(`/unix${path.resolve(os.tmpdir(), '/tmp/p2pd.sock')}`)

describe.only('pubsub', () => {
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
        dht: false,
        dhtClient: false,
        connMgr: false,
        listen: daemonAddr.toString(),
        id: '',
        bootstrapPeers: '',
        pubsub: true
      }),
      createLibp2p({
        pubsub: true,
        hostAddrs: '/ip4/0.0.0.0/tcp/0'
      })
    ]).then((results) => {
      daemon = results.shift()
      libp2pPeer = results.shift()

      return Promise.all([
        daemon.start(),
        libp2pPeer.start()
      ])
    }).then(() => {
      return connect({
        libp2pPeer,
        multiaddr: daemonAddr
      })
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

  it('should be able to subscribe to a message', async () => {
    const topic = 'test-topic'
    client = new Client(daemonAddr)

    await client.attach()

    const request = {
      type: Request.Type.PUBSUB,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      pubsub: {
        type: PSRequest.Type.SUBSCRIBE,
        topic,
      },
      disconnect: null,
      connManager: null
    }

    console.log('req', request)

    const stream = client.send(request)

    const response = Response.decode(await stream.first())
    expect(response.type).to.eql(Response.Type.OK)

    stream.end()
  })

  it('should get subscribed topics', async () => {
    client = new Client(daemonAddr)

    await client.attach()

    const request = {
      type: Request.Type.PUBSUB,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      pubsub: {
        type: PSRequest.Type.GET_TOPICS
      },
      disconnect: null,
      connManager: null
    }

    console.log('req', request)

    const stream = client.send(request)

    const response = Response.decode(await stream.first())
    expect(response.type).to.eql(Response.Type.OK)

    stream.end()
  })
})
