import * as $protobuf from "protobufjs";
/** Properties of a Request. */
export interface IRequest {

    /** Request type */
    type: Request.Type;

    /** Request connect */
    connect?: (IConnectRequest|null);

    /** Request streamOpen */
    streamOpen?: (IStreamOpenRequest|null);

    /** Request streamHandler */
    streamHandler?: (IStreamHandlerRequest|null);

    /** Request dht */
    dht?: (IDHTRequest|null);

    /** Request connManager */
    connManager?: (IConnManagerRequest|null);

    /** Request disconnect */
    disconnect?: (IDisconnectRequest|null);

    /** Request pubsub */
    pubsub?: (IPSRequest|null);

    /** Request peerStore */
    peerStore?: (IPeerstoreRequest|null);
}

/** Represents a Request. */
export class Request implements IRequest {

    /**
     * Constructs a new Request.
     * @param [p] Properties to set
     */
    constructor(p?: IRequest);

    /** Request type. */
    public type: Request.Type;

    /** Request connect. */
    public connect?: (IConnectRequest|null);

    /** Request streamOpen. */
    public streamOpen?: (IStreamOpenRequest|null);

    /** Request streamHandler. */
    public streamHandler?: (IStreamHandlerRequest|null);

    /** Request dht. */
    public dht?: (IDHTRequest|null);

    /** Request connManager. */
    public connManager?: (IConnManagerRequest|null);

    /** Request disconnect. */
    public disconnect?: (IDisconnectRequest|null);

    /** Request pubsub. */
    public pubsub?: (IPSRequest|null);

    /** Request peerStore. */
    public peerStore?: (IPeerstoreRequest|null);

    /**
     * Encodes the specified Request message. Does not implicitly {@link Request.verify|verify} messages.
     * @param m Request message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IRequest, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Request message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns Request
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): Request;

    /**
     * Creates a Request message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns Request
     */
    public static fromObject(d: { [k: string]: any }): Request;

    /**
     * Creates a plain object from a Request message. Also converts values to other types if specified.
     * @param m Request
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: Request, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Request to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace Request {

    /** Type enum. */
    enum Type {
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
}

/** Properties of a Response. */
export interface IResponse {

    /** Response type */
    type: Response.Type;

    /** Response error */
    error?: (IErrorResponse|null);

    /** Response streamInfo */
    streamInfo?: (IStreamInfo|null);

    /** Response identify */
    identify?: (IIdentifyResponse|null);

    /** Response dht */
    dht?: (IDHTResponse|null);

    /** Response peers */
    peers?: (IPeerInfo[]|null);

    /** Response pubsub */
    pubsub?: (IPSResponse|null);

    /** Response peerStore */
    peerStore?: (IPeerstoreResponse|null);
}

/** Represents a Response. */
export class Response implements IResponse {

    /**
     * Constructs a new Response.
     * @param [p] Properties to set
     */
    constructor(p?: IResponse);

    /** Response type. */
    public type: Response.Type;

    /** Response error. */
    public error?: (IErrorResponse|null);

    /** Response streamInfo. */
    public streamInfo?: (IStreamInfo|null);

    /** Response identify. */
    public identify?: (IIdentifyResponse|null);

    /** Response dht. */
    public dht?: (IDHTResponse|null);

    /** Response peers. */
    public peers: IPeerInfo[];

    /** Response pubsub. */
    public pubsub?: (IPSResponse|null);

    /** Response peerStore. */
    public peerStore?: (IPeerstoreResponse|null);

    /**
     * Encodes the specified Response message. Does not implicitly {@link Response.verify|verify} messages.
     * @param m Response message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IResponse, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Response message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns Response
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): Response;

    /**
     * Creates a Response message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns Response
     */
    public static fromObject(d: { [k: string]: any }): Response;

    /**
     * Creates a plain object from a Response message. Also converts values to other types if specified.
     * @param m Response
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: Response, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Response to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace Response {

    /** Type enum. */
    enum Type {
        OK = 0,
        ERROR = 1
    }
}

/** Properties of an IdentifyResponse. */
export interface IIdentifyResponse {

    /** IdentifyResponse id */
    id: Uint8Array;

    /** IdentifyResponse addrs */
    addrs?: (Uint8Array[]|null);
}

/** Represents an IdentifyResponse. */
export class IdentifyResponse implements IIdentifyResponse {

    /**
     * Constructs a new IdentifyResponse.
     * @param [p] Properties to set
     */
    constructor(p?: IIdentifyResponse);

    /** IdentifyResponse id. */
    public id: Uint8Array;

    /** IdentifyResponse addrs. */
    public addrs: Uint8Array[];

    /**
     * Encodes the specified IdentifyResponse message. Does not implicitly {@link IdentifyResponse.verify|verify} messages.
     * @param m IdentifyResponse message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IIdentifyResponse, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an IdentifyResponse message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns IdentifyResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): IdentifyResponse;

    /**
     * Creates an IdentifyResponse message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns IdentifyResponse
     */
    public static fromObject(d: { [k: string]: any }): IdentifyResponse;

    /**
     * Creates a plain object from an IdentifyResponse message. Also converts values to other types if specified.
     * @param m IdentifyResponse
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: IdentifyResponse, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this IdentifyResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ConnectRequest. */
export interface IConnectRequest {

    /** ConnectRequest peer */
    peer: Uint8Array;

    /** ConnectRequest addrs */
    addrs?: (Uint8Array[]|null);

    /** ConnectRequest timeout */
    timeout?: (number|null);
}

/** Represents a ConnectRequest. */
export class ConnectRequest implements IConnectRequest {

    /**
     * Constructs a new ConnectRequest.
     * @param [p] Properties to set
     */
    constructor(p?: IConnectRequest);

    /** ConnectRequest peer. */
    public peer: Uint8Array;

    /** ConnectRequest addrs. */
    public addrs: Uint8Array[];

    /** ConnectRequest timeout. */
    public timeout: number;

    /**
     * Encodes the specified ConnectRequest message. Does not implicitly {@link ConnectRequest.verify|verify} messages.
     * @param m ConnectRequest message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IConnectRequest, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ConnectRequest message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns ConnectRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): ConnectRequest;

    /**
     * Creates a ConnectRequest message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns ConnectRequest
     */
    public static fromObject(d: { [k: string]: any }): ConnectRequest;

    /**
     * Creates a plain object from a ConnectRequest message. Also converts values to other types if specified.
     * @param m ConnectRequest
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: ConnectRequest, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ConnectRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a StreamOpenRequest. */
export interface IStreamOpenRequest {

    /** StreamOpenRequest peer */
    peer: Uint8Array;

    /** StreamOpenRequest proto */
    proto?: (string[]|null);

    /** StreamOpenRequest timeout */
    timeout?: (number|null);
}

/** Represents a StreamOpenRequest. */
export class StreamOpenRequest implements IStreamOpenRequest {

    /**
     * Constructs a new StreamOpenRequest.
     * @param [p] Properties to set
     */
    constructor(p?: IStreamOpenRequest);

    /** StreamOpenRequest peer. */
    public peer: Uint8Array;

    /** StreamOpenRequest proto. */
    public proto: string[];

    /** StreamOpenRequest timeout. */
    public timeout: number;

    /**
     * Encodes the specified StreamOpenRequest message. Does not implicitly {@link StreamOpenRequest.verify|verify} messages.
     * @param m StreamOpenRequest message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IStreamOpenRequest, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a StreamOpenRequest message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns StreamOpenRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): StreamOpenRequest;

    /**
     * Creates a StreamOpenRequest message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns StreamOpenRequest
     */
    public static fromObject(d: { [k: string]: any }): StreamOpenRequest;

    /**
     * Creates a plain object from a StreamOpenRequest message. Also converts values to other types if specified.
     * @param m StreamOpenRequest
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: StreamOpenRequest, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this StreamOpenRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a StreamHandlerRequest. */
export interface IStreamHandlerRequest {

    /** StreamHandlerRequest addr */
    addr: Uint8Array;

    /** StreamHandlerRequest proto */
    proto?: (string[]|null);
}

/** Represents a StreamHandlerRequest. */
export class StreamHandlerRequest implements IStreamHandlerRequest {

    /**
     * Constructs a new StreamHandlerRequest.
     * @param [p] Properties to set
     */
    constructor(p?: IStreamHandlerRequest);

    /** StreamHandlerRequest addr. */
    public addr: Uint8Array;

    /** StreamHandlerRequest proto. */
    public proto: string[];

    /**
     * Encodes the specified StreamHandlerRequest message. Does not implicitly {@link StreamHandlerRequest.verify|verify} messages.
     * @param m StreamHandlerRequest message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IStreamHandlerRequest, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a StreamHandlerRequest message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns StreamHandlerRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): StreamHandlerRequest;

    /**
     * Creates a StreamHandlerRequest message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns StreamHandlerRequest
     */
    public static fromObject(d: { [k: string]: any }): StreamHandlerRequest;

    /**
     * Creates a plain object from a StreamHandlerRequest message. Also converts values to other types if specified.
     * @param m StreamHandlerRequest
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: StreamHandlerRequest, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this StreamHandlerRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an ErrorResponse. */
export interface IErrorResponse {

    /** ErrorResponse msg */
    msg: string;
}

/** Represents an ErrorResponse. */
export class ErrorResponse implements IErrorResponse {

    /**
     * Constructs a new ErrorResponse.
     * @param [p] Properties to set
     */
    constructor(p?: IErrorResponse);

    /** ErrorResponse msg. */
    public msg: string;

    /**
     * Encodes the specified ErrorResponse message. Does not implicitly {@link ErrorResponse.verify|verify} messages.
     * @param m ErrorResponse message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IErrorResponse, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an ErrorResponse message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns ErrorResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): ErrorResponse;

    /**
     * Creates an ErrorResponse message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns ErrorResponse
     */
    public static fromObject(d: { [k: string]: any }): ErrorResponse;

    /**
     * Creates a plain object from an ErrorResponse message. Also converts values to other types if specified.
     * @param m ErrorResponse
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: ErrorResponse, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ErrorResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a StreamInfo. */
export interface IStreamInfo {

    /** StreamInfo peer */
    peer: Uint8Array;

    /** StreamInfo addr */
    addr: Uint8Array;

    /** StreamInfo proto */
    proto: string;
}

/** Represents a StreamInfo. */
export class StreamInfo implements IStreamInfo {

    /**
     * Constructs a new StreamInfo.
     * @param [p] Properties to set
     */
    constructor(p?: IStreamInfo);

    /** StreamInfo peer. */
    public peer: Uint8Array;

    /** StreamInfo addr. */
    public addr: Uint8Array;

    /** StreamInfo proto. */
    public proto: string;

    /**
     * Encodes the specified StreamInfo message. Does not implicitly {@link StreamInfo.verify|verify} messages.
     * @param m StreamInfo message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IStreamInfo, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a StreamInfo message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns StreamInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): StreamInfo;

    /**
     * Creates a StreamInfo message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns StreamInfo
     */
    public static fromObject(d: { [k: string]: any }): StreamInfo;

    /**
     * Creates a plain object from a StreamInfo message. Also converts values to other types if specified.
     * @param m StreamInfo
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: StreamInfo, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this StreamInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a DHTRequest. */
export interface IDHTRequest {

    /** DHTRequest type */
    type: DHTRequest.Type;

    /** DHTRequest peer */
    peer?: (Uint8Array|null);

    /** DHTRequest cid */
    cid?: (Uint8Array|null);

    /** DHTRequest key */
    key?: (Uint8Array|null);

    /** DHTRequest value */
    value?: (Uint8Array|null);

    /** DHTRequest count */
    count?: (number|null);

    /** DHTRequest timeout */
    timeout?: (number|null);
}

/** Represents a DHTRequest. */
export class DHTRequest implements IDHTRequest {

    /**
     * Constructs a new DHTRequest.
     * @param [p] Properties to set
     */
    constructor(p?: IDHTRequest);

    /** DHTRequest type. */
    public type: DHTRequest.Type;

    /** DHTRequest peer. */
    public peer: Uint8Array;

    /** DHTRequest cid. */
    public cid: Uint8Array;

    /** DHTRequest key. */
    public key: Uint8Array;

    /** DHTRequest value. */
    public value: Uint8Array;

    /** DHTRequest count. */
    public count: number;

    /** DHTRequest timeout. */
    public timeout: number;

    /**
     * Encodes the specified DHTRequest message. Does not implicitly {@link DHTRequest.verify|verify} messages.
     * @param m DHTRequest message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IDHTRequest, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DHTRequest message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns DHTRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): DHTRequest;

    /**
     * Creates a DHTRequest message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns DHTRequest
     */
    public static fromObject(d: { [k: string]: any }): DHTRequest;

    /**
     * Creates a plain object from a DHTRequest message. Also converts values to other types if specified.
     * @param m DHTRequest
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: DHTRequest, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DHTRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace DHTRequest {

    /** Type enum. */
    enum Type {
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
}

/** Properties of a DHTResponse. */
export interface IDHTResponse {

    /** DHTResponse type */
    type: DHTResponse.Type;

    /** DHTResponse peer */
    peer?: (IPeerInfo|null);

    /** DHTResponse value */
    value?: (Uint8Array|null);
}

/** Represents a DHTResponse. */
export class DHTResponse implements IDHTResponse {

    /**
     * Constructs a new DHTResponse.
     * @param [p] Properties to set
     */
    constructor(p?: IDHTResponse);

    /** DHTResponse type. */
    public type: DHTResponse.Type;

    /** DHTResponse peer. */
    public peer?: (IPeerInfo|null);

    /** DHTResponse value. */
    public value: Uint8Array;

    /**
     * Encodes the specified DHTResponse message. Does not implicitly {@link DHTResponse.verify|verify} messages.
     * @param m DHTResponse message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IDHTResponse, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DHTResponse message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns DHTResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): DHTResponse;

    /**
     * Creates a DHTResponse message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns DHTResponse
     */
    public static fromObject(d: { [k: string]: any }): DHTResponse;

    /**
     * Creates a plain object from a DHTResponse message. Also converts values to other types if specified.
     * @param m DHTResponse
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: DHTResponse, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DHTResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace DHTResponse {

    /** Type enum. */
    enum Type {
        BEGIN = 0,
        VALUE = 1,
        END = 2
    }
}

/** Properties of a PeerInfo. */
export interface IPeerInfo {

    /** PeerInfo id */
    id: Uint8Array;

    /** PeerInfo addrs */
    addrs?: (Uint8Array[]|null);
}

/** Represents a PeerInfo. */
export class PeerInfo implements IPeerInfo {

    /**
     * Constructs a new PeerInfo.
     * @param [p] Properties to set
     */
    constructor(p?: IPeerInfo);

    /** PeerInfo id. */
    public id: Uint8Array;

    /** PeerInfo addrs. */
    public addrs: Uint8Array[];

    /**
     * Encodes the specified PeerInfo message. Does not implicitly {@link PeerInfo.verify|verify} messages.
     * @param m PeerInfo message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IPeerInfo, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PeerInfo message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns PeerInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): PeerInfo;

    /**
     * Creates a PeerInfo message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns PeerInfo
     */
    public static fromObject(d: { [k: string]: any }): PeerInfo;

    /**
     * Creates a plain object from a PeerInfo message. Also converts values to other types if specified.
     * @param m PeerInfo
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: PeerInfo, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PeerInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ConnManagerRequest. */
export interface IConnManagerRequest {

    /** ConnManagerRequest type */
    type: ConnManagerRequest.Type;

    /** ConnManagerRequest peer */
    peer?: (Uint8Array|null);

    /** ConnManagerRequest tag */
    tag?: (string|null);

    /** ConnManagerRequest weight */
    weight?: (number|null);
}

/** Represents a ConnManagerRequest. */
export class ConnManagerRequest implements IConnManagerRequest {

    /**
     * Constructs a new ConnManagerRequest.
     * @param [p] Properties to set
     */
    constructor(p?: IConnManagerRequest);

    /** ConnManagerRequest type. */
    public type: ConnManagerRequest.Type;

    /** ConnManagerRequest peer. */
    public peer: Uint8Array;

    /** ConnManagerRequest tag. */
    public tag: string;

    /** ConnManagerRequest weight. */
    public weight: number;

    /**
     * Encodes the specified ConnManagerRequest message. Does not implicitly {@link ConnManagerRequest.verify|verify} messages.
     * @param m ConnManagerRequest message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IConnManagerRequest, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ConnManagerRequest message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns ConnManagerRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): ConnManagerRequest;

    /**
     * Creates a ConnManagerRequest message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns ConnManagerRequest
     */
    public static fromObject(d: { [k: string]: any }): ConnManagerRequest;

    /**
     * Creates a plain object from a ConnManagerRequest message. Also converts values to other types if specified.
     * @param m ConnManagerRequest
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: ConnManagerRequest, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ConnManagerRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace ConnManagerRequest {

    /** Type enum. */
    enum Type {
        TAG_PEER = 0,
        UNTAG_PEER = 1,
        TRIM = 2
    }
}

/** Properties of a DisconnectRequest. */
export interface IDisconnectRequest {

    /** DisconnectRequest peer */
    peer: Uint8Array;
}

/** Represents a DisconnectRequest. */
export class DisconnectRequest implements IDisconnectRequest {

    /**
     * Constructs a new DisconnectRequest.
     * @param [p] Properties to set
     */
    constructor(p?: IDisconnectRequest);

    /** DisconnectRequest peer. */
    public peer: Uint8Array;

    /**
     * Encodes the specified DisconnectRequest message. Does not implicitly {@link DisconnectRequest.verify|verify} messages.
     * @param m DisconnectRequest message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IDisconnectRequest, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a DisconnectRequest message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns DisconnectRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): DisconnectRequest;

    /**
     * Creates a DisconnectRequest message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns DisconnectRequest
     */
    public static fromObject(d: { [k: string]: any }): DisconnectRequest;

    /**
     * Creates a plain object from a DisconnectRequest message. Also converts values to other types if specified.
     * @param m DisconnectRequest
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: DisconnectRequest, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DisconnectRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PSRequest. */
export interface IPSRequest {

    /** PSRequest type */
    type: PSRequest.Type;

    /** PSRequest topic */
    topic?: (string|null);

    /** PSRequest data */
    data?: (Uint8Array|null);
}

/** Represents a PSRequest. */
export class PSRequest implements IPSRequest {

    /**
     * Constructs a new PSRequest.
     * @param [p] Properties to set
     */
    constructor(p?: IPSRequest);

    /** PSRequest type. */
    public type: PSRequest.Type;

    /** PSRequest topic. */
    public topic: string;

    /** PSRequest data. */
    public data: Uint8Array;

    /**
     * Encodes the specified PSRequest message. Does not implicitly {@link PSRequest.verify|verify} messages.
     * @param m PSRequest message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IPSRequest, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PSRequest message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns PSRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): PSRequest;

    /**
     * Creates a PSRequest message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns PSRequest
     */
    public static fromObject(d: { [k: string]: any }): PSRequest;

    /**
     * Creates a plain object from a PSRequest message. Also converts values to other types if specified.
     * @param m PSRequest
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: PSRequest, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PSRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace PSRequest {

    /** Type enum. */
    enum Type {
        GET_TOPICS = 0,
        LIST_PEERS = 1,
        PUBLISH = 2,
        SUBSCRIBE = 3
    }
}

/** Properties of a PSMessage. */
export interface IPSMessage {

    /** PSMessage from */
    from?: (Uint8Array|null);

    /** PSMessage data */
    data?: (Uint8Array|null);

    /** PSMessage seqno */
    seqno?: (Uint8Array|null);

    /** PSMessage topicIDs */
    topicIDs?: (string[]|null);

    /** PSMessage signature */
    signature?: (Uint8Array|null);

    /** PSMessage key */
    key?: (Uint8Array|null);
}

/** Represents a PSMessage. */
export class PSMessage implements IPSMessage {

    /**
     * Constructs a new PSMessage.
     * @param [p] Properties to set
     */
    constructor(p?: IPSMessage);

    /** PSMessage from. */
    public from: Uint8Array;

    /** PSMessage data. */
    public data: Uint8Array;

    /** PSMessage seqno. */
    public seqno: Uint8Array;

    /** PSMessage topicIDs. */
    public topicIDs: string[];

    /** PSMessage signature. */
    public signature: Uint8Array;

    /** PSMessage key. */
    public key: Uint8Array;

    /**
     * Encodes the specified PSMessage message. Does not implicitly {@link PSMessage.verify|verify} messages.
     * @param m PSMessage message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IPSMessage, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PSMessage message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns PSMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): PSMessage;

    /**
     * Creates a PSMessage message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns PSMessage
     */
    public static fromObject(d: { [k: string]: any }): PSMessage;

    /**
     * Creates a plain object from a PSMessage message. Also converts values to other types if specified.
     * @param m PSMessage
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: PSMessage, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PSMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PSResponse. */
export interface IPSResponse {

    /** PSResponse topics */
    topics?: (string[]|null);

    /** PSResponse peerIDs */
    peerIDs?: (Uint8Array[]|null);
}

/** Represents a PSResponse. */
export class PSResponse implements IPSResponse {

    /**
     * Constructs a new PSResponse.
     * @param [p] Properties to set
     */
    constructor(p?: IPSResponse);

    /** PSResponse topics. */
    public topics: string[];

    /** PSResponse peerIDs. */
    public peerIDs: Uint8Array[];

    /**
     * Encodes the specified PSResponse message. Does not implicitly {@link PSResponse.verify|verify} messages.
     * @param m PSResponse message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IPSResponse, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PSResponse message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns PSResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): PSResponse;

    /**
     * Creates a PSResponse message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns PSResponse
     */
    public static fromObject(d: { [k: string]: any }): PSResponse;

    /**
     * Creates a plain object from a PSResponse message. Also converts values to other types if specified.
     * @param m PSResponse
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: PSResponse, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PSResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PeerstoreRequest. */
export interface IPeerstoreRequest {

    /** PeerstoreRequest type */
    type: PeerstoreRequest.Type;

    /** PeerstoreRequest id */
    id?: (Uint8Array|null);

    /** PeerstoreRequest protos */
    protos?: (string[]|null);
}

/** Represents a PeerstoreRequest. */
export class PeerstoreRequest implements IPeerstoreRequest {

    /**
     * Constructs a new PeerstoreRequest.
     * @param [p] Properties to set
     */
    constructor(p?: IPeerstoreRequest);

    /** PeerstoreRequest type. */
    public type: PeerstoreRequest.Type;

    /** PeerstoreRequest id. */
    public id: Uint8Array;

    /** PeerstoreRequest protos. */
    public protos: string[];

    /**
     * Encodes the specified PeerstoreRequest message. Does not implicitly {@link PeerstoreRequest.verify|verify} messages.
     * @param m PeerstoreRequest message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IPeerstoreRequest, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PeerstoreRequest message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns PeerstoreRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): PeerstoreRequest;

    /**
     * Creates a PeerstoreRequest message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns PeerstoreRequest
     */
    public static fromObject(d: { [k: string]: any }): PeerstoreRequest;

    /**
     * Creates a plain object from a PeerstoreRequest message. Also converts values to other types if specified.
     * @param m PeerstoreRequest
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: PeerstoreRequest, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PeerstoreRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace PeerstoreRequest {

    /** Type enum. */
    enum Type {
        GET_PROTOCOLS = 1,
        GET_PEER_INFO = 2
    }
}

/** Properties of a PeerstoreResponse. */
export interface IPeerstoreResponse {

    /** PeerstoreResponse peer */
    peer?: (IPeerInfo|null);

    /** PeerstoreResponse protos */
    protos?: (string[]|null);
}

/** Represents a PeerstoreResponse. */
export class PeerstoreResponse implements IPeerstoreResponse {

    /**
     * Constructs a new PeerstoreResponse.
     * @param [p] Properties to set
     */
    constructor(p?: IPeerstoreResponse);

    /** PeerstoreResponse peer. */
    public peer?: (IPeerInfo|null);

    /** PeerstoreResponse protos. */
    public protos: string[];

    /**
     * Encodes the specified PeerstoreResponse message. Does not implicitly {@link PeerstoreResponse.verify|verify} messages.
     * @param m PeerstoreResponse message or plain object to encode
     * @param [w] Writer to encode to
     * @returns Writer
     */
    public static encode(m: IPeerstoreResponse, w?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PeerstoreResponse message from the specified reader or buffer.
     * @param r Reader or buffer to decode from
     * @param [l] Message length if known beforehand
     * @returns PeerstoreResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): PeerstoreResponse;

    /**
     * Creates a PeerstoreResponse message from a plain object. Also converts values to their respective internal types.
     * @param d Plain object
     * @returns PeerstoreResponse
     */
    public static fromObject(d: { [k: string]: any }): PeerstoreResponse;

    /**
     * Creates a plain object from a PeerstoreResponse message. Also converts values to other types if specified.
     * @param m PeerstoreResponse
     * @param [o] Conversion options
     * @returns Plain object
     */
    public static toObject(m: PeerstoreResponse, o?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PeerstoreResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
