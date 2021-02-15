'use strict'

const Libp2p = process.env.LIBP2P_JS ? require(process.env.LIBP2P_JS) : require('libp2p')
const TCP = require('libp2p-tcp')
const WS = require('libp2p-websockets')
const Bootstrap = require('libp2p-bootstrap')
const MPLEX = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const { NOISE } = require('libp2p-noise')
const KadDHT = require('libp2p-kad-dht')
const FloodSub = require('libp2p-floodsub')
const GossipSub = require('libp2p-gossipsub')
const PeerID = require('peer-id')
const multiaddr = require('multiaddr')
const fsPromises = require('fs').promises

/**
 * Creates a Peerid from scratch, or via the supplied private key
 *
 * @param {string} privateKeyPath - Path to private key
 * @returns {Promise<Peerid>} Resolves the created Peerid
 */
const getPeerId = async (privateKeyPath) => {
  if (!privateKeyPath) {
    return PeerID.create()
  }

  const pkFile = await fsPromises.open(privateKeyPath, 'r')
  let buf
  try {
    buf = await pkFile.readFile()
  } finally {
    pkFile.close()
  }
  return PeerID.createFromPrivKey(buf)
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
  const peerId = await getPeerId(id)
  const bootstrapList = bootstrapPeers ? bootstrapPeers.split(',').filter(s => s !== '') : null
  const listenAddrs = hostAddrs ? hostAddrs.split(',').filter(s => s !== '') : ['/ip4/0.0.0.0/tcp/0']

  announceAddrs = announceAddrs ? announceAddrs.split(',').filter(s => s !== '') : []
  announceAddrs = announceAddrs.map(addr => multiaddr(addr))

  const connEncryption = []
  if (secio !== false) connEncryption.push(SECIO)
  if (noise) connEncryption.push(NOISE)

  const libp2p = Libp2p.create({
    peerId,
    addresses: {
      listen: listenAddrs,
      announce: announceAddrs
    },
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
  })

  return libp2p
}

module.exports.createLibp2p = createLibp2p
