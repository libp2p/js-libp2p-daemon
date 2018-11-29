const { Socket } = require('net')
const Path = require('path')
const { encode, decode } = require('length-prefixed-stream')
const { Request, Response } = require('./protocol')
const LIMIT = 1 << 22 // 4MB

class Client {
  constructor(path) {
    this.path = Path.resolve(path)
    this.socket = new Socket({
      readable: true,
      writable: true,
      allowHalfOpen: true
    })
  }

  /**
   * Connects to a daemon at the unix socket path the client
   * was created with
   * @returns {Promise}
   */
  attach () {
    return new Promise((resolve, reject) => {
      this.socket.connect(this.path, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  /**
   * Closes the socket
   * @returns {Promise}
   */
  close () {
    return new Promise((resolve) => {
      this.socket.end(resolve)
    })
  }

  /**
   * Sends the request to the daemon and returns a stream
   * @param {Request} request A plain request object that will be protobuf encoded
   * @returns {Stream}
   */
  send (request) {
    // Decode and pipe the response
    const dec = decode({ limit: LIMIT })
    this.socket.pipe(dec)

    // Encode and pipe the request
    const enc = encode()
    enc.write(Request.encode(request))
    enc.pipe(this.socket)

    return dec
  }
}

module.exports = Client