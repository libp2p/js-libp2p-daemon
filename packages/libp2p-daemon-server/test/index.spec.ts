/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 5] */

import { multiaddr } from '@multiformats/multiaddr'
import { expect } from 'aegir/chai'
import { createServer, Libp2p } from '../src/index.js'
import { stubInterface } from 'ts-sinon'

const ma = multiaddr('/ip4/0.0.0.0/tcp/0')

describe('server', () => {
  it('should start', async () => {
    const libp2p = stubInterface<Libp2p>()

    const server = await createServer(ma, libp2p)

    await server.start()

    expect(libp2p.start.called).to.be.true()

    await server.stop()
  })

  it('should stop', async () => {
    const libp2p = stubInterface<Libp2p>()

    const server = await createServer(ma, libp2p)

    await server.start()
    await server.stop()

    expect(libp2p.stop.called).to.be.true()
  })

  it('should return multiaddrs', async () => {
    const libp2p = stubInterface<Libp2p>()

    const server = await createServer(ma, libp2p)

    expect(() => server.getMultiaddr()).to.throw(/Not started/)

    await server.start()

    expect(server.getMultiaddr()).to.be.ok()

    await server.stop()

    expect(() => server.getMultiaddr()).to.throw(/Not started/)
  })
})
