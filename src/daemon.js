'use strict'

const net = require('net')
const path = require('path')
const Libp2p = require('./libp2p')
const PeerInfo = require('peer-info')
const PeerId = require('peer-id')
const multiaddr = require('multiaddr')
const { encode, decode } = require('length-prefixed-stream')
const {
  Request,
  DHTRequest,
  Response,
  DHTResponse,
  StreamInfo
} = require('./protocol')
const LIMIT = 1 << 22 // 4MB

const log = console.log

class Daemon {
  constructor ({
    socketPath,
    libp2pNode
  }) {
    this.socketPath = socketPath
    this.libp2p = libp2pNode
    this.server = net.createServer({
      allowHalfOpen: true
    }, this.handleConnection.bind(this))
    this.streamHandlers = {}
    this.listen()
  }

  /**
   * Connects the daemons libp2p node to the peer provided
   * in the ConnectRequest
   * @param {ConnectRequest} connectRequest
   * @returns {Promise}
   */
  connect (connectRequest) {
    const peer = connectRequest.connect.peer
    const addrs = connectRequest.connect.addrs
    const peerInfo = new PeerInfo(
      PeerId.createFromB58String(peer)
    )
    addrs.forEach((a) => {
      peerInfo.multiaddrs.add(multiaddr(a))
    })

    return this.libp2p.dial(peerInfo)
  }

  /**
   * Opens a stream on one of the given protocols to the given peer
   * @param {StreamOpenRequest} request
   * @throws {Error}
   * @returns {StreamInfo, Stream}
   */
  async openStream (request) {
    const { peer, proto } = request.streamOpen
    const peerInfo = new PeerInfo(
      PeerId.createFromB58String(peer)
    )

    let results
    let successfulProto
    for (const protocol of proto) {
      try {
        results = await this.libp2p.dial(peerInfo, protocol)
        successfulProto = protocol
        break
      } catch (err) {
        console.log(err)
        // We can ignore this, and try other protos
      }
    }

    if (!results) {
      throw new Error('no protocols could be dialed')
    }

    return {
      streamInfo: {
        peer: peerInfo.id.toBytes(),
        addr: results.peerInfo.isConnected().buffer,
        proto: successfulProto
      },
      connection: results.connection
    }
  }

  /**
   * Sends inbound requests for the given protocol
   * to the unix socket path provided. If an existing handler
   * is registered at the path, it will be overridden.
   * @param {StreamHandlerRequest} request
   * @returns {Promise}
   */
  registerStreamHandler (request) {
    return new Promise((resolve, reject) => {
      const protocols = request.streamHandler.proto
      const socketPath = path.resolve(request.streamHandler.path)

      // If we have a handler, end it
      if (this.streamHandlers[socketPath]) {
        this.streamHandlers[socketPath].end()
        delete this.streamHandlers[socketPath]
      }

      const socket = this.streamHandlers[socketPath] = new net.Socket({
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

          // Write the encoded message to the client
          enc.pipe(socket)
          enc.write(message)
          enc.unpipe(socket)

          // And then begin piping the client and peer connection
          conn.pipe(socket)
          socket.pipe(conn)
        })
      })

      socket.connect(socketPath, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  listen () {
    // listen for graceful termination
    process.on('SIGTERM', () => this.stop({ exit: true }))
    process.on('SIGINT', () => this.stop({ exit: true }))
    process.on('SIGHUP', () => this.stop({ exit: true }))
  }

  /**
   * Starts the daemon
   * @returns {Promise}
   */
  start () {
    return new Promise(async (resolve, reject) => {
      await this.libp2p.start()
      this.server.listen(path.resolve(this.socketPath), (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  /**
   * Stops the daemon
   * @param {object} options
   * @param {boolean} options.exit If the daemon process should exit
   * @returns {Promise}
   */
  stop (options = { exit: false }) {
    return new Promise(async (resolve) => {
      await this.libp2p.stop()
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
   *
   * @param {Request} request
   * @returns {DHTResponse}
   */
  async handleDHTRequest ({ dht }) {
    switch (dht.type) {
      case DHTRequest.Type.FIND_PEER: {
        const peerId = PeerId.createFromBytes(dht.peer)
        let peer
        try {
          peer = await this.libp2p.peerRouting.findPeer(peerId)
        } catch (err) {
          throw err
        }

        return {
          type: DHTResponse.Type.VALUE,
          peer: {
            id: peer.id.toBytes(),
            addrs: peer.multiaddrs.toArray().map(m => m.buffer)
          }
        }
      }
      default:
        throw new Error('ERR_INVALID_REQUEST_TYPE')
    }
  }

  /**
   * Handles requests for the given connection
   * @private
   * @param {Stream} conn
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
              addrs: this.libp2p.peerInfo.multiaddrs.toArray().map(m => m.buffer)
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
          response.connection.pipe(conn)
          conn.pipe(response.connection)
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
        case Request.Type.DHT: {
          let dhtResponse
          try {
            dhtResponse = await this.handleDHTRequest(request)
          } catch (err) {
            enc.write(ErrorResponse(err.message))
            break
          }

          // write the response
          enc.write(OkResponse({
            dht: dhtResponse
          }))
          break
        }
        // Not yet support or doesn't exist
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
 * @param {Object} data an optional map of values to be assigned to the response
 * @returns {Response}
 */
function OkResponse (data) {
  return Response.encode({
    type: Response.Type.OK,
    ...data
  })
}

function ErrorResponse (message) {
  return Response.encode({
    type: Response.Type.ERROR,
    error: {
      msg: message
    }
  })
}

const createDaemon = async (options) => {
  const libp2pNode = await Libp2p.createLibp2p(options)
  const daemon = new Daemon({
    socketPath: options.sock,
    libp2pNode: libp2pNode
  })

  return daemon
}

module.exports.createDaemon = createDaemon
