const net = require('net')
const path = require('path')
const Libp2p = require('./libp2p')
const PeerInfo = require('peer-info')
const PeerId = require('peer-id')
const multiaddr = require('multiaddr')
const {
  Request,
  Response
} = require('./protocol')

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
          log('server closed, exiting')
          return process.exit(0)
        }
        resolve()
      })
    })
  }

  async handleConnection (conn) {
    let message = Buffer.alloc(0)
    for await (const chunk of conn) {
      message = Buffer.concat([message, chunk])
    }

    // Handle the message here
    let request
    try {
      request = Request.decode(Buffer.from(message))
    } catch (err) {
      return conn.end(ErrorResponse('ERR_INVALID_MESSAGE'))
    }

    switch (request.type) {
      // Connect to another peer
      case Request.Type.CONNECT:
        try {
          await this.connect(request)
        } catch (err) {
          return conn.end(ErrorResponse(err.message))
        }
        conn.end(OkResponse())
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
        conn.end(Response.encode({
          type: Response.Type.OK,
          peers
        }))
        break
      default:
        conn.end(ErrorResponse('ERR_INVALID_REQUEST_TYPE'))
        break
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
