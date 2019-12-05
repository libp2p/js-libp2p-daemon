'use strict'

const TCP = require('libp2p-tcp')
const StreamHandler = require('./stream-handler')
const LIMIT = 1 << 22 // 4MB

const { Request } = require('./protocol')
const { multiaddrToNetConfig, passThroughUpgrader } = require('./util')
const toIterable = require('./socket-to-iterable')

class Client {
  constructor (addr) {
    this.multiaddr = addr
    this.server = null
    this.tcp = new TCP({ upgrader: passThroughUpgrader })
  }

  /**
   * Connects to a daemon at the unix socket path the client
   * was created with
   * @async
   */
  connect () {
    return this.tcp.dial(this.multiaddr)
  }

  /**
   * Starts a server listening at `socketPath`. New connections
   * will be sent to the `connectionHandler`.
   * @param {Multiaddr} addr
   * @param {function(Stream)} connectionHandler
   * @returns {Promise}
   */
  async start (addr, connectionHandler) {
    if (this.listener) {
      await this.close()
    }
    this.listener = this.tcp.createListener(maConn => connectionHandler(maConn))

    await this.listener.listen(addr)
  }

  /**
   * Closes the socket
   * @returns {Promise}
   */
  async close () {
    this.listener && await this.listener.close()
    this.listener = null
  }
}

module.exports = Client
