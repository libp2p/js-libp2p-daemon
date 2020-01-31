/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 5] */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const os = require('os')
const path = require('path')
const pipe = require('it-pipe')
const ma = require('multiaddr')
const { collect, take } = require('streaming-iterables')
const { toBuffer } = require('it-buffer')

const StreamHandler = require('../../src/stream-handler')
const Client = require('../../src/client')
const { createDaemon } = require('../../src/daemon')
const { createLibp2p } = require('../../src/libp2p')
const { isWindows } = require('../../src/util')
const { connect } = require('../util')
const {
  Request,
  Response,
  StreamInfo
} = require('../../src/protocol')

const daemonAddr = isWindows
  ? ma('/ip4/0.0.0.0/tcp/8080')
  : ma(`/unix${path.resolve(os.tmpdir(), '/tmp/p2pd.sock')}`)

describe('streams', function () {
  let daemon
  let libp2pPeer
  let client

  before(function () {
    this.timeout(20e3)
    return Promise.all([
      createDaemon({
        quiet: false,
        q: false,
        bootstrap: false,
        hostAddrs: '/ip4/0.0.0.0/tcp/0,/ip4/0.0.0.0/tcp/0/ws',
        b: false,
        dht: true,
        dhtClient: false,
        connMgr: false,
        listen: daemonAddr.toString(),
        id: '',
        bootstrapPeers: ''
      }),
      createLibp2p({
        dht: true,
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

  after(() => {
    return Promise.all([
      daemon.stop(),
      libp2pPeer.stop()
    ])
  })

  afterEach(async () => {
    await client && client.close()
  })

  it('should be able to open a stream and echo with it', async () => {
    const hello = Buffer.from('hello there')

    // Have the peer echo our messages back
    libp2pPeer.handle('/echo/1.0.0', ({ stream }) => pipe(stream, stream))

    client = new Client(daemonAddr)
    const maConn = await client.connect()
    const streamHandler = new StreamHandler({ stream: maConn })

    const request = {
      type: Request.Type.STREAM_OPEN,
      connect: null,
      streamOpen: {
        peer: Buffer.from(libp2pPeer.peerInfo.id.toB58String()),
        proto: ['/echo/1.0.0']
      },
      streamHandler: null,
      dht: null,
      connManager: null
    }

    // Open a stream from the daemon to the peer node
    streamHandler.write(Request.encode(request))

    // Verify the response
    const response = Response.decode(await streamHandler.read())
    expect(response.type).to.eql(Response.Type.OK)
    expect(response.streamInfo).to.have.deep.property('peer', libp2pPeer.peerInfo.id.toBytes())
    expect(response.streamInfo).to.have.property('proto', '/echo/1.0.0')
    expect(response.streamInfo.addr).to.satisfy(function (buffer) {
      const addrs = libp2pPeer.peerInfo.multiaddrs.toArray()
      return addrs.filter(addr => buffer.equals(addr.buffer)).length > 0
    }, 'Did not contain a valid multiaddr')

    const source = require('it-pushable')()
    const stream = streamHandler.rest()
    source.push(hello)
    const output = await pipe(
      source,
      stream,
      take(1),
      toBuffer,
      collect
    )
    source.end()
    expect(output).to.eql([hello])
  })

  it('should be able to register a stream handler and echo with it', async () => {
    client = new Client(daemonAddr)
    const addr = isWindows
      ? ma('/ip4/0.0.0.0/tcp/9090')
      : ma(`/unix${path.resolve(os.tmpdir(), '/tmp/p2p-echo-handler.sock')}`)

    const maConn = await client.connect()
    const streamHandler = new StreamHandler({ stream: maConn })
    // Start an echo server, where we will handle streams from the daemon
    await client.start(addr, async (connection) => {
      const streamHandler = new StreamHandler({ stream: connection })

      // Read the stream info from the daemon, then pipe to echo
      const message = await streamHandler.read()
      const response = StreamInfo.decode(message)

      expect(response.peer).to.eql(libp2pPeer.peerInfo.id.toBytes())
      expect(response.proto).to.eql('/echo/1.0.0')

      const stream = streamHandler.rest()
      // Echo messages
      pipe(
        stream,
        stream
      )
    })

    const request = {
      type: Request.Type.STREAM_HANDLER,
      connect: null,
      streamOpen: null,
      streamHandler: {
        addr: addr.buffer,
        proto: ['/echo/1.0.0']
      },
      dht: null,
      connManager: null
    }

    // Register the stream handler
    streamHandler.write(Request.encode(request))
    const response = Response.decode(await streamHandler.read())
    expect(response.type).to.eql(Response.Type.OK)

    // Open a connection between the peer and our daemon
    // Then send hello from the peer to the daemon
    const connection = await libp2pPeer.dial(daemon.libp2p.peerInfo)
    const { stream } = await connection.newStream('/echo/1.0.0')
    const hello = Buffer.from('hello, peer')

    const results = await pipe(
      [hello],
      stream,
      toBuffer,
      collect
    )
    await connection.close()

    expect(results).to.eql([hello])
  })
})
