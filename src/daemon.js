/* eslint max-depth: ["error", 6] */

'use strict'

const TCP = require('libp2p-tcp')
const Libp2p = require('./libp2p')
const PeerId = require('peer-id')
const ma = require('multiaddr')
const CID = require('cids')
const lp = require('it-length-prefixed')
const pipe = require('it-pipe')
const pushable = require('it-pushable')
const StreamHandler = require('./stream-handler')
const { concat } = require('streaming-iterables')
const uint8ArrayFromString = require('uint8arrays/from-string')
const uint8ArrayToString = require('uint8arrays/to-string')
const { passThroughUpgrader } = require('./util')
const {
  Request,
  DHTRequest,
  PeerstoreRequest,
  PSRequest,
  Response,
  DHTResponse,
  PSMessage,
  StreamInfo
} = require('./protocol')
const LIMIT = 1 << 22 // 4MB

const log = require('debug')('libp2p:daemon')

class Daemon {
  /**
   * @constructor
   * @param {object} options
   * @param {string} options.multiaddr
   * @param {Libp2p} options.libp2pNode
   */
  constructor ({
    multiaddr,
    libp2pNode
  }) {
    this.multiaddr = ma(multiaddr)
    this.libp2p = libp2pNode
    this.tcp = new TCP({ upgrader: passThroughUpgrader })
    this.listener = this.tcp.createListener((maConn) => {
      this.handleConnection(maConn)
    })
    this.streamHandlers = {}
    this._onExit = this._onExit.bind(this)
  }

  /**
   * Connects the daemons libp2p node to the peer provided
   * in the ConnectRequest
   *
   * @param {ConnectRequest} connectRequest
   * @returns {Promise<Connection>}
   */
  connect (connectRequest) {
    const peer = connectRequest.connect.peer
    const addrs = connectRequest.connect.addrs.map((a) => ma(a))
    const peerId = PeerId.createFromBytes(peer)

    this.libp2p.peerStore.addressBook.set(peerId, addrs)
    return this.libp2p.dial(peerId)
  }

  /**
   * A number, or a string containing a number.
   * @typedef {Object} OpenStream
   * @property {StreamInfo} streamInfo
   * @property {Stream} connection
   */

  /**
   * Opens a stream on one of the given protocols to the given peer
   * @param {StreamOpenRequest} request
   * @throws {Error}
   * @returns {OpenStream}
   */
  async openStream (request) {
    const { peer, proto } = request.streamOpen

    const peerId = PeerId.createFromB58String(uint8ArrayToString(peer, 'base58btc'))

    const connection = this.libp2p.connectionManager.get(peerId)
    const { stream, protocol } = await connection.newStream(proto)

    return {
      streamInfo: {
        peer: peerId.toBytes(),
        addr: connection.remoteAddr.bytes,
        proto: protocol
      },
      connection: stream
    }
  }

  /**
   * Sends inbound requests for the given protocol
   * to the unix socket path provided. If an existing handler
   * is registered at the path, it will be overridden.
   *
   * @param {StreamHandlerRequest} request
   * @returns {Promise<void>}
   */
  async registerStreamHandler (request) {
    const protocols = request.streamHandler.proto
    const addr = ma(request.streamHandler.addr)
    const addrString = addr.toString()

    // If we have a handler, end it
    if (this.streamHandlers[addrString]) {
      this.streamHandlers[addrString].end()
      delete this.streamHandlers[addrString]
    }

    protocols.forEach((proto) => {
      // Connect the client socket with the libp2p connection
      this.libp2p.handle(proto, ({ connection, stream, protocol }) => {
        const message = StreamInfo.encode({
          peer: connection.remotePeer.toBytes(),
          addr: connection.remoteAddr.bytes,
          proto: protocol
        })
        const encodedMessage = lp.encode.single(message)

        // Tell the client about the new connection
        // And then begin piping the client and peer connection
        pipe(
          concat([encodedMessage], stream.source),
          clientConnection,
          stream.sink
        )
      })
    })

    const clientConnection = await this.tcp.dial(addr)
  }

  /**
   * Listens for process exit to handle cleanup
   *
   * @private
   * @returns {void}
   */
  _listen () {
    // listen for graceful termination
    process.on('SIGTERM', this._onExit)
    process.on('SIGINT', this._onExit)
    process.on('SIGHUP', this._onExit)
  }

  _onExit () {
    this.stop({ exit: true })
  }

  /**
   * Starts the daemon
   *
   * @returns {Promise<void>}
   */
  async start () {
    this._listen()
    await this.libp2p.start()
    await this.listener.listen(this.multiaddr)
  }

  /**
   * Stops the daemon
   *
   * @param {object} options
   * @param {boolean} options.exit If the daemon process should exit
   * @returns {Promise<void>}
   */
  async stop (options = { exit: false }) {
    await this.libp2p.stop()
    await this.listener.close()
    if (options.exit) {
      log('server closed, exiting')
    }
    process.removeListener('SIGTERM', this._onExit)
    process.removeListener('SIGINT', this._onExit)
    process.removeListener('SIGHUP', this._onExit)
  }

  handlePeerStoreRequest ({ peerStore }) {
    const peerStoreAction = {
      [PeerstoreRequest.Type.GET_PROTOCOLS]: function * (daemon) {
        try {
          const peerId = PeerId.createFromBytes(peerStore.id)
          const peer = daemon.libp2p.peerStore.get(peerId)
          const protos = peer.protocols
          yield OkResponse({ peerStore: { protos } })
        } catch (err) {
          throw new Error('ERR_INVALID_PEERSTORE_REQUEST')
        }
      },
      [PeerstoreRequest.Type.GET_PEER_INFO]: function * () {
        yield ErrorResponse('ERR_NOT_IMPLEMENTED')
      },
      invalid: function * () {
        yield ErrorResponse('ERR_INVALID_REQUEST_TYPE')
      }
    }

    return peerStoreAction[peerStore.type](this)
  }

  /**
   * Parses and responds to PSRequests. An async generator will
   * be returned.
   *
   * @private
   * @param {Request} request
   * @returns {*} Returns an async generator
   */
  handlePubsubRequest ({ pubsub }) {
    const pubsubAction = {
      [PSRequest.Type.GET_TOPICS]: async function * (daemon) {
        const topics = await daemon.libp2p.pubsub.getTopics()
        yield OkResponse({ pubsub: { topics } })
      },
      [PSRequest.Type.SUBSCRIBE]: async function * (daemon) {
        const topic = pubsub.topic
        const onMessage = pushable()

        await daemon.libp2p.pubsub.subscribe(topic, (msg) => {
          onMessage.push(PSMessage.encode({
            from: msg.from && uint8ArrayFromString(msg.from),
            data: msg.data,
            seqno: msg.seqno,
            topicIDs: msg.topicIDs,
            signature: msg.signature,
            key: msg.key
          }))
        })

        yield OkResponse()
        yield * onMessage
      },
      [PSRequest.Type.PUBLISH]: async function * (daemon) {
        const topic = pubsub.topic
        const data = pubsub.data

        await daemon.libp2p.pubsub.publish(topic, data)
        yield OkResponse()
      },
      invalid: function * () {
        yield ErrorResponse('ERR_INVALID_REQUEST_TYPE')
      }
    }

    if (!pubsubAction[pubsub.type]) {
      return pubsubAction.invalid()
    }

    return pubsubAction[pubsub.type](this)
  }

  /**
   * Parses and responds to DHTRequests
   *
   * @private
   * @param {Request} request
   * @returns {DHTResponse[]}
   */
  handleDHTRequest ({ dht }) {
    const dhtAction = {
      [DHTRequest.Type.FIND_PEER]: async function * (daemon) {
        const peerId = PeerId.createFromBytes(dht.peer)
        try {
          const peer = await daemon.libp2p.peerRouting.findPeer(peerId)

          yield OkResponse({
            dht: {
              type: DHTResponse.Type.VALUE,
              peer: {
                id: peer.id.toBytes(),
                addrs: peer.multiaddrs.map(m => m.bytes)
              }
            }
          })
        } catch (err) {
          yield ErrorResponse(err.message)
        }
      },
      [DHTRequest.Type.FIND_PROVIDERS]: async function * (daemon) {
        const cid = new CID(dht.cid)
        const maxNumProviders = dht.count
        let okSent = false
        try {
          for await (const provider of daemon.libp2p.contentRouting.findProviders(cid, {
            maxNumProviders
          })) {
            if (!okSent) {
              okSent = true
              yield OkResponse({
                dht: {
                  type: DHTResponse.Type.BEGIN
                }
              })
            }

            yield DHTResponse.encode({
              type: DHTResponse.Type.VALUE,
              peer: {
                id: provider.id.toBytes(),
                addrs: (provider.multiaddrs || []).map(m => m.bytes)
              }
            })
          }
        } catch (err) {
          yield ErrorResponse(err.message)
          return
        }

        yield DHTResponse.encode({
          type: DHTResponse.Type.END
        })
      },
      [DHTRequest.Type.PROVIDE]: async function * (daemon) {
        const cid = new CID(dht.cid)
        await daemon.libp2p.contentRouting.provide(cid)
        yield OkResponse()
      },
      [DHTRequest.Type.GET_CLOSEST_PEERS]: async function * (daemon) {
        yield OkResponse({
          dht: {
            type: DHTResponse.Type.BEGIN
          }
        })

        for await (const peerId of daemon.libp2p._dht.getClosestPeers(dht.key)) {
          yield DHTResponse.encode({
            type: DHTResponse.Type.VALUE,
            value: peerId.toBytes()
          })
        }

        yield DHTResponse.encode({
          type: DHTResponse.Type.END
        })
      },
      [DHTRequest.Type.GET_PUBLIC_KEY]: async function * (daemon) {
        const peerId = PeerId.createFromBytes(dht.peer)
        const pubKey = await daemon.libp2p._dht.getPublicKey(peerId)

        yield OkResponse({
          dht: {
            type: DHTResponse.Type.VALUE,
            value: pubKey.bytes
          }
        })
      },
      [DHTRequest.Type.GET_VALUE]: async function * (daemon) {
        try {
          const value = await daemon.libp2p.contentRouting.get(dht.key)
          yield OkResponse({
            dht: {
              type: DHTResponse.Type.VALUE,
              value: value
            }
          })
        } catch (err) {
          yield ErrorResponse(err.message)
        }
      },
      [DHTRequest.Type.PUT_VALUE]: async function * (daemon) {
        await daemon.libp2p.contentRouting.put(
          dht.key,
          dht.value
        )

        yield OkResponse()
      },
      invalid: function * () {
        yield ErrorResponse('ERR_INVALID_REQUEST_TYPE')
      }
    }

    if (!dhtAction[dht.type]) {
      return dhtAction.invalid()
    }

    return dhtAction[dht.type](this)
  }

  /**
   * Handles requests for the given connection
   *
   * @private
   * @param {MultiaddrConnection} maConn
   * @returns {void}
   */
  async handleConnection (maConn) {
    const daemon = this
    const streamHandler = new StreamHandler({ stream: maConn, maxLength: LIMIT })

    await pipe(
      streamHandler.decoder,
      source => (async function * () {
        for await (let request of source) {
          try {
            request = Request.decode(request.slice())
          } catch (err) {
            yield ErrorResponse('ERR_INVALID_MESSAGE')
          }

          switch (request.type) {
            // Connect to another peer
            case Request.Type.CONNECT: {
              try {
                await daemon.connect(request)
              } catch (err) {
                yield ErrorResponse(err.message)
                break
              }
              yield OkResponse()
              break
            }
            // Get the daemon peer id and addresses
            case Request.Type.IDENTIFY: {
              yield OkResponse({
                identify: {
                  id: daemon.libp2p.peerId.toBytes(),
                  addrs: daemon.libp2p.multiaddrs.map(m => m.bytes)
                }
              })
              break
            }
            // Get a list of our current peers
            case Request.Type.LIST_PEERS: {
              const peers = Array.from(daemon.libp2p.peerStore.peers.values()).map((peer) => {
                // TODO: conn mgr
                const conn = daemon.libp2p.registrar.getConnection(peer.id)
                const addr = conn.remoteAddr

                return {
                  id: peer.id.toBytes(),
                  addrs: [addr ? addr.bytes : null]
                }
              })
              yield OkResponse({ peers })
              break
            }
            case Request.Type.STREAM_OPEN: {
              let response
              try {
                response = await daemon.openStream(request)
              } catch (err) {
                yield ErrorResponse(err.message)
                break
              }

              // write the response
              yield OkResponse({
                streamInfo: response.streamInfo
              })

              const stream = streamHandler.rest()
              // then pipe the connection to the client
              await pipe(
                stream,
                response.connection,
                stream
              )
              // Exit the iterator, no more requests can come through
              return
            }
            case Request.Type.STREAM_HANDLER: {
              try {
                await daemon.registerStreamHandler(request)
              } catch (err) {
                yield ErrorResponse(err.message)
                break
              }

              // write the response
              yield OkResponse()
              break
            }
            case Request.Type.PEERSTORE: {
              yield * daemon.handlePeerStoreRequest(request)
              break
            }
            case Request.Type.PUBSUB: {
              yield * daemon.handlePubsubRequest(request)
              break
            }
            case Request.Type.DHT: {
              yield * daemon.handleDHTRequest(request)
              break
            }
            // Not yet supported or doesn't exist
            default:
              yield ErrorResponse('ERR_INVALID_REQUEST_TYPE')
              break
          }
        }
      })(),
      async function (source) {
        for await (const result of source) {
          streamHandler.write(result)
        }
      }
    )
  }
}

/**
 * Creates and encodes an OK response
 *
 * @private
 * @param {Object} data an optional map of values to be assigned to the response
 * @returns {Response}
 */
function OkResponse (data) {
  return Response.encode({
    type: Response.Type.OK,
    ...data
  })
}

/**
 * Creates and encodes an ErrorResponse
 *
 * @private
 * @param {string} message
 * @returns {ErrorResponse}
 */
function ErrorResponse (message) {
  return Response.encode({
    type: Response.Type.ERROR,
    error: {
      msg: message
    }
  })
}

/**
 * Creates a daemon from the provided Daemon Options
 *
 * @param {object} options
 * @returns {Daemon}
 */
const createDaemon = async (options) => {
  const libp2pNode = await Libp2p.createLibp2p(options)
  const daemon = new Daemon({
    multiaddr: options.listen,
    libp2pNode: libp2pNode
  })

  return daemon
}

module.exports.createDaemon = createDaemon
