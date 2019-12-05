'use strict'

const TCP = require('libp2p-tcp')
const { passThroughUpgrader } = require('./util')

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
   * @returns {MultiaddrConnection}
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
