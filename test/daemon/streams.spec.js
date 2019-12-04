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
const { collect } = require('streaming-iterables')
const { toBuffer } = require('it-buffer')

const Client = require('../../src/client')
const { createDaemon } = require('../../src/daemon')
const { createLibp2p } = require('../../src/libp2p')
const { ends, isWindows } = require('../../src/util')
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
    libp2pPeer.handle('/echo/1.0.0', ({ stream }) => {
      pipe(stream, stream)
    })

    client = new Client(daemonAddr)
    await client.attach()

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
    client.streamHandler.write(Request.encode(request))

    // Verify the response
    const response = Response.decode(await client.streamHandler.read())
    console.log(response)
    expect(response.type).to.eql(Response.Type.OK)
    expect(response.streamInfo).to.eql({
      peer: libp2pPeer.peerInfo.id.toBytes(),
      addr: libp2pPeer.peerInfo.multiaddrs.toArray()[0].buffer,
      proto: '/echo/1.0.0'
    })

    const stream = client.streamHandler.rest()
    const output = await pipe(
      [hello],
      stream,
      toBuffer,
      collect
    )
    expect(output).to.eql([hello])
  })

  it.skip('should be able to register a stream handler and echo with it', async () => {
    // client = new Client(daemonAddr)
    // const addr = isWindows
    //   ? ma('/ip4/0.0.0.0/tcp/9090')
    //   : ma(`/unix${path.resolve(os.tmpdir(), '/tmp/p2p-echo-handler.sock')}`)

    // await client.attach()
    // // Start an echo server, where we will handle streams from the daemon
    // await client.startServer(addr, async (conn) => {
    //   // Decode the stream
    //   const dec = decode()
    //   conn.pipe(dec)

    //   // Read the stream info from the daemon, then pipe to echo
    //   const message = await ends(dec).first()
    //   const response = StreamInfo.decode(message)

    //   expect(response.peer).to.eql(libp2pPeer.peerInfo.id.toBytes())
    //   expect(response.proto).to.eql('/echo/1.0.0')

    //   conn.unpipe(dec)

    //   // Echo messages
    //   pipeline(
    //     conn,
    //     conn,
    //     (err) => {
    //       expect(err).to.not.exist()
    //     }
    //   )
    // })

    // const request = {
    //   type: Request.Type.STREAM_HANDLER,
    //   connect: null,
    //   streamOpen: null,
    //   streamHandler: {
    //     addr: addr.buffer,
    //     proto: ['/echo/1.0.0']
    //   },
    //   dht: null,
    //   connManager: null
    // }

    // // Register the stream handler
    // const stream = client.send(request)
    // const response = Response.decode(await stream.first())
    // expect(response.type).to.eql(Response.Type.OK)

    // // Open a connection between the peer and our daemon
    // // Then send hello from the peer to the daemon
    // const connection = await libp2pPeer.dial(daemon.libp2p.peerInfo, '/echo/1.0.0')
    // const hello = Buffer.from('hello, peer')
    // connection.write(hello)

    // // TODO: The connection from dial should be async iterable
    // return new Promise((resolve) => {
    //   connection.on('data', message => {
    //     expect(message).to.eql(hello)
    //     connection.end()
    //     resolve()
    //   })
    // })
  })
})
