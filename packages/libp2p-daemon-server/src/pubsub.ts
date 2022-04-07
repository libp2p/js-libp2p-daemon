/* eslint max-depth: ["error", 6] */

import {
  PSMessage
} from '@libp2p/daemon-protocol'
import { ErrorResponse, OkResponse } from './responses.js'
import type { PubSub } from '@libp2p/interfaces/pubsub'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { pushable } from 'it-pushable'
import { CustomEvent } from '@libp2p/interfaces'
import { logger } from '@libp2p/logger'

const log = logger('libp2p:daemon-server:pubsub')

export interface PubSubOperationsInit {
  pubsub: PubSub
}

export class PubSubOperations {
  private readonly pubsub: PubSub

  constructor (init: PubSubOperationsInit) {
    const { pubsub } = init

    this.pubsub = pubsub
  }

  async * getTopics () {
    try {
      yield OkResponse({
        pubsub: {
          topics: this.pubsub.getTopics()
        }
      })
    } catch (err: any) {
      log.error(err)
      yield ErrorResponse(err)
    }
  }

  async * subscribe (topic: string) {
    try {
      const onMessage = pushable<Uint8Array>()

      await this.pubsub.addEventListener(topic, (evt) => {
        const msg = evt.detail

        onMessage.push(PSMessage.encode({
          from: msg.from.toBytes(),
          data: msg.data,
          seqno: msg.sequenceNumber == null ? undefined : uint8ArrayFromString(msg.sequenceNumber.toString(16).padStart(16, '0'), 'base16'),
          topicIDs: [msg.topic],
          signature: msg.signature,
          key: msg.key
        }).finish())
      })

      yield OkResponse()
      yield * onMessage
    } catch (err: any) {
      log.error(err)
      yield ErrorResponse(err)
    }
  }

  async * publish (topic: string, data: Uint8Array) {
    try {
      this.pubsub.dispatchEvent(new CustomEvent(topic, { detail: data }))
      yield OkResponse()
    } catch (err: any) {
      log.error(err)
      yield ErrorResponse(err)
    }
  }
}