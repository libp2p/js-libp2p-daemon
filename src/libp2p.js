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
const { PassThrough } = require('readable-stream')

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
  constructor (routing) {
    this._routing = routing
  }

  /**
   *
   * @param {CID} cid The cid to find providers for
   * @param {object} options
   * @param {number} options.maxTimeout How long the query should run
   * @param {number} options.maxNumProviders maximum number of providers to find
   * @returns {Promise}
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
   *
   * @param {CID} cid The cid to register as a provider of
   * @returns {Promise}
   */
  provide (cid) {
    return new Promise((resolve, reject) => {
      this._routing.provide(cid, (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  }
}

class DHT {
  constructor (libp2p) {
    this.libp2p = libp2p
  }

  /**
   * Gets the peers with ids that most closely match the given key
   * @param {Buffer} key
   */
  getClosestPeers (key) {
    return new Promise((resolve, reject) => {
      this.libp2p._dht.getClosestPeers(key, (err, peers) => {
        if (err) return reject(err)
        resolve(peers)
      })
    }).catch(err => {
      console.log('Kaboom')
      throw err
    })
  }

  put (key, value) {
    return new Promise((resolve, reject) => {
      this.libp2p._dht.put(key, value, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  get (key, options) {
    return new Promise((resolve, reject) => {
      this.libp2p._dht.get(key, options, (err, val) => {
        if (err) return reject(err)
        resolve(val)
      })
    })
  }

  getMany (key, nVals, options) {
    return new Promise((resolve, reject) => {
      this.libp2p._dht.getMany(key, nVals, options, (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  }

  /**
   * Gets the public key for the given peer
   * @param {PeerId} peerId
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
   * @returns {Promise}
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
   * @returns {Promise}
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
   * @param {PeerInfo} peerInfo
   * @param {string} protocol
   * @returns {Promise}
   */
  dial (peerInfo, protocol) {
    return new Promise((resolve, reject) => {
      this.dialProtocol(peerInfo, protocol, (err, conn) => {
        if (err) return reject(err)
        if (!conn) return resolve()

        // Convert the pull stream to an iterable node stream
        const connection = pullToStream(conn)
        let iterable = new PassThrough({ objectMode: true })
        iterable.peerInfo = conn.peerInfo
        iterable.pipe(connection)
        connection.pipe(iterable)

        resolve({
          connection: iterable,
          peerInfo: conn.peerInfo
        })
      })
    })
  }

  /**
   * Overrides the default `handle` to convert pull streams to streams
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
  sock,
  id
} = {}) => {
  const peerInfo = await getPeerInfo(id)
  const peerBook = new PeerBook()
  const bootstrapList = bootstrapPeers ? bootstrapPeers.split(',').filter(s => s !== '') : null

  // TODO: Add multiaddrs
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
