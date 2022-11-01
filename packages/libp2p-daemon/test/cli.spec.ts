/* eslint-env mocha */

import { expect } from 'aegir/chai'
import sinon from 'sinon'
import { multiaddr } from '@multiformats/multiaddr'
import cli from '../src/index.js'
import server from '../src/server.js'

describe('cli', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('should create a daemon with default options', async () => {
    sinon.stub(server, 'createLibp2pServer').callsFake(async (ma, options) => {
      const bootstrapPeers: string = '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ,/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN,/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb,/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp,/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa,/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'

      expect(options).to.include({
        b: false,
        bootstrap: false,
        'bootstrap-peers': bootstrapPeers,
        bootstrapPeers,
        hostAddrs: '/ip4/0.0.0.0/tcp/0',
        announceAddrs: '',
        'conn-mgr': false,
        connMgr: false,
        dht: false,
        'dht-client': false,
        dhtClient: false,
        q: false,
        quiet: false,
        listen: '/unix/tmp/p2pd.sock'
      })

      return {
        start: async () => {},
        stop: async () => {},
        getMultiaddr: () => multiaddr()
      }
    })

    await cli([
      '/bin/node',
      '/daemon/src/cli/bin.js'
    ])
  })

  it('should be able to specify options', async () => {
    sinon.stub(server, 'createLibp2pServer').callsFake(async (ma, options) => {
      expect(options).to.include({
        b: true,
        bootstrap: true,
        'bootstrap-peers': '/p2p/Qm1,/p2p/Qm2',
        bootstrapPeers: '/p2p/Qm1,/p2p/Qm2',
        hostAddrs: '/ip4/0.0.0.0/tcp/0,/ip4/0.0.0.0/tcp/0/wss',
        announceAddrs: '/ip4/0.0.0.0/tcp/8080',
        'conn-mgr': true,
        connMgr: true,
        dht: true,
        'dht-client': true,
        dhtClient: true,
        id: '/path/to/key',
        q: true,
        quiet: true,
        listen: '/unix/tmp/d.sock'
      })

      return {
        start: async () => {},
        stop: async () => {},
        getMultiaddr: () => multiaddr()
      }
    })

    await cli([
      '/bin/node',
      '/daemon/src/cli/bin.js',
      '--dht=true',
      '--b=true',
      '--bootstrapPeers=/p2p/Qm1,/p2p/Qm2',
      '--hostAddrs=/ip4/0.0.0.0/tcp/0,/ip4/0.0.0.0/tcp/0/wss',
      '--announceAddrs=/ip4/0.0.0.0/tcp/8080',
      '--connMgr=true',
      '--dhtClient=true',
      '--quiet=true',
      '--id=/path/to/key',
      '--listen=/unix/tmp/d.sock'
    ])
  })
})
