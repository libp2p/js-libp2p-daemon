'use strict'

const net = require('net')
const Libp2p = require('./libp2p')
const PeerInfo = require('peer-info')
const PeerId = require('peer-id')
const ma = require('multiaddr')
const CID = require('cids')
const { encode, decode } = require('length-prefixed-stream')
const { multiaddrToNetConfig } = require('./util')
const {
  Request,
  DHTRequest,
  PSRequest,
  Response,
  DHTResponse,
  PSResponse,
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
    this.server = net.createServer({
      allowHalfOpen: true
    }, this.handleConnection.bind(this))
    this.streamHandlers = {}
    this._listen()
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
    const addrs = connectRequest.connect.addrs
    const peerInfo = new PeerInfo(
      PeerId.createFromBytes(peer)
    )
    addrs.forEach((a) => {
      peerInfo.multiaddrs.add(ma(a))
    })

    return this.libp2p.dial(peerInfo)
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
    const peerInfo = new PeerInfo(
      PeerId.createFromB58String(peer)
    )

    let connection
    let successfulProto
    for (const protocol of proto) {
      try {
        connection = await this.libp2p.dial(peerInfo, protocol)
        successfulProto = protocol
        break
      } catch (err) {
        log(err)
        // We can ignore this, and try other protos
      }
    }

    if (!connection) {
      throw new Error('no protocols could be dialed')
    }

    return {
      streamInfo: {
        peer: peerInfo.id.toBytes(),
        addr: connection.peerInfo.isConnected().buffer,
        proto: successfulProto
      },
      connection: connection
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
  registerStreamHandler (request) {
    return new Promise((resolve, reject) => {
      const protocols = request.streamHandler.proto
      const addr = ma(request.streamHandler.addr)
      const addrString = addr.toString()

      // If we have a handler, end it
      if (this.streamHandlers[addrString]) {
        this.streamHandlers[addrString].end()
        delete this.streamHandlers[addrString]
      }

      const socket = this.streamHandlers[addrString] = new net.Socket({
        readable: true,
        writable: true,
        allowHalfOpen: true
      })

      protocols.forEach((proto) => {
        // Connect the client socket with the libp2p connection
        this.libp2p.handle(proto, (conn) => {
          const enc = encode()

          const addr = conn.peerInfo.isConnected()
          const message = StreamInfo.encode({
            peer: conn.peerInfo.id.toBytes(),
            addr: addr ? addr.buffer : Buffer.alloc(0),
            proto: proto
          })

          // Tell the client about the new connection
          enc.pipe(socket)
          enc.write(message)
          enc.unpipe(socket)

          // And then begin piping the client and peer connection
          conn.pipe(socket)
          socket.pipe(conn)
        })
      })

      const options = multiaddrToNetConfig(addr)
      socket.connect(options, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  /**
   * Listens for process exit to handle cleanup
   *
   * @private
   * @returns {void}
   */
  _listen () {
    // listen for graceful termination
    process.on('SIGTERM', () => this.stop({ exit: true }))
    process.on('SIGINT', () => this.stop({ exit: true }))
    process.on('SIGHUP', () => this.stop({ exit: true }))
  }

  /**
   * Starts the daemon
   *
   * @returns {Promise<void>}
   */
  async start () {
    await this.libp2p.start()
    return new Promise((resolve, reject) => {
      const options = multiaddrToNetConfig(this.multiaddr)
      this.server.listen(options, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
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
    return new Promise((resolve) => {
      this.server.close(() => {
        if (options.exit) {
          log('server closed, exiting')
          // return process.exit(0)
        }
        resolve()
      })
    })
  }

  /**
   * Parses and responds to PSRequests
   *
   * @private
   * @param {Request} request
   * @returns {PSResponse[]}
   */
  async handlePubsubRequest ({ pubsub }) {
    switch (pubsub.type) {
      case PSRequest.Type.GET_TOPICS:
        const topics = await this.libp2p.ps.getTopics()

        return [OkResponse({
          pubsub: {
            topics,
          }
        })]
      case PSRequest.Type.PUBLISH:
        const topic = pubsub.topic
        const data = pubsub.data

        await this.libp2p.ps.publish(topic, data)
        return [OkResponse()]
      default:
        throw new Error('ERR_INVALID_REQUEST_TYPE')
    }
  }

  /**
   * Parses and responds to DHTRequests
   *
   * @private
   * @param {Request} request
   * @returns {DHTResponse[]}
   */
  async handleDHTRequest ({ dht }) {
    switch (dht.type) {
      case DHTRequest.Type.FIND_PEER: {
        const peerId = PeerId.createFromBytes(dht.peer)
        let peer = await this.libp2p.peerRouting.findPeer(peerId)

        return [OkResponse({
          dht: {
            type: DHTResponse.Type.VALUE,
            peer: {
              id: peer.id.toBytes(),
              addrs: peer.multiaddrs.toArray().map(m => m.buffer)
            }
          }
        })]
      }
      case DHTRequest.Type.FIND_PROVIDERS: {
        const cid = new CID(dht.cid)
        const maxNumProviders = dht.count
        // Currently the dht doesn't provide a streaming interface.
        // So we need to collect all of the responses and then compose
        // the response 'stream' to the client
        let responses = [OkResponse({
          dht: {
            type: DHTResponse.Type.BEGIN
          }
        })]

        const providers = await this.libp2p.contentRouting.findProviders(cid, {
          maxNumProviders
        })

        providers.forEach(provider => {
          responses.push(DHTResponse.encode({
            type: DHTResponse.Type.VALUE,
            peer: {
              id: provider.id.toBytes(),
              addrs: provider.multiaddrs.toArray().map(m => m.buffer)
            }
          }))
        })

        responses.push(DHTResponse.encode({
          type: DHTResponse.Type.END
        }))

        return responses
      }
      case DHTRequest.Type.PROVIDE: {
        const cid = new CID(dht.cid)
        await this.libp2p.contentRouting.provide(cid)
        return [OkResponse()]
      }
      case DHTRequest.Type.GET_CLOSEST_PEERS: {
        const peerIds = await this.libp2p.dht.getClosestPeers(
          Buffer.from(dht.key)
        )

        let responses = [OkResponse({
          dht: {
            type: DHTResponse.Type.BEGIN
          }
        })]

        peerIds.forEach(peerId => {
          responses.push(DHTResponse.encode({
            type: DHTResponse.Type.VALUE,
            value: peerId.toB58String()
          }))
        })

        responses.push(DHTResponse.encode({
          type: DHTResponse.Type.END
        }))

        return responses
      }
      case DHTRequest.Type.GET_PUBLIC_KEY: {
        const peerId = PeerId.createFromBytes(dht.peer)
        const pubKey = await this.libp2p.dht.getPublicKey(peerId)

        return [OkResponse({
          dht: {
            type: DHTResponse.Type.VALUE,
            value: pubKey.bytes
          }
        })]
      }
      case DHTRequest.Type.GET_VALUE: {
        const value = await this.libp2p.dht.get(
          Buffer.from(dht.key)
        )

        return [OkResponse({
          dht: {
            type: DHTResponse.Type.VALUE,
            value: value
          }
        })]
      }
      case DHTRequest.Type.PUT_VALUE: {
        await this.libp2p.dht.put(
          Buffer.from(dht.key),
          dht.value
        )

        return [OkResponse()]
      }
      default:
        throw new Error('ERR_INVALID_REQUEST_TYPE')
    }
  }

  /**
   * Handles requests for the given connection
   *
   * @private
   * @param {Stream} conn Connection from the daemon client
   * @returns {void}
   */
  async handleConnection (conn) {
    const dec = decode({ limit: LIMIT })
    const enc = encode()
    enc.pipe(conn)
    conn.pipe(dec)

    for await (const message of dec) {
      let request
      try {
        request = Request.decode(Buffer.from(message))
      } catch (err) {
        return enc.write(ErrorResponse('ERR_INVALID_MESSAGE'))
      }

      switch (request.type) {
        // Connect to another peer
        case Request.Type.CONNECT: {
          try {
            await this.connect(request)
          } catch (err) {
            enc.write(ErrorResponse(err.message))
            break
          }
          enc.write(OkResponse())
          break
        }
        // Get the daemon peer id and addresses
        case Request.Type.IDENTIFY: {
          enc.write(OkResponse({
            identify: {
              id: this.libp2p.peerInfo.id.toBytes(),
              // temporary removal of "/ipfs/..." from multiaddrs
              // this will be solved in: https://github.com/libp2p/js-libp2p/issues/323
              addrs: this.libp2p.peerInfo.multiaddrs.toArray().map(m => {
                let buffer
                try {
                  buffer = m.decapsulate('ipfs').buffer
                } catch (_) {
                  buffer = m.buffer
                }
                return buffer
              })
            }
          }))
          break
        }
        // Get a list of our current peers
        case Request.Type.LIST_PEERS: {
          const peers = this.libp2p.peerBook.getAllArray().map((pi) => {
            const addr = pi.isConnected()
            return {
              id: pi.id.toBytes(),
              addrs: [addr ? addr.buffer : null]
            }
          })
          enc.write(OkResponse({
            peers
          }))
          break
        }
        case Request.Type.STREAM_OPEN: {
          let response
          try {
            response = await this.openStream(request)
          } catch (err) {
            enc.write(ErrorResponse(err.message))
            break
          }

          // write the response
          enc.write(OkResponse({
            streamInfo: response.streamInfo
          }))
          enc.unpipe(conn)
          conn.unpipe(dec)

          // then pipe the connection to the client
          conn.pipe(response.connection).pipe(conn)
          break
        }
        case Request.Type.STREAM_HANDLER: {
          try {
            await this.registerStreamHandler(request)
          } catch (err) {
            enc.write(ErrorResponse(err.message))
            break
          }

          // write the response
          enc.write(OkResponse())
          break
        }
        case Request.Type.PUBSUB: {
          // subscribe message
          if (request.pubsub.type === PSRequest.Type.SUBSCRIBE) {
            const topic = request.pubsub.topic

            try {
              await this.libp2p.ps.subscribe(topic, {}, (msg) => {
                enc.write(OkResponse())
              })
              
              enc.write(OkResponse())
            } catch (err) {
              enc.write(ErrorResponse(err.message))
              break
            }
          } else {
            // other messages
            try {
              const responses = await this.handlePubsubRequest(request)
              for (const response of responses) {
                // write and wait for the flush
                await new Promise((resolve) => {
                  enc.write(response, resolve)
                })
              }
            } catch (err) {
              enc.write(ErrorResponse(err.message))
              break
            }
          }
          break
        }
        case Request.Type.DHT: {
          try {
            // DHT responses may require multiple writes
            const responses = await this.handleDHTRequest(request)
            for (const response of responses) {
              // write and wait for the flush
              await new Promise((resolve) => {
                enc.write(response, resolve)
              })
            }
          } catch (err) {
            enc.write(ErrorResponse(err.message))
            break
          }
          break
        }
        // Not yet supported or doesn't exist
        default:
          enc.write(ErrorResponse('ERR_INVALID_REQUEST_TYPE'))
          break
      }
    }

    // The other end hung up, let's also do that
    conn.end()
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
