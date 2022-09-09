import * as lp from 'it-length-prefixed'
import { handshake } from 'it-handshake'
import { logger } from '@libp2p/logger'
import type { Duplex, Source } from 'it-stream-types'
import type { Handshake } from 'it-handshake'
import type { Uint8ArrayList } from 'uint8arraylist'

const log = logger('libp2p:daemon-protocol:stream-handler')

export interface StreamHandlerOptions {
  stream: Duplex<Uint8Array>
  maxLength?: number
}

export class StreamHandler {
  private readonly stream: Duplex<Uint8Array>
  private readonly shake: Handshake<Uint8Array>
  public decoder: Source<Uint8ArrayList>
  /**
   * Create a stream handler for connection
   */
  constructor (opts: StreamHandlerOptions) {
    const { stream, maxLength } = opts

    this.stream = stream
    this.shake = handshake(this.stream)
    this.decoder = lp.decode.fromReader(this.shake.reader, { maxDataLength: maxLength ?? 4096 })
  }

  /**
   * Read and decode message
   */
  async read () {
    // @ts-expect-error decoder is really a generator
    const msg = await this.decoder.next()
    if (msg.value != null) {
      return msg.value.subarray()
    }

    log('read received no value, closing stream')
    // End the stream, we didn't get data
    await this.close()
  }

  write (msg: Uint8Array | Uint8ArrayList) {
    log('write message')
    this.shake.write(
      lp.encode.single(msg).subarray()
    )
  }

  /**
   * Return the handshake rest stream and invalidate handler
   */
  rest () {
    this.shake.rest()
    return this.shake.stream
  }

  /**
   * Close the stream
   */
  async close () {
    log('closing the stream')
    await this.rest().sink([])
  }
}
