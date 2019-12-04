'use strict'

const toIterable = require('stream-to-it')

module.exports = (socket) => {
  const { sink, source } = toIterable.duplex(socket)

  return {
    sink (source) {
      return sink((async function * () {
        for await (const chunk of source) {
          // Convert BufferList to Buffer
          yield Buffer.isBuffer(chunk) ? chunk : chunk.slice()
        }
      })())
    },
    source
  }
}
