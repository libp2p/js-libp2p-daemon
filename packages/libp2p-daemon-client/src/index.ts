import { type PSMessage, Request, Response, StreamInfo } from '@libp2p/daemon-protocol'
import { StreamHandler } from '@libp2p/daemon-protocol/stream-handler'
import { passThroughUpgrader } from '@libp2p/daemon-protocol/upgrader'
import { CodeError, isPeerId } from '@libp2p/interface'
import { defaultLogger, logger } from '@libp2p/logger'
import { peerIdFromMultihash } from '@libp2p/peer-id'
import { tcp } from '@libp2p/tcp'
import { multiaddr, isMultiaddr } from '@multiformats/multiaddr'
import { pbStream, type ProtobufStream } from 'it-protobuf-stream'
import * as Digest from 'multiformats/hashes/digest'
import { DHT } from './dht.js'
import { Pubsub } from './pubsub.js'
import type { Stream, PeerId, MultiaddrConnection, PeerInfo, Transport } from '@libp2p/interface'
import type { Multiaddr } from '@multiformats/multiaddr'
import type { CID } from 'multiformats/cid'

const log = logger('libp2p:daemon-client')

class Client implements DaemonClient {
  private readonly multiaddr: Multiaddr
  public dht: DHT
  public pubsub: Pubsub
  private readonly tcp: Transport

  constructor (addr: Multiaddr) {
    this.multiaddr = addr
    this.tcp = tcp()({
      logger: defaultLogger()
    })
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
  async connectDaemon (): Promise<MultiaddrConnection> {
    // @ts-expect-error because we use a passthrough upgrader,
    // this is actually a MultiaddrConnection and not a Connection
    return this.tcp.dial(this.multiaddr, {
      upgrader: passThroughUpgrader
    })
  }

  /**
   * Sends the request to the daemon and returns a stream. This
   * should only be used when sending daemon requests.
   */
  async send (request: Request): Promise<ProtobufStream<MultiaddrConnection>> {
    const maConn = await this.connectDaemon()

    const subtype = request.pubsub?.type ?? request.dht?.type ?? request.peerStore?.type ?? ''
    log('send', request.type, subtype)

    const pb = pbStream(maConn)
    await pb.write(request, Request)

    return pb
  }

  /**
   * Connect requests a connection to a known peer on a given set of addresses
   */
  async connect (peerId: PeerId, addrs: Multiaddr[]): Promise<void> {
    if (!isPeerId(peerId)) {
      throw new CodeError('invalid peer id received', 'ERR_INVALID_PEER_ID')
    }

    if (!Array.isArray(addrs)) {
      throw new CodeError('addrs received are not in an array', 'ERR_INVALID_ADDRS_TYPE')
    }

    addrs.forEach((addr) => {
      if (!isMultiaddr(addr)) {
        throw new CodeError('received an address that is not a multiaddr', 'ERR_NO_MULTIADDR_RECEIVED')
      }
    })

    const sh = await this.send({
      type: Request.Type.CONNECT,
      connect: {
        peer: peerId.toMultihash().bytes,
        addrs: addrs.map((a) => a.bytes)
      }
    })

    const response = await sh.read(Response)

    if (response.type !== Response.Type.OK) {
      const errResponse = response.error ?? { msg: 'unspecified' }
      throw new CodeError(errResponse.msg ?? 'unspecified', 'ERR_CONNECT_FAILED')
    }

    await sh.unwrap().close()
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

    const response = await sh.read(Response)

    if (response.type !== Response.Type.OK) {
      throw new CodeError(response.error?.msg ?? 'Identify failed', 'ERR_IDENTIFY_FAILED')
    }

    if (response.identify?.addrs == null) {
      throw new CodeError('Invalid response', 'ERR_IDENTIFY_FAILED')
    }

    const peerId = peerIdFromMultihash(Digest.decode(response.identify?.id))
    const addrs = response.identify.addrs.map((a) => multiaddr(a))

    await sh.unwrap().close()

    return ({ peerId, addrs })
  }

  /**
   * Get a list of IDs of peers the node is connected to
   */
  async listPeers (): Promise<PeerId[]> {
    const sh = await this.send({
      type: Request.Type.LIST_PEERS
    })

    const response = await sh.read(Response)

    if (response.type !== Response.Type.OK) {
      throw new CodeError(response.error?.msg ?? 'List peers failed', 'ERR_LIST_PEERS_FAILED')
    }

    await sh.unwrap().close()

    return response.peers.map((peer) => peerIdFromMultihash(Digest.decode(peer.id)))
  }

  /**
   * Initiate an outbound stream to a peer on one of a set of protocols.
   */
  async openStream (peerId: PeerId, protocol: string): Promise<MultiaddrConnection> {
    if (!isPeerId(peerId)) {
      throw new CodeError('invalid peer id received', 'ERR_INVALID_PEER_ID')
    }

    if (typeof protocol !== 'string') {
      throw new CodeError('invalid protocol received', 'ERR_INVALID_PROTOCOL')
    }

    const sh = await this.send({
      type: Request.Type.STREAM_OPEN,
      streamOpen: {
        peer: peerId.toMultihash().bytes,
        proto: [protocol]
      }
    })

    const response = await sh.read(Response)

    if (response.type !== Response.Type.OK) {
      await sh.unwrap().close()
      throw new CodeError(response.error?.msg ?? 'Open stream failed', 'ERR_OPEN_STREAM_FAILED')
    }

    return sh.unwrap()
  }

  /**
   * Register a handler for inbound streams on a given protocol
   */
  async registerStreamHandler (protocol: string, handler: StreamHandlerFunction): Promise<void> {
    if (typeof protocol !== 'string') {
      throw new CodeError('invalid protocol received', 'ERR_INVALID_PROTOCOL')
    }

    // open a tcp port, pipe any data from it to the handler function
    const listener = this.tcp.createListener({
      upgrader: passThroughUpgrader,
      // @ts-expect-error because we are using a passthrough upgrader, this is a MultiaddrConnection
      handler: (connection: MultiaddrConnection) => {
        Promise.resolve()
          .then(async () => {
            const sh = new StreamHandler({
              stream: connection
            })
            const message = await sh.read()

            if (message == null) {
              throw new CodeError('Could not read open stream response', 'ERR_OPEN_STREAM_FAILED')
            }

            const response = StreamInfo.decode(message)

            if (response.proto !== protocol) {
              throw new CodeError('Incorrect protocol', 'ERR_OPEN_STREAM_FAILED')
            }

            // @ts-expect-error because we are using a passthrough upgrader, this is a MultiaddrConnection
            await handler(sh.rest())
          })
          .catch(err => {
            connection.abort(err)
          })
          .finally(() => {
            connection.close()
              .catch(err => {
                log.error(err)
              })
            listener.close()
              .catch(err => {
                log.error(err)
              })
          })
      }
    })
    await listener.listen(multiaddr('/ip4/127.0.0.1/tcp/0'))
    const address = listener.getAddrs()[0]

    if (address == null) {
      throw new CodeError('Could not listen on port', 'ERR_REGISTER_STREAM_HANDLER_FAILED')
    }

    const sh = await this.send({
      type: Request.Type.STREAM_HANDLER,
      streamHandler: {
        addr: address.bytes,
        proto: [protocol]
      }
    })

    const response = await sh.read(Response)

    await sh.unwrap().close()

    if (response.type !== Response.Type.OK) {
      throw new CodeError(response.error?.msg ?? 'Register stream handler failed', 'ERR_REGISTER_STREAM_HANDLER_FAILED')
    }
  }
}

export interface IdentifyResult {
  peerId: PeerId
  addrs: Multiaddr[]
}

export interface StreamHandlerFunction {
  (stream: Stream): Promise<void>
}

export interface DHTClient {
  put(key: Uint8Array, value: Uint8Array): Promise<void>
  get(key: Uint8Array): Promise<Uint8Array>
  provide(cid: CID): Promise<void>
  findProviders(cid: CID, count?: number): AsyncIterable<PeerInfo>
  findPeer(peerId: PeerId): Promise<PeerInfo>
  getClosestPeers(key: Uint8Array): AsyncIterable<PeerInfo>
}

export interface Subscription {
  messages(): AsyncIterable<PSMessage>
  cancel(): Promise<void>
}

export interface PubSubClient {
  publish(topic: string, data: Uint8Array): Promise<void>
  subscribe(topic: string): Promise<Subscription>
  getTopics(): Promise<string[]>
  getSubscribers(topic: string): Promise<PeerId[]>
}

export interface DaemonClient {
  identify(): Promise<IdentifyResult>
  listPeers(): Promise<PeerId[]>
  connect(peerId: PeerId, addrs: Multiaddr[]): Promise<void>
  dht: DHTClient
  pubsub: PubSubClient

  send(request: Request): Promise<ProtobufStream<MultiaddrConnection>>
  openStream(peerId: PeerId, protocol: string): Promise<MultiaddrConnection>
  registerStreamHandler(protocol: string, handler: StreamHandlerFunction): Promise<void>
}

export function createClient (multiaddr: Multiaddr): DaemonClient {
  return new Client(multiaddr)
}
