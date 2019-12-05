'use strict'

const lp = require('it-length-prefixed')
const handshake = require('it-handshake')

const debug = require('debug')
const log = debug('stream-handler')

class StreamHandler {
  /**
   * Create a stream handler for connection
   *
   * @param {object} options
   * @param {*} options.stream - A duplex iterable
   * @param {Number} options.maxLength - max bytes length of message
   */
  constructor ({ stream, maxLength = 4096 }) {
    this.stream = stream

    this.shake = handshake(this.stream)
    this.decoder = lp.decode.fromReader(this.shake.reader, { maxDataLength: maxLength })
  }

  /**
   * Read and decode message
   * @async
   * @returns {void}
   */
  async read () {
    const msg = await this.decoder.next()
    if (msg.value) {
      return msg.value.slice()
    }

    log('read received no value, closing stream')
    // End the stream, we didn't get data
    this.close()
  }

  /**
   *
   * @param {*} msg
   */
  write (msg) {
    log('write message')
    this.shake.write(lp.encode.single(msg))
  }

  /**
   * Return the handshake rest stream and invalidate handler
   *
   * @return {*} A duplex iterable
   */
  rest () {
    this.shake.rest()
    return this.shake.stream
  }

  /**
   * Close the stream
   *
   * @returns {void}
   */
  close () {
    log('closing the stream')
    this.rest().sink([])
  }
}

module.exports = StreamHandler
