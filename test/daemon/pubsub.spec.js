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
const pipe = require('it-pipe')
const { collect } = require('streaming-iterables')
const lp = require('it-length-prefixed')
const pDefer = require('p-defer')
const toBuffer = require('it-buffer')

const StreamHandler = require('../../src/stream-handler')
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

      const maConn = await client.connect()

      const request = Request.encode({
        type: Request.Type.PUBSUB,
        pubsub: {
          type: PSRequest.Type.SUBSCRIBE,
          topic
        }
      })

      const [response] = await pipe(
        [request],
        lp.encode(),
        maConn,
        lp.decode(),
        source => (async function * () {
          for await (const chunk of source) {
            yield Response.decode(chunk.slice())
          }
        })(),
        collect
      )
      expect(response.type).to.eql(Response.Type.OK)

      maConn.close()
    })

    it('should get subscribed topics', async () => {
      const topic = 'test-topic'
      client = new Client(daemonAddr)

      const maConn = await client.connect()
      // const streamHandler = new StreamHandler({ stream: maConn })

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

      const requests = [
        Request.encode(requestGetTopics),
        Request.encode(requestSubscribe),
        Request.encode(requestGetTopics)
      ]

      const results = await pipe(
        requests,
        lp.encode(),
        maConn,
        lp.decode(),
        source => (async function * () {
          for await (const chunk of source) {
            yield Response.decode(chunk.slice())
          }
        })(),
        collect
      )

      const responseValidators = [
        (response) => {
          expect(response.type).to.eql(Response.Type.OK)
          expect(response.pubsub.topics).to.have.lengthOf(0)
        },
        (response) => {
          expect(response.type).to.eql(Response.Type.OK)
        },
        (response) => {
          expect(response.type).to.eql(Response.Type.OK)
          expect(response.pubsub.topics).to.have.lengthOf(1)
          expect(response.pubsub.topics[0]).to.eql(topic)
        }
      ]

      expect(results).to.have.length(3)
      for (const result of results) {
        responseValidators.shift()(result)
      }

      maConn.close()
    })

    it('should be able to publish messages', async function () {
      this.timeout(10e3)

      const topic = 'test-topic'
      const data = Buffer.from('test-data')
      const deferred = pDefer()

      client = new Client(daemonAddr)
      const maConn = await client.connect()

      // subscribe topic
      await libp2pPeer.pubsub.subscribe(topic, (msg) => {
        expect(msg.data).to.equalBytes(data)
        deferred.resolve()
      }, {})

      // wait to pubsub to propagate messages
      await delay(1000)

      // publish topic
      const request = Request.encode({
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
      })

      const [response] = await pipe(
        [request],
        lp.encode(),
        maConn,
        lp.decode(),
        source => (async function * () {
          for await (const chunk of source) {
            yield Response.decode(chunk.slice())
          }
        })(),
        collect
      )
      expect(response.type).to.eql(Response.Type.OK)

      await deferred.promise
      maConn.close()
    })

    it('should do stuff', async () => {
      const connection = await daemon.libp2p.dial(libp2pPeer.peerInfo)
      async function* doStuff () {
        await delay(100)
        yield Buffer.from('have')
        await delay(100)
        yield Buffer.from('some')
        await delay(100)
        yield Buffer.from('more')
        await delay(100)
      }

      libp2pPeer.handle('/the', async ({ stream }) => {
        pipe(
          stream,
          lp.decode(),
          source => (async function * () {
            for await (const data of source) {
              yield data
              yield * doStuff()
            }
          })(),
          lp.encode(),
          stream
        )
      })

      const { stream } = await connection.newStream('/the')

      const result = await pipe(
        [Buffer.from('request 1')],
        lp.encode(),
        stream,
        lp.decode(),
        toBuffer,
        collect
      )

      console.log(result.map(String))
    })

    it.only('should be able to receive messages from subscribed topics', async function () {
      const topic = 'test-topic'
      const data = Buffer.from('test-data')

      client = new Client(daemonAddr)

      const maConn = await client.connect()

      // subscribe topic
      const request = Request.encode({
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
      })

      // Publish in 1 second
      ;(async () => {
        await delay(1000)
        await libp2pPeer.pubsub.publish(topic, data)
      })()

      const responses = await pipe(
        [request],
        lp.encode(),
        maConn,
        source => (async function * () {
          for await (const chunk of source) {
            yield chunk
          }
        })(),
        lp.decode(),
        source => (async function * () {
          for await (const chunk of source) {
            yield Response.decode(chunk.slice())
          }
        })(),
        collect
      )

      expect(responses).to.have.length(2)

      // const subscribedMessage = await streamHandler.read()
      // const subscribedResponse = Response.decode(subscribedMessage)
      // expect(subscribedResponse.type).to.eql(Response.Type.OK)
      // await delay(1000)
      // await libp2pPeer.pubsub.publish(topic, data)

      // const topicMessage = await streamHandler.read()
      // const response = PSMessage.decode(topicMessage)
      // expect(response).to.exist()
      // expect(response.from.toString()).to.eql(libp2pPeer.peerInfo.id.toB58String())
      // expect(response.data).to.exist()
      // expect(response.data).to.equalBytes(data)
      // expect(response.topicIDs).to.eql([topic])
      // expect(response.seqno).to.exist()
      maConn.close()
    })
  })
}

describe('pubsub', () => {
  testPubsub('gossipsub')
  // testPubsub('floodsub')
})
