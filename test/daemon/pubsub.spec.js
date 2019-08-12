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
      await client && client.close()

      return Promise.all([
        daemon.stop(),
        libp2pPeer.stop()
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

      const stream = client.send(request)

      const response = Response.decode(await stream.first())
      expect(response.type).to.eql(Response.Type.OK)

      stream.end()
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
      let stream = client.send(requestGetTopics)

      let response = Response.decode(await stream.first())
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

      stream.end()

      // Subscribe
      stream = client.send(requestSubscribe)

      response = Response.decode(await stream.first())
      expect(response.type).to.eql(Response.Type.OK)

      stream.end()

      // Get new subscription
      stream = client.send(requestGetTopics)

      response = Response.decode(await stream.first())
      expect(response.type).to.eql(Response.Type.OK)
      expect(response.pubsub.topics).to.have.lengthOf(1)
      expect(response.pubsub.topics[0]).to.eql(topic)

      stream.end()
    })

    it('should be able to publish messages', function () {
      this.timeout(20e3)

      const topic = 'test-topic'
      const data = Buffer.from('test-data')

      return new Promise(async (resolve, reject) => {
        client = new Client(daemonAddr)

        await client.attach()

        // connect peers
        let request = {
          type: Request.Type.CONNECT,
          connect: {
            peer: Buffer.from(libp2pPeer.peerInfo.id.toBytes()),
            addrs: libp2pPeer.peerInfo.multiaddrs.toArray().map(addr => addr.buffer)
          },
          streamOpen: null,
          streamHandler: null,
          dht: null,
          disconnect: null,
          pubsub: null,
          connManager: null
        }

        let stream = client.send(request)

        let message = await stream.first()
        let response = Response.decode(message)
        expect(response.type).to.eql(Response.Type.OK)
        stream.end()

        // subscribe topic
        await libp2pPeer.pubsub.subscribe(topic, (msg) => {
          expect(msg.data).to.equalBytes(data)
          resolve()
        }, {})

        // wait to pubsub to propagate messages
        await new Promise(resolve => setTimeout(resolve, 1000))

        // publish topic
        request = {
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

        stream = client.send(request)

        response = Response.decode(await stream.first())
        expect(response.type).to.eql(Response.Type.OK)

        stream.end()
      })
    })

    it('should be able to receive messages from subscribed topics', function () {
      this.timeout(20e3)

      const topic = 'test-topic'
      const data = Buffer.from('test-data')

      return new Promise(async (resolve) => {
        client = new Client(daemonAddr)

        await client.attach()

        // connect peers
        let request = {
          type: Request.Type.CONNECT,
          connect: {
            peer: Buffer.from(libp2pPeer.peerInfo.id.toBytes()),
            addrs: libp2pPeer.peerInfo.multiaddrs.toArray().map(addr => addr.buffer)
          }
        }

        let stream = client.send(request)

        let message = await stream.first()
        let response = Response.decode(message)
        expect(response.type).to.eql(Response.Type.OK)
        stream.end()

        // subscribe topic
        request = {
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

        stream = client.send(request)

        let subscribed = false

        for await (const msg of stream) {
          if (subscribed) {
            response = PSMessage.decode(msg)

            expect(response).to.exist()
            expect(response.from.toString()).to.eql(libp2pPeer.peerInfo.id.toB58String())
            expect(response.data).to.exist()
            expect(response.data).to.equalBytes(data)
            expect(response.topicIDs).to.eql([topic])
            expect(response.seqno).to.exist()

            stream.end()
            resolve()
          } else {
            response = Response.decode(msg)
            expect(response.type).to.eql(Response.Type.OK)
            subscribed = true

            // wait to pubsub to propagate messages
            await new Promise(resolve => setTimeout(resolve, 1000))

            await libp2pPeer.pubsub.publish(topic, data)
          }
        }
      })
    })
  })
}

describe('pubsub', () => {
  testPubsub('gossipsub')
  testPubsub('floodsub')
})
