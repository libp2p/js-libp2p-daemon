/* eslint-env mocha */

import { expect } from 'aegir/chai'
import sinon from 'sinon'
import { createServer, Libp2p, Libp2pServer } from '@libp2p/daemon-server'
import { createClient, DaemonClient } from '../src/index.js'
import { multiaddr } from '@multiformats/multiaddr'
import { StubbedInstance, stubInterface } from 'sinon-ts'
import { peerIdFromString } from '@libp2p/peer-id'
import { mockRegistrar, connectionPair } from '@libp2p/interface-mocks'
import type { PeerStore, AddressBook } from '@libp2p/interface-peer-store'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import all from 'it-all'
import { pipe } from 'it-pipe'

const defaultMultiaddr = multiaddr('/ip4/0.0.0.0/tcp/0')

describe('daemon stream client', function () {
  this.timeout(50e3)

  let libp2p: StubbedInstance<Libp2p>
  let server: Libp2pServer
  let client: DaemonClient

  beforeEach(async function () {
    libp2p = stubInterface<Libp2p>()
    libp2p.peerStore = stubInterface<PeerStore>()
    libp2p.peerStore.addressBook = stubInterface<AddressBook>()

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

  it('should be able to open a stream, write to it and a stream handler, should handle the message', async () => {
    const protocol = '/echo/1.0.0'

    const peerA = peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')
    const registrarA = mockRegistrar()
    await registrarA.handle(protocol, (data) => {
      void pipe(
        data.stream,
        data.stream
      )
    })

    const peerB = peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsb')
    const registrarB = mockRegistrar()
    await registrarB.handle(protocol, (data) => {
      void pipe(
        data.stream,
        data.stream
      )
    })

    const [peerAtoPeerB] = connectionPair({
        peerId: peerA,
        registrar: registrarA
      }, {
        peerId: peerB,
        registrar: registrarB
      }
    )

    libp2p.dial.withArgs(peerB).resolves(peerAtoPeerB)

    const stream = await client.openStream(peerB, protocol)

    const data = await pipe(
      [uint8ArrayFromString('hello world')],
      stream,
      async (source) => await all(source)
    )

    expect(data).to.have.lengthOf(1)
    expect(uint8ArrayToString(data[0].subarray())).to.equal('hello world')
  })
})
