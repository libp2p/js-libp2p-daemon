const net = require('net')
const path = require('path')
const Libp2p = require('./libp2p')

const log = console.log

class Daemon {
  constructor({
    socketPath,
    libp2pNode
  }) {
    this.socketPath = socketPath
    this.libp2p = libp2pNode
    this.server = net.createServer(this.handleConnection.bind(this))
    this.listen()
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
    let data = ''
    for await (const chunk of conn) {
      data += chunk
    }

    // Handle the message here
    console.log('Data:', data)
  }
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
