/* eslint-env mocha */

import { expect } from 'aegir/chai'
import sinon from 'sinon'
import { createServer, Libp2p, Libp2pServer } from '@libp2p/daemon-server'
import { createClient, DaemonClient } from '../src/index.js'
import { multiaddr } from '@multiformats/multiaddr'
import { StubbedInstance, stubInterface } from 'sinon-ts'
import { isPeerId } from '@libp2p/interface-peer-id'
import { peerIdFromString } from '@libp2p/peer-id'
import { mockConnection, mockDuplex, mockMultiaddrConnection } from '@libp2p/interface-mocks'
import type { PeerStore, AddressBook } from '@libp2p/interface-peer-store'

const defaultMultiaddr = multiaddr('/ip4/0.0.0.0/tcp/0')

describe('daemon client', function () {
  this.timeout(30e3)

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

  describe('identify', () => {
    it('should be able to identify', async () => {
      libp2p.peerId = peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')
      libp2p.getMultiaddrs.returns([
        multiaddr('/ip4/0.0.0.0/tcp/1234/p2p/12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')
      ])

      const identify = await client.identify()

      expect(identify).to.exist()
      expect(identify.peerId).to.exist()
      expect(identify.addrs).to.exist()
      expect(isPeerId(identify.peerId))
    })

    it('should error if receive an error message', async () => {
      libp2p.peerId = peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')
      libp2p.getMultiaddrs.throws(new Error('Urk!'))

      await expect(client.identify()).to.eventually.be.rejectedWith(/Urk!/)
    })
  })

  describe('listPeers', () => {
    it('should be able to listPeers', async () => {
      const remotePeer = peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')

      libp2p.getConnections.returns([
        mockConnection(mockMultiaddrConnection(mockDuplex(), remotePeer))
      ])

      const peers = await client.listPeers()

      expect(peers).to.have.lengthOf(1)
      expect(peers[0].equals(remotePeer)).to.be.true()
    })

    it('should error if receive an error message', async () => {
      libp2p.getConnections.throws(new Error('Urk!'))

      await expect(client.listPeers()).to.eventually.be.rejectedWith(/Urk!/)
    })
  })

  describe('connect', () => {
    it('should be able to connect', async () => {
      const remotePeer = peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')
      const ma = multiaddr('/ip4/1.2.3.4/tcp/1234')

      await client.connect(remotePeer, [ma])

      expect(libp2p.dial.calledWith(remotePeer)).to.be.true()
    })

    it('should error if receive an error message', async () => {
      const remotePeer = peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')
      const ma = multiaddr('/ip4/1.2.3.4/tcp/1234')

      libp2p.dial.rejects(new Error('Urk!'))

      await expect(client.connect(remotePeer, [ma])).to.eventually.be.rejectedWith(/Urk!/)
    })
  })
})
