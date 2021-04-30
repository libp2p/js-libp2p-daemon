/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 5] */
'use strict'

const { expect } = require('aegir/utils/chai')
const os = require('os')
const path = require('path')
const CID = require('cids')
const { Multiaddr } = require('multiaddr')
const delay = require('delay')
const PeerId = require('peer-id')
const uint8ArrayFromString = require('uint8arrays/from-string')
const uint8ArrayToString = require('uint8arrays/to-string')

const StreamHandler = require('../../src/stream-handler')
const { createDaemon } = require('../../src/daemon')
const { createLibp2p } = require('../../src/libp2p')
const Client = require('../../src/client')
const { isWindows } = require('../../src/util')
const { connect } = require('../util')
const {
  Request,
  DHTRequest,
  Response,
  DHTResponse
} = require('../../src/protocol')

const daemonAddr = isWindows
  ? new Multiaddr('/ip4/0.0.0.0/tcp/8080')
  : new Multiaddr(`/unix${path.resolve(os.tmpdir(), '/tmp/p2pd.sock')}`)

describe('dht', () => {
  const cid = new CID('QmVzw6MPsF96TyXBSRs1ptLoVMWRv5FCYJZZGJSVB2Hp38')
  let daemon
  let libp2pPeer
  let client

  before(async function () {
    this.timeout(20e3)
    ;[daemon, libp2pPeer] = await Promise.all([
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

  after(() => {
    return Promise.all([
      daemon.stop(),
      libp2pPeer.stop()
    ])
  })

  afterEach(async () => {
    await client && client.close()
  })

  it('should be able to find a peer', async () => {
    client = new Client(daemonAddr)

    const maConn = await client.connect()
    const streamHandler = new StreamHandler({ stream: maConn })

    const request = {
      type: Request.Type.DHT,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      dht: {
        type: DHTRequest.Type.FIND_PEER,
        peer: libp2pPeer.peerId.toBytes()
      },
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    streamHandler.write(Request.encode(request).finish())

    const response = Response.decode(await streamHandler.read())
    expect(response.type).to.eql(Response.Type.OK)
    expect(PeerId.createFromBytes(response.dht.peer.id).equals(libp2pPeer.peerId)).to.eql(true)
    response.dht.peer.addrs.forEach((a, i) => {
      expect((new Multiaddr(a)).equals(libp2pPeer.multiaddrs[i])).to.eql(true)
    })
    streamHandler.close()
  })

  it('should return an error when no peer is found', async () => {
    client = new Client(daemonAddr)

    const maConn = await client.connect()
    const streamHandler = new StreamHandler({ stream: maConn })
    const unknownPeer = await PeerId.create({ bits: 512 })

    const request = {
      type: Request.Type.DHT,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      dht: {
        type: DHTRequest.Type.FIND_PEER,
        peer: unknownPeer.toBytes()
      },
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    streamHandler.write(Request.encode(request).finish())

    const response = Response.decode(await streamHandler.read())
    expect(response.type).to.eql(Response.Type.ERROR)
    streamHandler.close()
  })

  it('should be able to register as a provider', async () => {
    client = new Client(daemonAddr)

    const maConn = await client.connect()
    const streamHandler = new StreamHandler({ stream: maConn })

    const request = {
      type: Request.Type.DHT,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      dht: {
        type: DHTRequest.Type.PROVIDE,
        cid: cid.bytes
      },
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    streamHandler.write(Request.encode(request).finish())

    const response = Response.decode(await streamHandler.read())
    expect(response.type).to.eql(Response.Type.OK)
    streamHandler.close()

    // The peer should be able to find our daemon as a provider
    const providers = []
    for await (const provider of libp2pPeer.contentRouting.findProviders(cid, { maxNumProviders: 1 })) {
      providers.push(provider)
    }
    expect(daemon.libp2p.peerId.isEqual(providers[0].id)).to.eql(true)
  })

  it('should be able to find providers', async () => {
    // Register the peer as a provider
    const cid = new CID('QmaSNGNpisJ1UeuoH3WcKuia4hQVi2XkfhkszTbWak9TxB')
    await libp2pPeer.contentRouting.provide(cid)

    // Now find it as a provider
    client = new Client(daemonAddr)

    const maConn = await client.connect()
    const streamHandler = new StreamHandler({ stream: maConn })

    const request = {
      type: Request.Type.DHT,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      dht: {
        type: DHTRequest.Type.FIND_PROVIDERS,
        cid: cid.bytes,
        count: 1
      },
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    streamHandler.write(Request.encode(request).finish())

    const expectedResponses = [
      (message) => {
        const response = Response.decode(message)
        expect(response.type).to.eql(Response.Type.OK)
        expect(response.dht.type).to.eql(DHTResponse.Type.BEGIN)
      },
      (message) => {
        const response = DHTResponse.decode(message)
        expect(response.type).to.eql(DHTResponse.Type.VALUE)
        expect(PeerId.createFromBytes(response.peer.id).equals(libp2pPeer.peerId)).to.eql(true)
        response.peer.addrs.forEach((a, i) => {
          expect((new Multiaddr(a)).equals(libp2pPeer.multiaddrs[i])).to.eql(true)
        })
      },
      (message) => {
        const response = DHTResponse.decode(message)
        expect(response.type).to.eql(DHTResponse.Type.END)
      }
    ]

    while (true) {
      if (expectedResponses.length === 0) break
      const message = await streamHandler.read()
      expectedResponses.shift()(message.slice())
    }
    streamHandler.close()
  })

  it('should error when no provider is found', async () => {
    // Register the peer as a provider
    const cid = new CID('QmaSNGNpisJ1UeuoH3WcKuia4hQVi2XkfhkszTbWak9xTB')

    // Now find it as a provider
    client = new Client(daemonAddr)

    const maConn = await client.connect()
    const streamHandler = new StreamHandler({ stream: maConn })

    const request = {
      type: Request.Type.DHT,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      dht: {
        type: DHTRequest.Type.FIND_PROVIDERS,
        cid: cid.bytes,
        count: 1
      },
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    streamHandler.write(Request.encode(request).finish())

    const expectedResponses = [
      (message) => {
        const response = Response.decode(message)
        expect(response.type).to.eql(Response.Type.ERROR)
      }
    ]

    while (true) {
      if (expectedResponses.length === 0) break
      const message = await streamHandler.read()
      expectedResponses.shift()(message.slice())
    }
    streamHandler.close()
  })

  it('should be able to get closest peers to a key', async () => {
    // Now find it as a provider
    client = new Client(daemonAddr)

    const maConn = await client.connect()
    const streamHandler = new StreamHandler({ stream: maConn })

    const request = {
      type: Request.Type.DHT,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      dht: {
        type: DHTRequest.Type.GET_CLOSEST_PEERS,
        key: uint8ArrayFromString('foobar')
      },
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    streamHandler.write(Request.encode(request).finish())

    const expectedResponses = [
      (message) => {
        const response = Response.decode(message)
        expect(response.type).to.eql(Response.Type.OK)
        expect(response.dht.type).to.eql(DHTResponse.Type.BEGIN)
      },
      (message) => {
        const response = DHTResponse.decode(message)
        expect(response.type).to.eql(DHTResponse.Type.VALUE)
        expect(uint8ArrayToString(response.value, 'base58btc')).to.eql(libp2pPeer.peerId.toB58String())
      },
      (message) => {
        const response = DHTResponse.decode(message)
        expect(response.type).to.eql(DHTResponse.Type.END)
      }
    ]

    while (true) {
      if (expectedResponses.length === 0) break
      const message = await streamHandler.read()
      expectedResponses.shift()(message.slice())
    }
    streamHandler.close()
  })

  it('should be able to get the public key of a peer', async () => {
    client = new Client(daemonAddr)

    const maConn = await client.connect()
    const streamHandler = new StreamHandler({ stream: maConn })

    const request = {
      type: Request.Type.DHT,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      dht: {
        type: DHTRequest.Type.GET_PUBLIC_KEY,
        peer: libp2pPeer.peerId.toBytes()
      },
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    streamHandler.write(Request.encode(request).finish())

    const response = Response.decode(await streamHandler.read())
    expect(response.type).to.eql(Response.Type.OK)
    expect(response.dht.type).to.eql(DHTResponse.Type.VALUE)
    expect(new Uint8Array(response.dht.value)).to.eql(libp2pPeer.peerId.pubKey.bytes)
    streamHandler.close()
  })

  it('should be able to get a value from the dht', async () => {
    client = new Client(daemonAddr)

    const maConn = await client.connect()
    const streamHandler = new StreamHandler({ stream: maConn })

    await libp2pPeer.contentRouting.put(uint8ArrayFromString('/hello'), uint8ArrayFromString('world'))

    const request = {
      type: Request.Type.DHT,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      dht: {
        type: DHTRequest.Type.GET_VALUE,
        key: uint8ArrayFromString('/hello')
      },
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    streamHandler.write(Request.encode(request).finish())

    const response = Response.decode(await streamHandler.read())
    expect(response.type).to.eql(Response.Type.OK)
    expect(response.dht.type).to.eql(DHTResponse.Type.VALUE)
    expect(new Uint8Array(response.dht.value)).to.eql(uint8ArrayFromString('world'))
    streamHandler.close()
  })

  it('should error when it cannot find a value', async () => {
    client = new Client(daemonAddr)

    const maConn = await client.connect()
    const streamHandler = new StreamHandler({ stream: maConn })

    const request = {
      type: Request.Type.DHT,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      dht: {
        type: DHTRequest.Type.GET_VALUE,
        key: uint8ArrayFromString('/v/doesntexist')
      },
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    streamHandler.write(Request.encode(request).finish())

    const response = Response.decode(await streamHandler.read())
    expect(response.type).to.eql(Response.Type.ERROR)
    streamHandler.close()
  })

  it('should be able to put a value to the dht', async () => {
    client = new Client(daemonAddr)

    const maConn = await client.connect()
    const streamHandler = new StreamHandler({ stream: maConn })

    const request = {
      type: Request.Type.DHT,
      connect: null,
      streamOpen: null,
      streamHandler: null,
      dht: {
        type: DHTRequest.Type.PUT_VALUE,
        key: uint8ArrayFromString('/hello2'),
        value: uint8ArrayFromString('world2')
      },
      disconnect: null,
      pubsub: null,
      connManager: null
    }

    streamHandler.write(Request.encode(request).finish())

    const response = Response.decode(await streamHandler.read())
    expect(response.type).to.eql(Response.Type.OK)
    expect(response.dht).to.eql(null)
    streamHandler.close()

    const value = await libp2pPeer.contentRouting.get(uint8ArrayFromString('/hello2'))
    expect(value).to.eql(uint8ArrayFromString('world2'))
  })
})
