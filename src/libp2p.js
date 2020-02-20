'use strict'

const Libp2p = process.env.LIBP2P_JS ? require(process.env.LIBP2P_JS) : require('libp2p')
const TCP = require('libp2p-tcp')
const WS = require('libp2p-websockets')
const Bootstrap = require('libp2p-bootstrap')
const MPLEX = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const { Noise } = require('libp2p-noise')
const KadDHT = require('libp2p-kad-dht')
const FloodSub = require('libp2p-floodsub')
const GossipSub = require('libp2p-gossipsub')
const PeerInfo = require('peer-info')
const PeerID = require('peer-id')
const multiaddr = require('multiaddr')
const fsPromises = require('fs').promises

/**
 * Creates a PeerInfo from scratch, or via the supplied private key
 * @param {string} privateKeyPath Path to private key
 * @returns {Promise<PeerInfo>} Resolves the created PeerInfo
 */
const getPeerInfo = async (privateKeyPath) => {
  if (!privateKeyPath) {
    return PeerInfo.create()
  }

  const pkFile = await fsPromises.open(privateKeyPath, 'r')
  let buf
  try {
    buf = await pkFile.readFile()
  } finally {
    pkFile.close()
  }
  const peerId = await PeerID.createFromPrivKey(buf)

  return new PeerInfo(peerId)
}

class DaemonLibp2p extends Libp2p {
  constructor (libp2pOpts, { announceAddrs }) {
    super(libp2pOpts)
    this.announceAddrs = announceAddrs
    this.needsPullStream = libp2pOpts.config.pubsub.enabled
  }

  /**
   * Starts the libp2p node
   * @override
   * @returns {Promise<void>}
   */
  async start () {
    await super.start()
    // replace with announce addrs until libp2p supports this directly
    if (this.announceAddrs.length > 0) {
      this.peerInfo.multiaddrs.clear()
      this.announceAddrs.forEach(addr => {
        this.peerInfo.multiaddrs.add(addr)
      })
    }
  }
}

/**
 *
 * @param {Options} opts
 * @param {boolean} opts.quiet
 * @param {boolean} opts.bootstrap
 * @param {boolean} opts.dht
 * @param {boolean} opts.connMgr
 * @param {number} opts.connMgrHi
 * @param {string} opts.id
 * @param {string} opts.bootstrapPeers
 * @param {string} opts.hostAddrs
 * @param {boolean} opts.pubsub
 * @param {string} opts.pubsubRouter
 * @returns {Libp2p}
 */
const createLibp2p = async ({
  bootstrap,
  bootstrapPeers,
  hostAddrs,
  announceAddrs,
  secio,
  noise,
  dht,
  connMgrLo,
  connMgrHi,
  id,
  pubsub,
  pubsubRouter
} = {}) => {
  const peerInfo = await getPeerInfo(id)
  const bootstrapList = bootstrapPeers ? bootstrapPeers.split(',').filter(s => s !== '') : null
  const listenAddrs = hostAddrs ? hostAddrs.split(',').filter(s => s !== '') : ['/ip4/0.0.0.0/tcp/0']

  announceAddrs = announceAddrs ? announceAddrs.split(',').filter(s => s !== '') : []
  announceAddrs = announceAddrs.map(addr => multiaddr(addr))

  listenAddrs.forEach(addr => {
    peerInfo.multiaddrs.add(multiaddr(addr))
  })
  const connEncryption = []
  if (secio !== false) connEncryption.push(SECIO)
  if (noise) connEncryption.push(new Noise(null, null, true))

  const libp2p = new DaemonLibp2p({
    peerInfo,
    connectionManager: {
      maxPeers: connMgrHi,
      minPeers: connMgrLo
    },
    modules: {
      transport: [
        TCP,
        WS
      ],
      streamMuxer: [
        MPLEX
      ],
      connEncryption,
      peerDiscovery: [
        Bootstrap
      ],
      dht: KadDHT,
      pubsub: pubsubRouter === 'floodsub' ? GossipSub : FloodSub
    },
    config: {
      peerDiscovery: {
        bootstrap: {
          interval: 10000,
          enabled: bootstrap || false,
          list: bootstrapList
        }
      },
      relay: {
        enabled: true,
        hop: {
          enabled: true,
          active: true
        }
      },
      dht: {
        enabled: dht,
        kBucketSize: 20
      },
      pubsub: {
        enabled: Boolean(pubsub)
      }
    }
  }, {
    // using a secondary config until https://github.com/libp2p/js-libp2p/issues/202
    // is completed
    announceAddrs
  })

  return libp2p
}

module.exports.createLibp2p = createLibp2p
