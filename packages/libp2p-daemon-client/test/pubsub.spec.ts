/* eslint-env mocha */

import { expect } from 'aegir/chai'
import sinon from 'sinon'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { createServer, Libp2p, Libp2pServer } from '@libp2p/daemon-server'
import { createClient, DaemonClient } from '../src/index.js'
import { Multiaddr } from '@multiformats/multiaddr'
import { StubbedInstance, stubInterface } from 'ts-sinon'
import type { PubSub } from '@libp2p/interfaces/pubsub'

const defaultMultiaddr = new Multiaddr('/ip4/0.0.0.0/tcp/12345')

describe('daemon pubsub client', function () {
  this.timeout(30e3)

  let libp2p: StubbedInstance<Libp2p>
  let server: Libp2pServer
  let client: DaemonClient
  let pubsub: StubbedInstance<PubSub>

  beforeEach(async function () {
    pubsub = stubInterface<PubSub>()
    libp2p = stubInterface<Libp2p>()
    libp2p.pubsub = pubsub

    server = createServer(defaultMultiaddr, libp2p)

    await server.start()

    client = createClient(server.getMultiaddr())
  })

  afterEach(async () => {
    if (server != null) {
      await server.stop()
    }

    sinon.restore()
  })

  describe('getTopics', () => {
    it('should get empty list of topics when no subscriptions exist', async () => {
      pubsub.getTopics.returns([])

      const topics = await client.pubsub.getTopics()

      expect(topics).to.have.lengthOf(0)
    })

    it('should get a list with a topic when subscribed', async () => {
      const topic = 'test-topic'
      pubsub.getTopics.returns([topic])

      const topics = await client.pubsub.getTopics()

      expect(topics).to.have.lengthOf(1)
      expect(topics[0]).to.equal(topic)
    })

    it('should error if receive an error message', async () => {
      pubsub.getTopics.throws(new Error('Urk!'))

      await expect(client.pubsub.getTopics()).to.eventually.be.rejectedWith(/Urk!/)
    })
  })

  describe('publish', () => {
    it('should publish an event', async () => {
      const topic = 'test-topic'
      const data = uint8ArrayFromString('hello world')

      await client.pubsub.publish(topic, data)

      expect(pubsub.publish.called).to.be.true()

      const call = pubsub.publish.getCall(0)

      expect(call).to.have.nested.property('args[0]', topic)
      expect(call).to.have.deep.nested.property('args[1]', data)
    })

    it('should error if receive an error message', async () => {
      const topic = 'test-topic'
      const data = uint8ArrayFromString('hello world')
      pubsub.publish.throws(new Error('Urk!'))

      await expect(client.pubsub.publish(topic, data)).to.eventually.be.rejectedWith(/Urk!/)
    })
  })
})
