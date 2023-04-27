/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 5] */

import { multiaddr } from '@multiformats/multiaddr'
import { expect } from 'aegir/chai'
import { createServer } from '../src/index.js'
import { stubInterface } from 'sinon-ts'
import type { Libp2p } from '@libp2p/interface-libp2p'
import type { DHT } from '@libp2p/interface-dht'
import type { PubSub } from '@libp2p/interface-pubsub'

const ma = multiaddr('/ip4/0.0.0.0/tcp/0')

describe('server', () => {
  it('should start', async () => {
    const libp2p = stubInterface<Libp2p<{ dht: DHT, pubsub: PubSub }>>()

    const server = createServer(ma, libp2p)

    await server.start()

    expect(libp2p.start.called).to.be.true()

    await server.stop()
  })

  it('should stop', async () => {
    const libp2p = stubInterface<Libp2p<{ dht: DHT, pubsub: PubSub }>>()

    const server = createServer(ma, libp2p)

    await server.start()
    await server.stop()

    expect(libp2p.stop.called).to.be.true()
  })

  it('should return multiaddrs', async () => {
    const libp2p = stubInterface<Libp2p<{ dht: DHT, pubsub: PubSub }>>()

    const server = createServer(ma, libp2p)

    expect(() => server.getMultiaddr()).to.throw(/Not started/)

    await server.start()

    expect(server.getMultiaddr()).to.be.ok()

    await server.stop()

    expect(() => server.getMultiaddr()).to.throw(/Not started/)
  })
})
