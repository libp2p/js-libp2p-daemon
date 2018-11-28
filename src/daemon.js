const net = require('net')
const path = require('path')
const Libp2p = require('./libp2p')
const PeerInfo = require('peer-info')
const PeerId = require('peer-id')
const multiaddr = require('multiaddr')
const { encode, decode } = require('length-prefixed-stream')
const {
  Request,
  Response
} = require('./protocol')
const LIMIT = 1 << 22 // 4MB

const log = console.log

class Daemon {
  constructor({
    socketPath,
    libp2pNode
  }) {
    this.socketPath = socketPath
    this.libp2p = libp2pNode
    this.server = net.createServer({
      allowHalfOpen: true
    }, this.handleConnection.bind(this))
    this.listen()
  }


  /**
   * Connects the daemons libp2p node to the peer provided
   * in the ConnectRequest
   * @param {ConnectRequest} connectRequest
   * @returns {Promise}
   */
  connect (connectRequest) {
    return new Promise((resolve, reject) => {
      const peer = connectRequest.connect.peer
      const addrs = connectRequest.connect.addrs
      const peerInfo = new PeerInfo(
        PeerId.createFromB58String(peer)
      )
      addrs.forEach((a) => {
        peerInfo.multiaddrs.add(multiaddr(a))
      })

      this.libp2p.dial(peerInfo, (err) => {
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
          console.log('Shut it down!')
          log('server closed, exiting')
          // return process.exit(0)
        }
        resolve()
      })
    })
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
        case Request.Type.CONNECT:
          try {
            await this.connect(request)
          } catch (err) {
            return enc.write(ErrorResponse(err.message))
          }
          enc.write(OkResponse())
          break

        // Get the daemon peer id and addresses
        case Request.Type.IDENTIFY:
          enc.write(Response.encode({
            type: Response.Type.OK,
            identify: {
              id: this.libp2p.peerInfo.id.toBytes(),
              addrs: this.libp2p.peerInfo.multiaddrs.toArray().map(m => m.buffer)
            }
          }))
          break

        // Get a list of our current peers
        case Request.Type.LIST_PEERS:
          const peers = this.libp2p.peerBook.getAllArray().map((pi) => {
            const addr = pi.isConnected()
            return {
              id: pi.id.toBytes(),
              addrs: [addr ? addr.buffer : null]
            }
          })
          enc.write(Response.encode({
            type: Response.Type.OK,
            peers
          }))
          break

        // Not yet support or doesn't exist
        default:
          enc.write(ErrorResponse('ERR_INVALID_REQUEST_TYPE'))
          break
      }
    }
  }
}

function OkResponse () {
  return Response.encode({
    type: Response.Type.OK
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
