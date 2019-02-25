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

const PATH = isWindows
  ? path.join('\\\\?\\pipe', '/tmp/p2pd.sock')
  : path.resolve(os.tmpdir(), '/tmp/p2pd.sock')

describe('configuration', () => {
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
      listen: `/unix${PATH}`,
      id: '',
      bootstrapPeers: ''
    })

    await daemon.start()
    const addrs = daemon.libp2p.peerInfo.multiaddrs.toArray()
    expect(addrs).to.eql([
      ma('/dns/ipfs.io')
    ])
  })
})
