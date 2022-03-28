import errcode from 'err-code'
import {
  Request,
  Response,
  PSRequest,
  PSMessage
} from '@libp2p/daemon-protocol'
import type { DaemonClient } from './index.js'

export class Pubsub {
  private readonly client: DaemonClient

  constructor (client: DaemonClient) {
    this.client = client
  }

  /**
   * Get a list of topics the node is subscribed to.
   *
   * @returns {Array<string>} topics
   */
  async getTopics (): Promise<string[]> {
    const sh = await this.client.send({
      type: Request.Type.PUBSUB,
      pubsub: {
        type: PSRequest.Type.GET_TOPICS
      }
    })

    const message = await sh.read()
    const response = Response.decode(message)

    await sh.close()

    if (response.type !== Response.Type.OK) {
      throw errcode(new Error(response.error?.msg ?? 'Pubsub get topics failed'), 'ERR_PUBSUB_GET_TOPICS_FAILED')
    }

    if (response.pubsub == null || response.pubsub.topics == null) {
      throw errcode(new Error('Invalid response'), 'ERR_PUBSUB_GET_TOPICS_FAILED')
    }

    return response.pubsub.topics
  }

  /**
   * Publish data under a topic
   */
  async publish (topic: string, data: Uint8Array) {
    if (typeof topic !== 'string') {
      throw errcode(new Error('invalid topic received'), 'ERR_INVALID_TOPIC')
    }

    if (!(data instanceof Uint8Array)) {
      throw errcode(new Error('data received is not a Uint8Array'), 'ERR_INVALID_DATA')
    }

    const sh = await this.client.send({
      type: Request.Type.PUBSUB,
      pubsub: {
        type: PSRequest.Type.PUBLISH,
        topic,
        data
      }
    })

    const message = await sh.read()
    const response = Response.decode(message)

    await sh.close()

    if (response.type !== Response.Type.OK) {
      throw errcode(new Error(response.error?.msg ?? 'Pubsub publish failed'), 'ERR_PUBSUB_PUBLISH_FAILED')
    }
  }

  /**
   * Request to subscribe a certain topic
   */
  async * subscribe (topic: string) {
    if (typeof topic !== 'string') {
      throw errcode(new Error('invalid topic received'), 'ERR_INVALID_TOPIC')
    }

    const sh = await this.client.send({
      type: Request.Type.PUBSUB,
      pubsub: {
        type: PSRequest.Type.SUBSCRIBE,
        topic
      }
    })

    let message = await sh.read()
    const response = Response.decode(message)

    if (response.type !== Response.Type.OK) {
      throw errcode(new Error(response.error?.msg ?? 'Pubsub publish failed'), 'ERR_PUBSUB_PUBLISH_FAILED')
    }

    // stream messages
    while (true) {
      message = await sh.read()
      yield PSMessage.decode(message)
    }
  }
}
