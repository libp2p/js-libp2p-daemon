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
const { collect, take } = require('streaming-iterables')
const lp = require('it-length-prefixed')
const pDefer = require('p-defer')
const toBuffer = require('it-buffer')
const pushable = require('it-pushable')

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

    beforeEach(async function () {
      this.timeout(20e3)
      ;[daemon, libp2pPeer] = await Promise.all([
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
      ])
      await Promise.all([
        daemon.start(),
        libp2pPeer.start()
      ])

      await connect({
        libp2pPeer,
        multiaddr: daemonAddr
      })

      // Give the nodes a moment to handshake
      await delay(500)
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
        take(1), // Just get the OK
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
      let streamHandler = new StreamHandler({ stream: maConn })

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

      streamHandler.write(Request.encode(requestGetTopics))
      let response = Response.decode(await streamHandler.read())
      expect(response.type).to.eql(Response.Type.OK)
      expect(response.pubsub.topics).to.have.lengthOf(0)

      streamHandler.write(Request.encode(requestSubscribe))
      response = Response.decode(await streamHandler.read())
      expect(response.type).to.eql(Response.Type.OK)
      // end the connection as it is now reserved for subscribes
      maConn.close()

      const conn2 = await client.connect()

      streamHandler = new StreamHandler({ stream: conn2 })
      streamHandler.write(Request.encode(requestGetTopics))
      response = Response.decode(await streamHandler.read())
      expect(response.type).to.eql(Response.Type.OK)
      expect(response.pubsub.topics).to.have.lengthOf(1)
      expect(response.pubsub.topics[0]).to.eql(topic)
      conn2.close()
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

      // Give the subscribe call some time to propagate
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

    it('should be able to receive messages from subscribed topics', async function () {
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

      // Publish in 1 seconds
      ;(async () => {
        await delay(1000)
        await libp2pPeer.pubsub.publish(topic, data)
      })()

      // The underlying socket does not allow half closed connections,
      // so give it a "pausable" source.
      const source = pushable()
      source.push(request)

      const responses = await pipe(
        source,
        lp.encode(),
        maConn,
        lp.decode(),
        take(2), // get the OK and the 1st publish message
        toBuffer,
        collect
      )

      // We're done, end our half of the connection
      source.end()

      const expectedResponses = [
        (message) => {
          const response = Response.decode(message)
          expect(response.type).to.eql(Response.Type.OK)
        },
        (message) => {
          const response = PSMessage.decode(message)
          expect(response.from.toString()).to.eql(libp2pPeer.peerInfo.id.toB58String())
          expect(response.data).to.exist()
          expect(response.data).to.equalBytes(data)
          expect(response.topicIDs).to.eql([topic])
          expect(response.seqno).to.exist()
        }
      ]
      expect(responses).to.have.length(2)
      for (const response of responses) {
        expectedResponses.shift()(response)
      }

      maConn.close()
    })
  })
}

describe('pubsub', () => {
  testPubsub('gossipsub')
  testPubsub('floodsub')
})
