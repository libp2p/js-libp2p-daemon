/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-namespace */

import { enumeration, encodeMessage, decodeMessage, message } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'
import type { Codec } from 'protons-runtime'

export interface Request {
  type: Request.Type
  connect: ConnectRequest
  streamOpen: StreamOpenRequest
  streamHandler: StreamHandlerRequest
  dht: DHTRequest
  connManager: ConnManagerRequest
  disconnect: DisconnectRequest
  pubsub: PSRequest
  peerStore: PeerstoreRequest
}

export namespace Request {
  export enum Type {
    IDENTIFY = 'IDENTIFY',
    CONNECT = 'CONNECT',
    STREAM_OPEN = 'STREAM_OPEN',
    STREAM_HANDLER = 'STREAM_HANDLER',
    DHT = 'DHT',
    LIST_PEERS = 'LIST_PEERS',
    CONNMANAGER = 'CONNMANAGER',
    DISCONNECT = 'DISCONNECT',
    PUBSUB = 'PUBSUB',
    PEERSTORE = 'PEERSTORE'
  }

  enum __TypeValues {
    IDENTIFY = 0,
    CONNECT = 1,
    STREAM_OPEN = 2,
    STREAM_HANDLER = 3,
    DHT = 4,
    LIST_PEERS = 5,
    CONNMANAGER = 6,
    DISCONNECT = 7,
    PUBSUB = 8,
    PEERSTORE = 9
  }

  export namespace Type {
    export const codec = () => {
      return enumeration<Type>(__TypeValues)
    }
  }

  let _codec: Codec<Request>

  export const codec = (): Codec<Request> => {
    if (_codec == null) {
      _codec = message<Request>((obj, writer, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          writer.fork()
        }

        if (obj.type != null) {
          writer.uint32(8)
          Request.Type.codec().encode(obj.type, writer)
        } else {
          throw new Error('Protocol error: required field "type" was not found in object')
        }

        if (obj.connect != null) {
          writer.uint32(18)
          ConnectRequest.codec().encode(obj.connect, writer)
        }

        if (obj.streamOpen != null) {
          writer.uint32(26)
          StreamOpenRequest.codec().encode(obj.streamOpen, writer)
        }

        if (obj.streamHandler != null) {
          writer.uint32(34)
          StreamHandlerRequest.codec().encode(obj.streamHandler, writer)
        }

        if (obj.dht != null) {
          writer.uint32(42)
          DHTRequest.codec().encode(obj.dht, writer)
        }

        if (obj.connManager != null) {
          writer.uint32(50)
          ConnManagerRequest.codec().encode(obj.connManager, writer)
        }

        if (obj.disconnect != null) {
          writer.uint32(58)
          DisconnectRequest.codec().encode(obj.disconnect, writer)
        }

        if (obj.pubsub != null) {
          writer.uint32(66)
          PSRequest.codec().encode(obj.pubsub, writer)
        }

        if (obj.peerStore != null) {
          writer.uint32(74)
          PeerstoreRequest.codec().encode(obj.peerStore, writer)
        }

        if (opts.lengthDelimited !== false) {
          writer.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {}

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.type = Request.Type.codec().decode(reader)
              break
            case 2:
              obj.connect = ConnectRequest.codec().decode(reader, reader.uint32())
              break
            case 3:
              obj.streamOpen = StreamOpenRequest.codec().decode(reader, reader.uint32())
              break
            case 4:
              obj.streamHandler = StreamHandlerRequest.codec().decode(reader, reader.uint32())
              break
            case 5:
              obj.dht = DHTRequest.codec().decode(reader, reader.uint32())
              break
            case 6:
              obj.connManager = ConnManagerRequest.codec().decode(reader, reader.uint32())
              break
            case 7:
              obj.disconnect = DisconnectRequest.codec().decode(reader, reader.uint32())
              break
            case 8:
              obj.pubsub = PSRequest.codec().decode(reader, reader.uint32())
              break
            case 9:
              obj.peerStore = PeerstoreRequest.codec().decode(reader, reader.uint32())
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        if (obj.type == null) {
          throw new Error('Protocol error: value for required field "type" was not found in protobuf')
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Request): Uint8Array => {
    return encodeMessage(obj, Request.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): Request => {
    return decodeMessage(buf, Request.codec())
  }
}

export interface Response {
  type: Response.Type
  error: ErrorResponse
  streamInfo: StreamInfo
  identify: IdentifyResponse
  dht: DHTResponse
  peers: PeerInfo[]
  pubsub: PSResponse
  peerStore: PeerstoreResponse
}

export namespace Response {
  export enum Type {
    OK = 'OK',
    ERROR = 'ERROR'
  }

  enum __TypeValues {
    OK = 0,
    ERROR = 1
  }

  export namespace Type {
    export const codec = () => {
      return enumeration<Type>(__TypeValues)
    }
  }

  let _codec: Codec<Response>

  export const codec = (): Codec<Response> => {
    if (_codec == null) {
      _codec = message<Response>((obj, writer, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          writer.fork()
        }

        if (obj.type != null) {
          writer.uint32(8)
          Response.Type.codec().encode(obj.type, writer)
        } else {
          throw new Error('Protocol error: required field "type" was not found in object')
        }

        if (obj.error != null) {
          writer.uint32(18)
          ErrorResponse.codec().encode(obj.error, writer)
        }

        if (obj.streamInfo != null) {
          writer.uint32(26)
          StreamInfo.codec().encode(obj.streamInfo, writer)
        }

        if (obj.identify != null) {
          writer.uint32(34)
          IdentifyResponse.codec().encode(obj.identify, writer)
        }

        if (obj.dht != null) {
          writer.uint32(42)
          DHTResponse.codec().encode(obj.dht, writer)
        }

        if (obj.peers != null) {
          for (const value of obj.peers) {
            writer.uint32(50)
            PeerInfo.codec().encode(value, writer)
          }
        } else {
          throw new Error('Protocol error: required field "peers" was not found in object')
        }

        if (obj.pubsub != null) {
          writer.uint32(58)
          PSResponse.codec().encode(obj.pubsub, writer)
        }

        if (obj.peerStore != null) {
          writer.uint32(66)
          PeerstoreResponse.codec().encode(obj.peerStore, writer)
        }

        if (opts.lengthDelimited !== false) {
          writer.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {}

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.type = Response.Type.codec().decode(reader)
              break
            case 2:
              obj.error = ErrorResponse.codec().decode(reader, reader.uint32())
              break
            case 3:
              obj.streamInfo = StreamInfo.codec().decode(reader, reader.uint32())
              break
            case 4:
              obj.identify = IdentifyResponse.codec().decode(reader, reader.uint32())
              break
            case 5:
              obj.dht = DHTResponse.codec().decode(reader, reader.uint32())
              break
            case 6:
              obj.peers = obj.peers ?? []
              obj.peers.push(PeerInfo.codec().decode(reader, reader.uint32()))
              break
            case 7:
              obj.pubsub = PSResponse.codec().decode(reader, reader.uint32())
              break
            case 8:
              obj.peerStore = PeerstoreResponse.codec().decode(reader, reader.uint32())
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        obj.peers = obj.peers ?? []

        if (obj.type == null) {
          throw new Error('Protocol error: value for required field "type" was not found in protobuf')
        }

        if (obj.peers == null) {
          throw new Error('Protocol error: value for required field "peers" was not found in protobuf')
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Response): Uint8Array => {
    return encodeMessage(obj, Response.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): Response => {
    return decodeMessage(buf, Response.codec())
  }
}

export interface IdentifyResponse {
  id: Uint8Array
  addrs: Uint8Array[]
}

export namespace IdentifyResponse {
  let _codec: Codec<IdentifyResponse>

  export const codec = (): Codec<IdentifyResponse> => {
    if (_codec == null) {
      _codec = message<IdentifyResponse>((obj, writer, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          writer.fork()
        }

        if (obj.id != null) {
          writer.uint32(10)
          writer.bytes(obj.id)
        } else {
          throw new Error('Protocol error: required field "id" was not found in object')
        }

        if (obj.addrs != null) {
          for (const value of obj.addrs) {
            writer.uint32(18)
            writer.bytes(value)
          }
        } else {
          throw new Error('Protocol error: required field "addrs" was not found in object')
        }

        if (opts.lengthDelimited !== false) {
          writer.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {}

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.id = reader.bytes()
              break
            case 2:
              obj.addrs = obj.addrs ?? []
              obj.addrs.push(reader.bytes())
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        obj.addrs = obj.addrs ?? []

        if (obj.id == null) {
          throw new Error('Protocol error: value for required field "id" was not found in protobuf')
        }

        if (obj.addrs == null) {
          throw new Error('Protocol error: value for required field "addrs" was not found in protobuf')
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: IdentifyResponse): Uint8Array => {
    return encodeMessage(obj, IdentifyResponse.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): IdentifyResponse => {
    return decodeMessage(buf, IdentifyResponse.codec())
  }
}

export interface ConnectRequest {
  peer: Uint8Array
  addrs: Uint8Array[]
  timeout: bigint
}

export namespace ConnectRequest {
  let _codec: Codec<ConnectRequest>

  export const codec = (): Codec<ConnectRequest> => {
    return message<ConnectRequest>({
      1: { name: 'peer', codec: bytes },
      2: { name: 'addrs', codec: bytes, repeats: true },
      3: { name: 'timeout', codec: int64, optional: true }
    })
  }

  export const encode = (obj: ConnectRequest): Uint8Array => {
    return encodeMessage(obj, ConnectRequest.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): ConnectRequest => {
    return decodeMessage(buf, ConnectRequest.codec())
  }
}

export interface StreamOpenRequest {
  peer: Uint8Array
  proto: string[]
  timeout: bigint
}

export namespace StreamOpenRequest {
  let _codec: Codec<StreamOpenRequest>

  export const codec = (): Codec<StreamOpenRequest> => {
    return message<StreamOpenRequest>({
      1: { name: 'peer', codec: bytes },
      2: { name: 'proto', codec: string, repeats: true },
      3: { name: 'timeout', codec: int64, optional: true }
    })
  }

  export const encode = (obj: StreamOpenRequest): Uint8Array => {
    return encodeMessage(obj, StreamOpenRequest.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): StreamOpenRequest => {
    return decodeMessage(buf, StreamOpenRequest.codec())
  }
}

export interface StreamHandlerRequest {
  addr: Uint8Array
  proto: string[]
}

export namespace StreamHandlerRequest {
  let _codec: Codec<StreamHandlerRequest>

  export const codec = (): Codec<StreamHandlerRequest> => {
    if (_codec == null) {
      _codec = message<StreamHandlerRequest>((obj, writer, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          writer.fork()
        }

        if (obj.addr != null) {
          writer.uint32(10)
          writer.bytes(obj.addr)
        } else {
          throw new Error('Protocol error: required field "addr" was not found in object')
        }

        if (obj.proto != null) {
          for (const value of obj.proto) {
            writer.uint32(18)
            writer.string(value)
          }
        } else {
          throw new Error('Protocol error: required field "proto" was not found in object')
        }

        if (opts.lengthDelimited !== false) {
          writer.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {}

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.addr = reader.bytes()
              break
            case 2:
              obj.proto = obj.proto ?? []
              obj.proto.push(reader.string())
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        obj.proto = obj.proto ?? []

        if (obj.addr == null) {
          throw new Error('Protocol error: value for required field "addr" was not found in protobuf')
        }

        if (obj.proto == null) {
          throw new Error('Protocol error: value for required field "proto" was not found in protobuf')
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: StreamHandlerRequest): Uint8Array => {
    return encodeMessage(obj, StreamHandlerRequest.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): StreamHandlerRequest => {
    return decodeMessage(buf, StreamHandlerRequest.codec())
  }
}

export interface ErrorResponse {
  msg: string
}

export namespace ErrorResponse {
  let _codec: Codec<ErrorResponse>

  export const codec = (): Codec<ErrorResponse> => {
    if (_codec == null) {
      _codec = message<ErrorResponse>((obj, writer, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          writer.fork()
        }

        if (obj.msg != null) {
          writer.uint32(10)
          writer.string(obj.msg)
        } else {
          throw new Error('Protocol error: required field "msg" was not found in object')
        }

        if (opts.lengthDelimited !== false) {
          writer.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {}

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.msg = reader.string()
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        if (obj.msg == null) {
          throw new Error('Protocol error: value for required field "msg" was not found in protobuf')
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: ErrorResponse): Uint8Array => {
    return encodeMessage(obj, ErrorResponse.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): ErrorResponse => {
    return decodeMessage(buf, ErrorResponse.codec())
  }
}

export interface StreamInfo {
  peer: Uint8Array
  addr: Uint8Array
  proto: string
}

export namespace StreamInfo {
  let _codec: Codec<StreamInfo>

  export const codec = (): Codec<StreamInfo> => {
    return message<StreamInfo>({
      1: { name: 'peer', codec: bytes },
      2: { name: 'addr', codec: bytes },
      3: { name: 'proto', codec: string }
    })
  }

  export const encode = (obj: StreamInfo): Uint8Array => {
    return encodeMessage(obj, StreamInfo.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): StreamInfo => {
    return decodeMessage(buf, StreamInfo.codec())
  }
}

export interface DHTRequest {
  type: DHTRequest.Type
  peer: Uint8Array
  cid: Uint8Array
  key: Uint8Array
  value: Uint8Array
  count: number
  timeout: bigint
}

export namespace DHTRequest {
  export enum Type {
    FIND_PEER = 'FIND_PEER',
    FIND_PEERS_CONNECTED_TO_PEER = 'FIND_PEERS_CONNECTED_TO_PEER',
    FIND_PROVIDERS = 'FIND_PROVIDERS',
    GET_CLOSEST_PEERS = 'GET_CLOSEST_PEERS',
    GET_PUBLIC_KEY = 'GET_PUBLIC_KEY',
    GET_VALUE = 'GET_VALUE',
    SEARCH_VALUE = 'SEARCH_VALUE',
    PUT_VALUE = 'PUT_VALUE',
    PROVIDE = 'PROVIDE'
  }

  enum __TypeValues {
    FIND_PEER = 0,
    FIND_PEERS_CONNECTED_TO_PEER = 1,
    FIND_PROVIDERS = 2,
    GET_CLOSEST_PEERS = 3,
    GET_PUBLIC_KEY = 4,
    GET_VALUE = 5,
    SEARCH_VALUE = 6,
    PUT_VALUE = 7,
    PROVIDE = 8
  }

  export namespace Type {
    export const codec = () => {
      return enumeration<Type>(__TypeValues)
    }
  }

  let _codec: Codec<DHTRequest>

  export const codec = (): Codec<DHTRequest> => {
    return message<DHTRequest>({
      1: { name: 'type', codec: DHTRequest.Type.codec() },
      2: { name: 'peer', codec: bytes, optional: true },
      3: { name: 'cid', codec: bytes, optional: true },
      4: { name: 'key', codec: bytes, optional: true },
      5: { name: 'value', codec: bytes, optional: true },
      6: { name: 'count', codec: int32, optional: true },
      7: { name: 'timeout', codec: int64, optional: true }
    })
  }

  export const encode = (obj: DHTRequest): Uint8Array => {
    return encodeMessage(obj, DHTRequest.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): DHTRequest => {
    return decodeMessage(buf, DHTRequest.codec())
  }
}

export interface DHTResponse {
  type: DHTResponse.Type
  peer: PeerInfo
  value: Uint8Array
}

export namespace DHTResponse {
  export enum Type {
    BEGIN = 'BEGIN',
    VALUE = 'VALUE',
    END = 'END'
  }

  enum __TypeValues {
    BEGIN = 0,
    VALUE = 1,
    END = 2
  }

  export namespace Type {
    export const codec = () => {
      return enumeration<Type>(__TypeValues)
    }
  }

  let _codec: Codec<DHTResponse>

  export const codec = (): Codec<DHTResponse> => {
    return message<DHTResponse>({
      1: { name: 'type', codec: DHTResponse.Type.codec() },
      2: { name: 'peer', codec: PeerInfo.codec(), optional: true },
      3: { name: 'value', codec: bytes, optional: true }
    })
  }

  export const encode = (obj: DHTResponse): Uint8Array => {
    return encodeMessage(obj, DHTResponse.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): DHTResponse => {
    return decodeMessage(buf, DHTResponse.codec())
  }
}

export interface PeerInfo {
  id: Uint8Array
  addrs: Uint8Array[]
}

export namespace PeerInfo {
  let _codec: Codec<PeerInfo>

  export const codec = (): Codec<PeerInfo> => {
    if (_codec == null) {
      _codec = message<PeerInfo>((obj, writer, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          writer.fork()
        }

        if (obj.id != null) {
          writer.uint32(10)
          writer.bytes(obj.id)
        } else {
          throw new Error('Protocol error: required field "id" was not found in object')
        }

        if (obj.addrs != null) {
          for (const value of obj.addrs) {
            writer.uint32(18)
            writer.bytes(value)
          }
        } else {
          throw new Error('Protocol error: required field "addrs" was not found in object')
        }

        if (opts.lengthDelimited !== false) {
          writer.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {}

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.id = reader.bytes()
              break
            case 2:
              obj.addrs = obj.addrs ?? []
              obj.addrs.push(reader.bytes())
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        obj.addrs = obj.addrs ?? []

        if (obj.id == null) {
          throw new Error('Protocol error: value for required field "id" was not found in protobuf')
        }

        if (obj.addrs == null) {
          throw new Error('Protocol error: value for required field "addrs" was not found in protobuf')
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: PeerInfo): Uint8Array => {
    return encodeMessage(obj, PeerInfo.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): PeerInfo => {
    return decodeMessage(buf, PeerInfo.codec())
  }
}

export interface ConnManagerRequest {
  type: ConnManagerRequest.Type
  peer: Uint8Array
  tag: string
  weight: bigint
}

export namespace ConnManagerRequest {
  export enum Type {
    TAG_PEER = 'TAG_PEER',
    UNTAG_PEER = 'UNTAG_PEER',
    TRIM = 'TRIM'
  }

  enum __TypeValues {
    TAG_PEER = 0,
    UNTAG_PEER = 1,
    TRIM = 2
  }

  export namespace Type {
    export const codec = () => {
      return enumeration<Type>(__TypeValues)
    }
  }

  let _codec: Codec<ConnManagerRequest>

  export const codec = (): Codec<ConnManagerRequest> => {
    return message<ConnManagerRequest>({
      1: { name: 'type', codec: ConnManagerRequest.Type.codec() },
      2: { name: 'peer', codec: bytes, optional: true },
      3: { name: 'tag', codec: string, optional: true },
      4: { name: 'weight', codec: int64, optional: true }
    })
  }

  export const encode = (obj: ConnManagerRequest): Uint8Array => {
    return encodeMessage(obj, ConnManagerRequest.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): ConnManagerRequest => {
    return decodeMessage(buf, ConnManagerRequest.codec())
  }
}

export interface DisconnectRequest {
  peer: Uint8Array
}

export namespace DisconnectRequest {
  let _codec: Codec<DisconnectRequest>

  export const codec = (): Codec<DisconnectRequest> => {
    if (_codec == null) {
      _codec = message<DisconnectRequest>((obj, writer, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          writer.fork()
        }

        if (obj.peer != null) {
          writer.uint32(10)
          writer.bytes(obj.peer)
        } else {
          throw new Error('Protocol error: required field "peer" was not found in object')
        }

        if (opts.lengthDelimited !== false) {
          writer.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {}

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.peer = reader.bytes()
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        if (obj.peer == null) {
          throw new Error('Protocol error: value for required field "peer" was not found in protobuf')
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: DisconnectRequest): Uint8Array => {
    return encodeMessage(obj, DisconnectRequest.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): DisconnectRequest => {
    return decodeMessage(buf, DisconnectRequest.codec())
  }
}

export interface PSRequest {
  type: PSRequest.Type
  topic: string
  data: Uint8Array
}

export namespace PSRequest {
  export enum Type {
    GET_TOPICS = 'GET_TOPICS',
    LIST_PEERS = 'LIST_PEERS',
    PUBLISH = 'PUBLISH',
    SUBSCRIBE = 'SUBSCRIBE'
  }

  enum __TypeValues {
    GET_TOPICS = 0,
    LIST_PEERS = 1,
    PUBLISH = 2,
    SUBSCRIBE = 3
  }

  export namespace Type {
    export const codec = () => {
      return enumeration<Type>(__TypeValues)
    }
  }

  let _codec: Codec<PSRequest>

  export const codec = (): Codec<PSRequest> => {
    return message<PSRequest>({
      1: { name: 'type', codec: PSRequest.Type.codec() },
      2: { name: 'topic', codec: string, optional: true },
      3: { name: 'data', codec: bytes, optional: true }
    })
  }

  export const encode = (obj: PSRequest): Uint8Array => {
    return encodeMessage(obj, PSRequest.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): PSRequest => {
    return decodeMessage(buf, PSRequest.codec())
  }
}

export interface PSMessage {
  from: Uint8Array
  data: Uint8Array
  seqno: Uint8Array
  topicIDs: string[]
  signature: Uint8Array
  key: Uint8Array
}

export namespace PSMessage {
  let _codec: Codec<PSMessage>

  export const codec = (): Codec<PSMessage> => {
    return message<PSMessage>({
      1: { name: 'from', codec: bytes, optional: true },
      2: { name: 'data', codec: bytes, optional: true },
      3: { name: 'seqno', codec: bytes, optional: true },
      4: { name: 'topicIDs', codec: string, repeats: true },
      5: { name: 'signature', codec: bytes, optional: true },
      6: { name: 'key', codec: bytes, optional: true }
    })
  }

  export const encode = (obj: PSMessage): Uint8Array => {
    return encodeMessage(obj, PSMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): PSMessage => {
    return decodeMessage(buf, PSMessage.codec())
  }
}

export interface PSResponse {
  topics: string[]
  peerIDs: Uint8Array[]
}

export namespace PSResponse {
  let _codec: Codec<PSResponse>

  export const codec = (): Codec<PSResponse> => {
    if (_codec == null) {
      _codec = message<PSResponse>((obj, writer, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          writer.fork()
        }

        if (obj.topics != null) {
          for (const value of obj.topics) {
            writer.uint32(10)
            writer.string(value)
          }
        } else {
          throw new Error('Protocol error: required field "topics" was not found in object')
        }

        if (obj.peerIDs != null) {
          for (const value of obj.peerIDs) {
            writer.uint32(18)
            writer.bytes(value)
          }
        } else {
          throw new Error('Protocol error: required field "peerIDs" was not found in object')
        }

        if (opts.lengthDelimited !== false) {
          writer.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {}

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.topics = obj.topics ?? []
              obj.topics.push(reader.string())
              break
            case 2:
              obj.peerIDs = obj.peerIDs ?? []
              obj.peerIDs.push(reader.bytes())
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        obj.topics = obj.topics ?? []
        obj.peerIDs = obj.peerIDs ?? []

        if (obj.topics == null) {
          throw new Error('Protocol error: value for required field "topics" was not found in protobuf')
        }

        if (obj.peerIDs == null) {
          throw new Error('Protocol error: value for required field "peerIDs" was not found in protobuf')
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: PSResponse): Uint8Array => {
    return encodeMessage(obj, PSResponse.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): PSResponse => {
    return decodeMessage(buf, PSResponse.codec())
  }
}

export interface PeerstoreRequest {
  type: PeerstoreRequest.Type
  id: Uint8Array
  protos: string[]
}

export namespace PeerstoreRequest {
  export enum Type {
    GET_PROTOCOLS = 'GET_PROTOCOLS',
    GET_PEER_INFO = 'GET_PEER_INFO'
  }

  enum __TypeValues {
    GET_PROTOCOLS = 1,
    GET_PEER_INFO = 2
  }

  export namespace Type {
    export const codec = () => {
      return enumeration<Type>(__TypeValues)
    }
  }

  let _codec: Codec<PeerstoreRequest>

  export const codec = (): Codec<PeerstoreRequest> => {
    return message<PeerstoreRequest>({
      1: { name: 'type', codec: PeerstoreRequest.Type.codec() },
      2: { name: 'id', codec: bytes, optional: true },
      3: { name: 'protos', codec: string, repeats: true }
    })
  }

  export const encode = (obj: PeerstoreRequest): Uint8Array => {
    return encodeMessage(obj, PeerstoreRequest.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): PeerstoreRequest => {
    return decodeMessage(buf, PeerstoreRequest.codec())
  }
}

export interface PeerstoreResponse {
  peer: PeerInfo
  protos: string[]
}

export namespace PeerstoreResponse {
  let _codec: Codec<PeerstoreResponse>

  export const codec = (): Codec<PeerstoreResponse> => {
    return message<PeerstoreResponse>({
      1: { name: 'peer', codec: PeerInfo.codec(), optional: true },
      2: { name: 'protos', codec: string, repeats: true }
    })
  }

  export const encode = (obj: PeerstoreResponse): Uint8Array => {
    return encodeMessage(obj, PeerstoreResponse.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): PeerstoreResponse => {
    return decodeMessage(buf, PeerstoreResponse.codec())
  }
}
