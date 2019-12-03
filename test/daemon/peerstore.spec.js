/* eslint-env mocha */
/* eslint max-nested-callbacks: ['error', 5] */
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
const { connect } = require('../util')
const {
  Request,
  Response,
  PeerstoreRequest
} = require('../../src/protocol')

const daemonAddr = isWindows
  ? ma('/ip4/0.0.0.0/tcp/8080')
  : ma(`/unix${path.resolve(os.tmpdir(), '/tmp/p2pd.sock')}`)

describe('peerstore features', () => {
  let daemon
  let libp2pPeer
  let client

  before(async function () {
    this.timeout(20e3)
    daemon = await createDaemon({
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
    })
    libp2pPeer = await createLibp2p({
      dht: true,
      hostAddrs: '/ip4/0.0.0.0/tcp/0'
    })

    await Promise.all([
      daemon.start(),
      libp2pPeer.start()
    ])

    await connect({
      libp2pPeer,
      multiaddr: daemonAddr
    })
  })

  before(async () => {
    await new Promise(resolve => setTimeout(resolve, 1e3))
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

  it('should be able to get the protocols for a peer', async () => {
    client = new Client(daemonAddr)

    await client.attach()

    const request = {
      type: Request.Type.PEERSTORE,
      peerStore: {
        type: PeerstoreRequest.Type.GET_PROTOCOLS,
        id: Buffer.from(libp2pPeer.peerInfo.id.toBytes())
      }
    }

    const stream = client.send(request)

    const message = await stream.first()
    const response = Response.decode(message)
    expect(response.type).to.eql(Response.Type.OK)
    expect(response.peerStore).to.eql({
      protos: [
        '/libp2p/circuit/relay/0.1.0',
        '/ipfs/id/1.0.0',
        '/ipfs/id/push/1.0.0',
        // '/mplex/6.7.0', TODO: WHY?
        '/ipfs/kad/1.0.0'
      ],
      peer: null
    })
    stream.end()
  })

  it('NOT IMPLEMENTED get peer info', async () => {
    client = new Client(daemonAddr)

    await client.attach()

    const request = {
      type: Request.Type.PEERSTORE,
      peerStore: {
        type: PeerstoreRequest.Type.GET_PEER_INFO,
        id: Buffer.from(libp2pPeer.peerInfo.id.toBytes())
      }
    }

    const stream = client.send(request)

    const message = await stream.first()
    const response = Response.decode(message)
    expect(response.type).to.eql(Response.Type.ERROR)
    expect(response.error.msg).to.eql('ERR_NOT_IMPLEMENTED')
  })
})
