/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 5] */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-bytes'))
const expect = chai.expect

const os = require('os')
const path = require('path')
const ma = require('multiaddr')
const delay = require('delay')

const { createDaemon } = require('../../src/daemon')
const { createLibp2p } = require('../../src/libp2p')
const Client = require('../../src/client')
const { isWindows } = require('../../src/util')
const { connect } = require('../util')
const {
  Request,
  Response,
  PSRequest,
  PSMessage
} = require('../../src/protocol')

const daemonAddr = isWindows
  ? ma('/ip4/0.0.0.0/tcp/8080')
  : ma(`/unix${path.resolve(os.tmpdir(), '/tmp/p2pd.sock')}`)

const testPubsub = (router) => {
  describe(`pubsub - ${router}`, () => {
    let daemon
    let libp2pPeer
    let client

    beforeEach(function () {
      this.timeout(20e3)
      return Promise.all([
        createDaemon({
          quiet: false,
          q: false,
          bootstrap: false,
          hostAddrs: '/ip4/0.0.0.0/tcp/0,/ip4/0.0.0.0/tcp/0/ws',
          b: false,
          dht: false,
          dhtClient: false,
          connMgr: false,
          listen: daemonAddr.toString(),
          id: '',
          bootstrapPeers: '',
          pubsub: true,
          pubsubRouter: router
        }),
        createLibp2p({
          pubsub: true,
          pubsubRouter: router,
          hostAddrs: '/ip4/0.0.0.0/tcp/0'
        })
      ]).then((results) => {
        daemon = results.shift()
        libp2pPeer = results.shift()

        return Promise.all([
          daemon.start(),
          libp2pPeer.start()
        ])
      }).then(() => {
        return connect({
          libp2pPeer,
          multiaddr: daemonAddr
        })
      })
    })

    afterEach(async () => {
      await Promise.all([
        client && client.close(),
        libp2pPeer.stop(),
        daemon.stop()
      ])
    })

    it('should be able to subscribe to a topic', async () => {
      const topic = 'test-topic'
      client = new Client(daemonAddr)

      await client.attach()

      const request = {
        type: Request.Type.PUBSUB,
        pubsub: {
          type: PSRequest.Type.SUBSCRIBE,
          topic
        }
      }

      client.send(request)

      const response = Response.decode(await client.read())
      expect(response.type).to.eql(Response.Type.OK)

      client.streamHandler.close()
    })

    it('should get subscribed topics', async () => {
      const topic = 'test-topic'
      client = new Client(daemonAddr)

      await client.attach()

      const requestGetTopics = {
        type: Request.Type.PUBSUB,
        connect: null,
        streamOpen: null,
        streamHandler: null,
        pubsub: {
          type: PSRequest.Type.GET_TOPICS
        },
        disconnect: null,
        connManager: null
      }

      // Get empty subscriptions
      client.send(requestGetTopics)

      let response = Response.decode(await client.read())
      expect(response.type).to.eql(Response.Type.OK)
      expect(response.pubsub.topics).to.have.lengthOf(0)

      const requestSubscribe = {
        type: Request.Type.PUBSUB,
        connect: null,
        streamOpen: null,
        streamHandler: null,
        pubsub: {
          type: PSRequest.Type.SUBSCRIBE,
          topic
        },
        disconnect: null,
        connManager: null
      }

      // Subscribe
      client.send(requestSubscribe)

      response = Response.decode(await client.read())
      expect(response.type).to.eql(Response.Type.OK)

      // Get new subscription
      client.send(requestGetTopics)

      response = Response.decode(await client.read())
      expect(response.type).to.eql(Response.Type.OK)
      expect(response.pubsub.topics).to.have.lengthOf(1)
      expect(response.pubsub.topics[0]).to.eql(topic)

      client.streamHandler.close()
    })

    it('should be able to publish messages', function () {
      this.timeout(20e3)

      const topic = 'test-topic'
      const data = Buffer.from('test-data')

      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        client = new Client(daemonAddr)

        await client.attach()

        // subscribe topic
        await libp2pPeer.pubsub.subscribe(topic, (msg) => {
          expect(msg.data).to.equalBytes(data)
          resolve()
        }, {})

        // wait to pubsub to propagate messages
        await delay(1000)

        // publish topic
        const request = {
          type: Request.Type.PUBSUB,
          connect: null,
          streamOpen: null,
          streamHandler: null,
          pubsub: {
            type: PSRequest.Type.PUBLISH,
            topic,
            data: data
          },
          disconnect: null,
          connManager: null
        }

        client.send(request)

        const response = Response.decode(await client.read())
        expect(response.type).to.eql(Response.Type.OK)

        client.streamHandler.close()
      })
    })

    it('should be able to receive messages from subscribed topics', async function () {
      const topic = 'test-topic'
      const data = Buffer.from('test-data')

      client = new Client(daemonAddr)

      await client.attach()

      // subscribe topic
      const request = {
        type: Request.Type.PUBSUB,
        connect: null,
        streamOpen: null,
        streamHandler: null,
        pubsub: {
          type: PSRequest.Type.SUBSCRIBE,
          topic
        },
        disconnect: null,
        connManager: null
      }

      client.send(request)

      const subscribedMessage = await client.read()
      const subscribedResponse = Response.decode(subscribedMessage)
      expect(subscribedResponse.type).to.eql(Response.Type.OK)
      await delay(1000)
      await libp2pPeer.pubsub.publish(topic, data)

      const topicMessage = await client.read()
      const response = PSMessage.decode(topicMessage)
      expect(response).to.exist()
      expect(response.from.toString()).to.eql(libp2pPeer.peerInfo.id.toB58String())
      expect(response.data).to.exist()
      expect(response.data).to.equalBytes(data)
      expect(response.topicIDs).to.eql([topic])
      expect(response.seqno).to.exist()
      client.streamHandler.close()
    })
  })
}

describe('pubsub', () => {
  testPubsub('gossipsub')
  testPubsub('floodsub')
})
