/* eslint max-depth: ["error", 6] */

'use strict'

const net = require('net')
const Libp2p = require('./libp2p')
const PeerInfo = require('peer-info')
const PeerId = require('peer-id')
const ma = require('multiaddr')
const CID = require('cids')
const lp = require('it-length-prefixed')
const duplexPair = require('it-pair/duplex')
const pipe = require('it-pipe')
const Wrap = require('it-pb-rpc')
const toBuffer = require('it-buffer')
const toIterable = require('./socket-to-iterable')
const { multiaddrToNetConfig } = require('./util')
const promisify = require('promisify-es6')
const StreamHandler = require('./stream-handler')
const { concat } = require('streaming-iterables')
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
      PeerId.createFromB58String(peer.toString())
    )

    const connection = await this.libp2p.dial(peerInfo)
    const { stream, protocol } = await connection.newStream(proto)

    return {
      streamInfo: {
        peer: peerInfo.id.toBytes(),
        addr: connection.remoteAddr.buffer,
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

    const socket = this.streamHandlers[addrString] = new net.Socket({
      readable: true,
      writable: true,
      allowHalfOpen: true
    })
    const clientConnection = toIterable(socket)

    protocols.forEach((proto) => {
      // Connect the client socket with the libp2p connection
      this.libp2p.handle(proto, ({ connection, stream, protocol }) => {
        const message = StreamInfo.encode({
          peer: connection.remotePeer.toBytes(),
          addr: connection.remoteAddr.buffer,
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

    const options = multiaddrToNetConfig(addr)
    await promisify(socket.connect, { context: socket })(options)
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
    const options = multiaddrToNetConfig(this.multiaddr)
    const listen = promisify(this.server.listen, { context: this.server })
    await listen(options)
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
    const close = promisify(this.server.close, { context: this.server })
    await close()
    if (options.exit) {
      log('server closed, exiting')
    }
  }

  async handlePeerstoreRequest ({ peerStore }, streamHandler) {
    switch (peerStore.type) {
      case PeerstoreRequest.Type.GET_PROTOCOLS: {
        let protos
        try {
          const peerId = PeerId.createFromBytes(peerStore.id)
          const peerInfo = this.libp2p.peerStore.get(peerId.toB58String())
          protos = Array.from(peerInfo.protocols)
        } catch (err) {
          throw new Error('ERR_INVALID_PEERSTORE_REQUEST')
        }

        streamHandler.write(OkResponse({ peerStore: { protos } }))
        break
      }
      case PeerstoreRequest.Type.GET_PEER_INFO: {
        throw new Error('ERR_NOT_IMPLEMENTED')
      }
      default: {
        throw new Error('ERR_INVALID_REQUEST_TYPE')
      }
    }
  }

  /**
   * Parses and responds to PSRequests
   *
   * @private
   * @param {Request} request
   * @param {StreamHandler} streamHandler
   */
  async handlePubsubRequest ({ pubsub }, streamHandler) {
    switch (pubsub.type) {
      case PSRequest.Type.GET_TOPICS: {
        const topics = await this.libp2p.pubsub.getTopics()
        streamHandler.write(OkResponse({ pubsub: { topics } }))
        break
      }
      case PSRequest.Type.PUBLISH: {
        const topic = pubsub.topic
        const data = pubsub.data

        await this.libp2p.pubsub.publish(topic, data)
        streamHandler.write(OkResponse())

        break
      }
      case PSRequest.Type.SUBSCRIBE: {
        const topic = pubsub.topic

        await this.libp2p.pubsub.subscribe(topic, async (msg) => {
          streamHandler.write(PSMessage.encode({
            from: msg.from && Buffer.from(msg.from),
            data: msg.data,
            seqno: msg.seqno,
            topicIDs: msg.topicIDs,
            signature: msg.signature,
            key: msg.key
          }))
        })

        await new Promise((resolve) => {
          streamHandler.write(OkResponse(), resolve)
        })

        break
      }
      default: {
        throw new Error('ERR_INVALID_REQUEST_TYPE')
      }
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
        const peer = await this.libp2p.peerRouting.findPeer(peerId)

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
        const responses = [OkResponse({
          dht: {
            type: DHTResponse.Type.BEGIN
          }
        })]

        for await (const provider of this.libp2p.contentRouting.findProviders(cid, {
          maxNumProviders
        })) {
          responses.push(DHTResponse.encode({
            type: DHTResponse.Type.VALUE,
            peer: {
              id: provider.id.toBytes(),
              addrs: provider.multiaddrs.toArray().map(m => m.buffer)
            }
          }))
        }

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
        const responses = [OkResponse({
          dht: {
            type: DHTResponse.Type.BEGIN
          }
        })]

        for await (const peerId of this.libp2p._dht.getClosestPeers(Buffer.from(dht.key))) {
          responses.push(DHTResponse.encode({
            type: DHTResponse.Type.VALUE,
            value: peerId.toB58String()
          }))
        }

        responses.push(DHTResponse.encode({
          type: DHTResponse.Type.END
        }))

        return responses
      }
      case DHTRequest.Type.GET_PUBLIC_KEY: {
        const peerId = PeerId.createFromBytes(dht.peer)
        const pubKey = await this.libp2p._dht.getPublicKey(peerId)

        return [OkResponse({
          dht: {
            type: DHTResponse.Type.VALUE,
            value: pubKey.bytes
          }
        })]
      }
      case DHTRequest.Type.GET_VALUE: {
        const value = await this.libp2p.contentRouting.get(
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
        await this.libp2p.contentRouting.put(
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
   * @param {Socket} socket Socket to the client
   * @returns {void}
   */
  async handleConnection (socket) {
    const conn = toIterable(socket)
    const streamHandler = new StreamHandler({ stream: conn, maxLength: LIMIT })

    // Iterate over multiple requests until a stream open is requested,
    // at which point the connection should be short circuited
    while (true) {
      const message = await streamHandler.read()

      let request
      try {
        request = Request.decode(message)
      } catch (err) {
        // TODO: Should this `continue`?
        return streamHandler.write(ErrorResponse('ERR_INVALID_MESSAGE'))
      }

      switch (request.type) {
        // Connect to another peer
        case Request.Type.CONNECT: {
          try {
            await this.connect(request)
          } catch (err) {
            streamHandler.write(ErrorResponse(err.message))
            break
          }
          streamHandler.write(OkResponse())
          break
        }
        // Get the daemon peer id and addresses
        case Request.Type.IDENTIFY: {
          streamHandler.write(OkResponse({
            identify: {
              id: this.libp2p.peerInfo.id.toBytes(),
              addrs: this.libp2p.peerInfo.multiaddrs.toArray().map(m => m.buffer)
            }
          }))
          break
        }
        // Get a list of our current peers
        case Request.Type.LIST_PEERS: {
          const peers = Array.from(this.libp2p.peerStore.peers.values()).map((pi) => {
            const addr = pi.isConnected()
            return {
              id: pi.id.toBytes(),
              addrs: [addr ? addr.buffer : null]
            }
          })
          streamHandler.write(OkResponse({
            peers
          }))
          break
        }
        case Request.Type.STREAM_OPEN: {
          let response
          try {
            response = await this.openStream(request)
          } catch (err) {
            streamHandler.write(ErrorResponse(err.message))
            break
          }

          // write the response
          streamHandler.write(OkResponse({
            streamInfo: response.streamInfo
          }))

          // then pipe the connection to the client
          const stream = streamHandler.rest()
          pipe(
            stream.source,
            response.connection,
            stream.sink
          )
          break
        }
        case Request.Type.STREAM_HANDLER: {
          try {
            await this.registerStreamHandler(request)
          } catch (err) {
            streamHandler.write(ErrorResponse(err.message))
            break
          }

          // write the response
          streamHandler.write(OkResponse())
          break
        }
        case Request.Type.PEERSTORE: {
          try {
            await this.handlePeerstoreRequest(request, streamHandler)
          } catch (err) {
            streamHandler.write(ErrorResponse(err.message))
            break
          }
          break
        }
        case Request.Type.PUBSUB: {
          try {
            await this.handlePubsubRequest(request, streamHandler)
          } catch (err) {
            streamHandler.write(ErrorResponse(err.message))
            break
          }
          break
        }
        case Request.Type.DHT: {
          try {
            // DHT responses may require multiple writes
            const responses = await this.handleDHTRequest(request)
            for (const response of responses) {
              // write and wait for the flush
              streamHandler.write(response)
            }
          } catch (err) {
            streamHandler.write(ErrorResponse(err.message))
            break
          }
          break
        }
        // Not yet supported or doesn't exist
        default:
          streamHandler.write(ErrorResponse('ERR_INVALID_REQUEST_TYPE'))
          break
      }

      break
    }

    // The other end hung up, let's also do that
    streamHandler.close()
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
