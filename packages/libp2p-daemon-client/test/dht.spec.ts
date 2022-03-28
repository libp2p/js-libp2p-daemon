/* eslint-env mocha */

import { expect } from 'aegir/utils/chai.js'
import sinon from 'sinon'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { createServer, Libp2p, Libp2pServer } from '@libp2p/daemon-server'
import { createClient, DaemonClient } from '../src/index.js'
import { Multiaddr } from '@multiformats/multiaddr'
import { StubbedInstance, stubInterface } from 'ts-sinon'
import { DualDHT, ValueEvent, FinalPeerEvent, PeerResponseEvent, MessageType, EventTypes } from '@libp2p/interfaces/dht'
import { peerIdFromString } from '@libp2p/peer-id'
import { CID } from 'multiformats/cid'
import all from 'it-all'

const defaultMultiaddr = new Multiaddr('/ip4/0.0.0.0/tcp/12345')

describe('daemon dht client', function () {
  this.timeout(30e3)

  let libp2p: StubbedInstance<Libp2p>
  let server: Libp2pServer
  let client: DaemonClient
  let dht: StubbedInstance<DualDHT>

  beforeEach(async function () {
    dht = stubInterface<DualDHT>()
    libp2p = stubInterface<Libp2p>()
    libp2p.dht = dht

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

  describe('put', () => {
    const key = uint8ArrayFromString('/key')
    const value = uint8ArrayFromString('oh hello there')

    it('should be able to put a value to the dht', async function () {
      dht.put.returns(async function * () {}())

      await client.dht.put(key, value)

      expect(dht.put.calledWith(key, value)).to.be.true()
    })

    it('should error if receive an error message', async () => {
      dht.put.returns(async function * () { // eslint-disable-line require-yield
        throw new Error('Urk!')
      }())

      await expect(client.dht.put(key, value)).to.eventually.be.rejectedWith(/Urk!/)
    })
  })

  describe('get', () => {
    it('should be able to get a value from the dht', async function () {
      const key = uint8ArrayFromString('/key')
      const value = uint8ArrayFromString('oh hello there')

      dht.get.withArgs(key).returns(async function * () {
        const event: ValueEvent = {
          name: 'VALUE',
          type: EventTypes.VALUE,
          value,
          from: peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')
        }

        yield event
      }())

      const result = await client.dht.get(key)

      expect(result).to.equalBytes(value)
    })

    it('should error if receive an error message', async function () {
      const key = uint8ArrayFromString('/key')

      dht.get.returns(async function * () { // eslint-disable-line require-yield
        throw new Error('Urk!')
      }())

      await expect(client.dht.get(key)).to.eventually.be.rejectedWith(/Urk!/)
    })
  })

  describe('findPeer', () => {
    it('should be able to find a peer', async () => {
      const id = peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')

      dht.findPeer.withArgs(id).returns(async function * () {
        const event: FinalPeerEvent = {
          name: 'FINAL_PEER',
          type: EventTypes.FINAL_PEER,
          peer: {
            id,
            multiaddrs: [],
            protocols: []
          },
          from: peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')
        }

        yield event
      }())

      const result = await client.dht.findPeer(id)

      expect(result.id.equals(id)).to.be.true()
    })

    it('should error if receive an error message', async () => {
      const id = peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')

      dht.findPeer.returns(async function * () { // eslint-disable-line require-yield
        throw new Error('Urk!')
      }())

      await expect(client.dht.findPeer(id)).to.eventually.be.rejectedWith(/Urk!/)
    })
  })

  describe('provide', () => {
    it('should be able to provide', async () => {
      const cid = CID.parse('QmVzw6MPsF96TyXBSRs1ptLoVMWRv5FCYJZZGJSVB2Hp38')

      dht.provide.returns(async function * () {}())

      await client.dht.provide(cid)

      expect(dht.provide.calledWith(cid)).to.be.true()
    })

    it('should error if receive an error message', async () => {
      const cid = CID.parse('QmVzw6MPsF96TyXBSRs1ptLoVMWRv5FCYJZZGJSVB2Hp38')

      dht.provide.returns(async function * () { // eslint-disable-line require-yield
        throw new Error('Urk!')
      }())

      await expect(client.dht.provide(cid)).to.eventually.be.rejectedWith(/Urk!/)
    })
  })

  describe('findProviders', () => {
    it('should be able to find providers', async () => {
      const cid = CID.parse('QmVzw6MPsF96TyXBSRs1ptLoVMWRv5FCYJZZGJSVB2Hp38')
      const id = peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')

      dht.findProviders.withArgs(cid).returns(async function * () {
        const event: PeerResponseEvent = {
          name: 'PEER_RESPONSE',
          type: EventTypes.PEER_RESPONSE,
          providers: [{
            id,
            multiaddrs: [],
            protocols: []
          }],
          closer: [],
          from: id,
          messageName: 'GET_PROVIDERS',
          messageType: MessageType.GET_PROVIDERS
        }

        yield event
      }())

      const result = await all(client.dht.findProviders(cid))

      expect(result).to.have.lengthOf(1)
      expect(result[0].id.equals(id)).to.be.true()
    })

    // skipped because the protocol doesn't handle streaming errors
    it.skip('should error if receive an error message', async () => {
      const cid = CID.parse('QmVzw6MPsF96TyXBSRs1ptLoVMWRv5FCYJZZGJSVB2Hp38')

      dht.findProviders.returns(async function * () { // eslint-disable-line require-yield
        throw new Error('Urk!')
      }())

      await expect(all(client.dht.findProviders(cid))).to.eventually.be.rejectedWith(/Urk!/)
    })
  })

  describe('getClosestPeers', () => {
    it('should be able to get the closest peers', async () => {
      const cid = CID.parse('QmVzw6MPsF96TyXBSRs1ptLoVMWRv5FCYJZZGJSVB2Hp38')
      const id = peerIdFromString('12D3KooWJKCJW8Y26pRFNv78TCMGLNTfyN8oKaFswMRYXTzSbSsa')

      dht.getClosestPeers.withArgs(cid.bytes).returns(async function * () {
        const event: PeerResponseEvent = {
          name: 'PEER_RESPONSE',
          type: EventTypes.PEER_RESPONSE,
          providers: [],
          closer: [{
            id,
            multiaddrs: [],
            protocols: []
          }],
          from: id,
          messageName: 'GET_PROVIDERS',
          messageType: MessageType.GET_PROVIDERS
        }

        yield event
      }())

      const result = await all(client.dht.getClosestPeers(cid.bytes))

      expect(result).to.have.lengthOf(1)
      expect(result[0].id.equals(id)).to.be.true()
    })

    // skipped because the protocol doesn't handle streaming errors
    it.skip('should error if it gets an invalid key', async () => {
      const cid = CID.parse('QmVzw6MPsF96TyXBSRs1ptLoVMWRv5FCYJZZGJSVB2Hp38')

      dht.getClosestPeers.returns(async function * () { // eslint-disable-line require-yield
        throw new Error('Urk!')
      }())

      await expect(all(client.dht.getClosestPeers(cid.bytes))).to.eventually.be.rejectedWith(/Urk!/)
    })
  })
})
