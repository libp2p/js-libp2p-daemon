'use strict'

const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const Bootstrap = require('libp2p-bootstrap')
const MPLEX = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const KadDHT = require('libp2p-kad-dht')
const pullToStream = require('pull-stream-to-stream')
const PeerBook = require('peer-book')
const PeerInfo = require('peer-info')
const PeerID = require('peer-id')
const path = require('path')
const multiaddr = require('multiaddr')

/**
 * Creates a PeerInfo from scratch, or via the supplied private key
 * @param {string} privateKey Path to private key
 * @returns {Promise} Resolves the created PeerInfo
 */
const getPeerInfo = (privateKey) => {
  return new Promise((resolve, reject) => {
    if (!privateKey) {
      PeerInfo.create((err, peerInfo) => {
        if (err) {
          return reject(err)
        }
        resolve(peerInfo)
      })
    } else {
      PeerID.createFromPrivKey(path.resolve(privateKey), (err, peerId) => {
        if (err) {
          return reject(err)
        }
        resolve(new PeerInfo(peerId))
      })
    }
  })
}

class PeerRouting {
  /**
   * @constructor
   * @param {PeerRouter} routing A Peer Routing compliant implementation
   */
  constructor (routing) {
    this._routing = routing
  }

  /**
   *
   * @param {PeerID} id The peer to find
   * @param {object} options
   * @param {number} options.maxTimeout How long the query should run
   * @returns {Promise}
   */
  findPeer (id, options) {
    return new Promise((resolve, reject) => {
      this._routing.findPeer(id, options, (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  }
}

class ContentRouting {
  /**
   * @constructor
   * @param {PeerRouter} routing A Content Routing compliant implementation
   */
  constructor (routing) {
    this._routing = routing
  }

  /**
   * Search the dht for up to `K` providers of the given CID.
   *
   * @param {CID} cid The cid to find providers for
   * @param {object} options
   * @param {number} options.maxTimeout How long the query should run
   * @param {number} options.maxNumProviders maximum number of providers to find
   * @returns {Promise<PeerInfo[]>}
   */
  findProviders (cid, options) {
    return new Promise((resolve, reject) => {
      this._routing.findProviders(cid, options, (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  }

  /**
   * Announce to the network that we can provide given key's value.
   *
   * @param {CID} cid The cid to register as a provider of
   * @returns {Promise<void>}
   */
  provide (cid) {
    return new Promise((resolve, reject) => {
      this._routing.provide(cid, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}

class DHT {
  /**
   * @param {Libp2p} libp2p The libp2p instance to use
   */
  constructor (libp2p) {
    this.libp2p = libp2p
  }

  /**
   * Gets the peers with ids that most closely match the given key
   *
   * @param {Buffer} key
   * @returns {Promise<PeerId[]>} Array of peers
   */
  getClosestPeers (key) {
    return new Promise((resolve, reject) => {
      this.libp2p._dht.getClosestPeers(key, (err, peers) => {
        if (err) return reject(err)
        resolve(peers)
      })
    }).catch(err => {
      throw err
    })
  }

  /**
   * Store the given key/value  pair in the DHT.
   *
   * @param {Buffer} key
   * @param {Buffer} value
   * @returns {Promise<void>}
   */
  put (key, value) {
    return new Promise((resolve, reject) => {
      this.libp2p._dht.put(key, value, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  /**
   * Get the value to the given key.
   *
   * @param {Buffer} key
   * @param {Object} options - get options
   * @param {number} options.timeout - optional timeout (default: 60000)
   * @returns {Promise<Buffer>}
   */
  get (key, options) {
    return new Promise((resolve, reject) => {
      this.libp2p._dht.get(key, options, (err, val) => {
        if (err) return reject(err)
        resolve(val)
      })
    })
  }

  /**
   * Get the `n` values to the given key without sorting.
   *
   * @param {Buffer} key
   * @param {number} nvals
   * @param {Object} options - get options
   * @param {number} options.timeout - optional timeout (default: 60000)
   * @returns {Promise<{from: PeerId, val: Buffer}[]>}
   */
  getMany (key, nvals, options) {
    return new Promise((resolve, reject) => {
      this.libp2p._dht.getMany(key, nvals, options, (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  }

  /**
   * Gets the public key for the given peer
   * @param {PeerId} peerId
   * @returns {Promise<PubKey>} public key
   */
  getPublicKey (peerId) {
    return new Promise((resolve, reject) => {
      this.libp2p._dht.getPublicKey(peerId, (err, key) => {
        if (err) return reject(err)
        resolve(key)
      })
    })
  }
}

class DaemonLibp2p extends Libp2p {
  get contentRouting () {
    return this._contentRouting
  }
  set contentRouting (routing) {
    this._contentRouting = new ContentRouting(routing)
  }
  get peerRouting () {
    return this._peerRouting
  }
  set peerRouting (routing) {
    this._peerRouting = new PeerRouting(routing)
  }
  get dht () {
    return this._kadDHT
  }
  set dht (_) {
    this._kadDHT = new DHT(this)
  }

  /**
   * Starts the libp2p node
   *
   * @returns {Promise<void>}
   */
  start () {
    return new Promise((resolve, reject) => {
      super.start((err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  /**
   * Stops the libp2p node
   *
   * @returns {Promise<void>}
   */
  stop () {
    return new Promise((resolve, reject) => {
      super.stop((err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  /**
   * Dials the given peer on protocol. The promise will resolve with the connection
   *
   * @param {PeerInfo} peerInfo
   * @param {string} protocol
   * @returns {Promise<Connection>}
   */
  dial (peerInfo, protocol) {
    return new Promise((resolve, reject) => {
      this.dialProtocol(peerInfo, protocol, (err, conn) => {
        if (err) return reject(err)
        if (!conn) return resolve()

        // Convert the pull stream to an iterable node stream
        const connection = pullToStream(conn)
        connection.peerInfo = conn.peerInfo

        resolve(connection)
      })
    })
  }

  /**
   * Overrides the default `handle` to convert pull streams to streams
   *
   * @param {string} protocol
   * @param {function(Stream)} handler
   */
  handle (protocol, handler) {
    super.handle(protocol, (_, conn) => {
      conn.getPeerInfo((_, peerInfo) => {
        let connection = pullToStream(conn)
        connection.peerInfo = peerInfo
        handler(connection)
      })
    })
  }
}

/**
 *
 * @param {Options} opts
 * @param {boolean} opts.quiet
 * @param {boolean} opts.bootstrap
 * @param {boolean} opts.dht
 * @param {boolean} opts.dhtClient
 * @param {boolean} opts.connMgr
 * @param {number} opts.connMgrLo
 * @param {number} opts.connMgrHi
 * @param {string} opts.sock
 * @param {string} opts.id
 * @param {string} opts.bootstrapPeers
 * @returns {Libp2p}
 */
const createLibp2p = async ({
  bootstrap,
  bootstrapPeers,
  dht,
  dhtClient,
  connMgr,
  connMgrLo,
  connMgrHi,
  id
} = {}) => {
  const peerInfo = await getPeerInfo(id)
  const peerBook = new PeerBook()
  const bootstrapList = bootstrapPeers ? bootstrapPeers.split(',').filter(s => s !== '') : null

  peerInfo.multiaddrs.add(multiaddr('/ip4/0.0.0.0/tcp/0'))

  const libp2p = new DaemonLibp2p({
    peerBook,
    peerInfo,
    connectionManager: {
      maxPeers: connMgrHi,
      minPeers: connMgrLo
    },
    modules: {
      transport: [
        TCP
      ],
      streamMuxer: [
        MPLEX
      ],
      connEncryption: [
        SECIO
      ],
      peerDiscovery: [
        Bootstrap
      ],
      dht: KadDHT
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
        kBucketSize: 20
      },
      EXPERIMENTAL: {
        dht: dht,
        pubsub: false
      }
    }
  })

  return libp2p
}

module.exports.createLibp2p = createLibp2p
