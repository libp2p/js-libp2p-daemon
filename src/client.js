'use strict'

const net = require('net')
const Socket = net.Socket
const StreamHandler = require('./stream-handler')
const LIMIT = 1 << 22 // 4MB

const { Request } = require('./protocol')
const { multiaddrToNetConfig } = require('./util')
const toIterable = require('./socket-to-iterable')
const promisify = require('promisify-es6')

class Client {
  constructor (addr) {
    this.multiaddr = addr
    this.server = null
    this._socket = new Socket({
      readable: true,
      writable: true,
      allowHalfOpen: true
    })
    this.connection = toIterable(this._socket)
    this.streamHandler = new StreamHandler({ stream: this.connection, maxLength: LIMIT })
  }

  /**
   * Connects to a daemon at the unix socket path the client
   * was created with
   * @async
   */
  async attach () {
    const options = multiaddrToNetConfig(this.multiaddr)
    await promisify(this._socket.connect, { context: this._socket })(options)
  }

  /**
   * Starts a server listening at `socketPath`. New connections
   * will be sent to the `connectionHandler`.
   * @param {Multiaddr} addr
   * @param {function(Stream)} connectionHandler
   * @returns {Promise}
   */
  async startServer (addr, connectionHandler) {
    if (this.server) {
      await this.stopServer()
    }
    this.server = net.createServer({
      allowHalfOpen: true
    }, connectionHandler)

    const options = multiaddrToNetConfig(addr)
    return promisify(this.server.listen, { context: this.server })(options)
  }

  /**
   * Closes the net Server if it's running
   * @async
   */
  async stopServer () {
    if (!this.server || !this.server.listening) return
    await promisify(this.server.close, { context: this.server })()
    this.server = null
  }

  /**
   * Closes the socket
   * @returns {Promise}
   */
  async close () {
    await this.stopServer()
    return new Promise((resolve) => {
      this._socket.end(resolve)
    })
  }

  /**
   * Sends the request to the daemon. This
   * should only be used when sending daemon requests.
   * @param {Request} request A plain request object that will be protobuf encoded
   */
  send (request) {
    this.streamHandler.write(Request.encode(request))
  }

  /**
   * Reads from the internal handshake
   * @returns {Promise<BufferList>}
   */
  read () {
    return this.streamHandler.read()
  }

  /**
   * Returns the underlying duplex iterable.
   * @returns {*} Duplex iterable
   */
  getStream () {
    return this.streamHandler.rest()
  }
}

module.exports = Client
