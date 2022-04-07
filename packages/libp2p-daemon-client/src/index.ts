import errcode from 'err-code'
import { TCP } from '@libp2p/tcp'
import { IRequest, PSMessage, Request, Response } from '@libp2p/daemon-protocol'
import { StreamHandler } from '@libp2p/daemon-protocol/stream-handler'
import { Multiaddr } from '@multiformats/multiaddr'
import { DHT } from './dht.js'
import { Pubsub } from './pubsub.js'
import { isPeerId, PeerId } from '@libp2p/interfaces/peer-id'
import { passThroughUpgrader } from '@libp2p/daemon-protocol/upgrader'
import { peerIdFromBytes } from '@libp2p/peer-id'
import type { Duplex } from 'it-stream-types'
import type { CID } from 'multiformats/cid'
import type { PeerInfo } from '@libp2p/interfaces/peer-info'

class Client implements DaemonClient {
  private readonly multiaddr: Multiaddr
  public dht: DHT
  public pubsub: Pubsub
  private readonly tcp: TCP

  constructor (addr: Multiaddr) {
    this.multiaddr = addr
    this.tcp = new TCP()

    this.dht = new DHT(this)
    this.pubsub = new Pubsub(this)
  }

  /**
   * Connects to a daemon at the unix socket path the daemon
   * was created with
   *
   * @async
   * @returns {MultiaddrConnection}
   */
  async connectDaemon () {
    return await this.tcp.dial(this.multiaddr, {
      upgrader: passThroughUpgrader
    })
  }

  /**
   * Sends the request to the daemon and returns a stream. This
   * should only be used when sending daemon requests.
   */
  async send (request: IRequest) {
    const maConn = await this.connectDaemon()

    const streamHandler = new StreamHandler({ stream: maConn })
    streamHandler.write(Request.encode(request).finish())
    return streamHandler
  }

  /**
   * Connect requests a connection to a known peer on a given set of addresses
   */
  async connect (peerId: PeerId, addrs: Multiaddr[]) {
    if (!isPeerId(peerId)) {
      throw errcode(new Error('invalid peer id received'), 'ERR_INVALID_PEER_ID')
    }

    if (!Array.isArray(addrs)) {
      throw errcode(new Error('addrs received are not in an array'), 'ERR_INVALID_ADDRS_TYPE')
    }

    addrs.forEach((addr) => {
      if (!Multiaddr.isMultiaddr(addr)) {
        throw errcode(new Error('received an address that is not a multiaddr'), 'ERR_NO_MULTIADDR_RECEIVED')
      }
    })

    const sh = await this.send({
      type: Request.Type.CONNECT,
      connect: {
        peer: peerId.toBytes(),
        addrs: addrs.map((a) => a.bytes)
      }
    })

    const message = await sh.read()
    if (message == null) {
      throw errcode(new Error('unspecified'), 'ERR_CONNECT_FAILED')
    }

    const response = Response.decode(message)
    if (response.type !== Response.Type.OK) {
      const errResponse = response.error ?? { msg: 'unspecified' }
      throw errcode(new Error(errResponse.msg ?? 'unspecified'), 'ERR_CONNECT_FAILED')
    }

    await sh.close()
  }

  /**
   * @typedef {object} IdentifyResponse
   * @property {PeerId} peerId
   * @property {Array.<multiaddr>} addrs
   */

  /**
   * Identify queries the daemon for its peer ID and listen addresses.
   */
  async identify (): Promise<IdentifyResult> {
    const sh = await this.send({
      type: Request.Type.IDENTIFY
    })

    const message = await sh.read()
    const response = Response.decode(message)

    if (response.type !== Response.Type.OK) {
      throw errcode(new Error(response.error?.msg ?? 'Identify failed'), 'ERR_IDENTIFY_FAILED')
    }

    if (response.identify == null || response.identify.addrs == null) {
      throw errcode(new Error('Invalid response'), 'ERR_IDENTIFY_FAILED')
    }

    const peerId = peerIdFromBytes(response.identify?.id)
    const addrs = response.identify.addrs.map((a) => new Multiaddr(a))

    await sh.close()

    return ({ peerId, addrs })
  }

  /**
   * Get a list of IDs of peers the node is connected to
   */
  async listPeers (): Promise<PeerId[]> {
    const sh = await this.send({
      type: Request.Type.LIST_PEERS
    })

    const message = await sh.read()
    const response = Response.decode(message)

    if (response.type !== Response.Type.OK) {
      throw errcode(new Error(response.error?.msg ?? 'List peers failed'), 'ERR_LIST_PEERS_FAILED')
    }

    await sh.close()

    return response.peers.map((peer) => peerIdFromBytes(peer.id))
  }

  /**
   * Initiate an outbound stream to a peer on one of a set of protocols.
   */
  async openStream (peerId: PeerId, protocol: string): Promise<Duplex<Uint8Array>> {
    if (!isPeerId(peerId)) {
      throw errcode(new Error('invalid peer id received'), 'ERR_INVALID_PEER_ID')
    }

    if (typeof protocol !== 'string') {
      throw errcode(new Error('invalid protocol received'), 'ERR_INVALID_PROTOCOL')
    }

    const sh = await this.send({
      type: Request.Type.STREAM_OPEN,
      streamOpen: {
        peer: peerId.toBytes(),
        proto: [protocol]
      }
    })

    const message = await sh.read()
    const response = Response.decode(message)

    if (response.type !== Response.Type.OK) {
      await sh.close()
      throw errcode(new Error(response.error?.msg ?? 'Open stream failed'), 'ERR_OPEN_STREAM_FAILED')
    }

    return sh.rest()
  }

  /**
   * Register a handler for inbound streams on a given protocol
   */
  async registerStreamHandler (addr: Multiaddr, protocol: string) {
    if (!Multiaddr.isMultiaddr(addr)) {
      throw errcode(new Error('invalid multiaddr received'), 'ERR_INVALID_MULTIADDR')
    }

    if (typeof protocol !== 'string') {
      throw errcode(new Error('invalid protocol received'), 'ERR_INVALID_PROTOCOL')
    }

    const sh = await this.send({
      type: Request.Type.STREAM_HANDLER,
      streamOpen: null,
      streamHandler: {
        addr: addr.bytes,
        proto: [protocol]
      }
    })

    const message = await sh.read()
    const response = Response.decode(message)

    await sh.close()

    if (response.type !== Response.Type.OK) {
      throw errcode(new Error(response.error?.msg ?? 'Register stream handler failed'), 'ERR_REGISTER_STREAM_HANDLER_FAILED')
    }
  }
}

export interface IdentifyResult {
  peerId: PeerId
  addrs: Multiaddr[]
}

export interface DHTClient {
  put: (key: Uint8Array, value: Uint8Array) => Promise<void>
  get: (key: Uint8Array) => Promise<Uint8Array>
  provide: (cid: CID) => Promise<void>
  findProviders: (cid: CID, count?: number) => AsyncIterable<PeerInfo>
  findPeer: (peerId: PeerId) => Promise<PeerInfo>
  getClosestPeers: (key: Uint8Array) => AsyncIterable<PeerInfo>
}

export interface PubSubClient {
  publish: (topic: string, data: Uint8Array) => Promise<void>
  subscribe: (topic: string) => AsyncIterable<PSMessage>
  getTopics: () => Promise<string[]>
}

export interface DaemonClient {
  identify: () => Promise<IdentifyResult>
  listPeers: () => Promise<PeerId[]>
  connect: (peerId: PeerId, addrs: Multiaddr[]) => Promise<void>
  dht: DHTClient
  pubsub: PubSubClient

  send: (request: IRequest) => Promise<StreamHandler>
  openStream: (peerId: PeerId, protocol: string) => Promise<Duplex<Uint8Array>>
}

export function createClient (multiaddr: Multiaddr): DaemonClient {
  return new Client(multiaddr)
}