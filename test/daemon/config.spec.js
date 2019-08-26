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
const { isWindows } = require('../../src/util')

const daemonAddr = isWindows
  ? ma('/ip4/0.0.0.0/tcp/8080')
  : ma(`/unix${path.resolve(os.tmpdir(), '/tmp/p2pd.sock')}`)

describe('configuration', function () {
  this.timeout(10e3)

  let daemon
  afterEach(async () => {
    await daemon && daemon.stop()
  })

  it('should be able to set announce addrs', async () => {
    daemon = await createDaemon({
      quiet: false,
      q: false,
      bootstrap: false,
      hostAddrs: '/ip4/0.0.0.0/tcp/0',
      announceAddrs: '/dns/ipfs.io',
      b: false,
      dht: true,
      dhtClient: false,
      connMgr: false,
      listen: daemonAddr.toString(),
      id: '',
      bootstrapPeers: ''
    })

    await daemon.start()

    const addrs = daemon.libp2p.peerInfo.multiaddrs.toArray()
    expect(addrs).to.eql([
      ma('/dns/ipfs.io')
    ])
  })

  it('should be able to load an RSA private key', async () => {
    daemon = await createDaemon({
      quiet: false,
      q: false,
      bootstrap: false,
      hostAddrs: '',
      announceAddrs: '',
      b: false,
      dht: true,
      dhtClient: false,
      connMgr: false,
      listen: daemonAddr.toString(),
      id: path.join(__dirname, '../resources/rsa.key'),
      bootstrapPeers: ''
    })
    await daemon.start()

    const peerId = daemon.libp2p.peerInfo.id
    expect(peerId.toB58String()).to.eql('QmPFdSzvgd1HbZSd6oX2N2vCSnhSEeocbQZsMB42UG8smE')
  })

  it('should be able to load a Secp256k1 private key', async () => {
    daemon = await createDaemon({
      quiet: false,
      q: false,
      bootstrap: false,
      hostAddrs: '',
      announceAddrs: '',
      b: false,
      dht: true,
      dhtClient: false,
      connMgr: false,
      listen: daemonAddr.toString(),
      id: path.join(__dirname, '../resources/secp256k1.key'),
      bootstrapPeers: ''
    })
    await daemon.start()

    const peerId = daemon.libp2p.peerInfo.id
    expect(peerId.toB58String()).to.eql('16Uiu2HAm7txvwZbeK5g3oB3DrRhnARTEjTNorVreWJomfHJHbEu2')
  })
})
