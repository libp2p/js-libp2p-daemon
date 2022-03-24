/*eslint-disable*/
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["libp2p-daemon"] || ($protobuf.roots["libp2p-daemon"] = {});

export const Request = $root.Request = (() => {

    /**
     * Properties of a Request.
     * @exports IRequest
     * @interface IRequest
     * @property {Request.Type} type Request type
     * @property {IConnectRequest|null} [connect] Request connect
     * @property {IStreamOpenRequest|null} [streamOpen] Request streamOpen
     * @property {IStreamHandlerRequest|null} [streamHandler] Request streamHandler
     * @property {IDHTRequest|null} [dht] Request dht
     * @property {IConnManagerRequest|null} [connManager] Request connManager
     * @property {IDisconnectRequest|null} [disconnect] Request disconnect
     * @property {IPSRequest|null} [pubsub] Request pubsub
     * @property {IPeerstoreRequest|null} [peerStore] Request peerStore
     */

    /**
     * Constructs a new Request.
     * @exports Request
     * @classdesc Represents a Request.
     * @implements IRequest
     * @constructor
     * @param {IRequest=} [p] Properties to set
     */
    function Request(p) {
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * Request type.
     * @member {Request.Type} type
     * @memberof Request
     * @instance
     */
    Request.prototype.type = 0;

    /**
     * Request connect.
     * @member {IConnectRequest|null|undefined} connect
     * @memberof Request
     * @instance
     */
    Request.prototype.connect = null;

    /**
     * Request streamOpen.
     * @member {IStreamOpenRequest|null|undefined} streamOpen
     * @memberof Request
     * @instance
     */
    Request.prototype.streamOpen = null;

    /**
     * Request streamHandler.
     * @member {IStreamHandlerRequest|null|undefined} streamHandler
     * @memberof Request
     * @instance
     */
    Request.prototype.streamHandler = null;

    /**
     * Request dht.
     * @member {IDHTRequest|null|undefined} dht
     * @memberof Request
     * @instance
     */
    Request.prototype.dht = null;

    /**
     * Request connManager.
     * @member {IConnManagerRequest|null|undefined} connManager
     * @memberof Request
     * @instance
     */
    Request.prototype.connManager = null;

    /**
     * Request disconnect.
     * @member {IDisconnectRequest|null|undefined} disconnect
     * @memberof Request
     * @instance
     */
    Request.prototype.disconnect = null;

    /**
     * Request pubsub.
     * @member {IPSRequest|null|undefined} pubsub
     * @memberof Request
     * @instance
     */
    Request.prototype.pubsub = null;

    /**
     * Request peerStore.
     * @member {IPeerstoreRequest|null|undefined} peerStore
     * @memberof Request
     * @instance
     */
    Request.prototype.peerStore = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * Request _connect.
     * @member {"connect"|undefined} _connect
     * @memberof Request
     * @instance
     */
    Object.defineProperty(Request.prototype, "_connect", {
        get: $util.oneOfGetter($oneOfFields = ["connect"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Request _streamOpen.
     * @member {"streamOpen"|undefined} _streamOpen
     * @memberof Request
     * @instance
     */
    Object.defineProperty(Request.prototype, "_streamOpen", {
        get: $util.oneOfGetter($oneOfFields = ["streamOpen"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Request _streamHandler.
     * @member {"streamHandler"|undefined} _streamHandler
     * @memberof Request
     * @instance
     */
    Object.defineProperty(Request.prototype, "_streamHandler", {
        get: $util.oneOfGetter($oneOfFields = ["streamHandler"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Request _dht.
     * @member {"dht"|undefined} _dht
     * @memberof Request
     * @instance
     */
    Object.defineProperty(Request.prototype, "_dht", {
        get: $util.oneOfGetter($oneOfFields = ["dht"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Request _connManager.
     * @member {"connManager"|undefined} _connManager
     * @memberof Request
     * @instance
     */
    Object.defineProperty(Request.prototype, "_connManager", {
        get: $util.oneOfGetter($oneOfFields = ["connManager"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Request _disconnect.
     * @member {"disconnect"|undefined} _disconnect
     * @memberof Request
     * @instance
     */
    Object.defineProperty(Request.prototype, "_disconnect", {
        get: $util.oneOfGetter($oneOfFields = ["disconnect"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Request _pubsub.
     * @member {"pubsub"|undefined} _pubsub
     * @memberof Request
     * @instance
     */
    Object.defineProperty(Request.prototype, "_pubsub", {
        get: $util.oneOfGetter($oneOfFields = ["pubsub"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Request _peerStore.
     * @member {"peerStore"|undefined} _peerStore
     * @memberof Request
     * @instance
     */
    Object.defineProperty(Request.prototype, "_peerStore", {
        get: $util.oneOfGetter($oneOfFields = ["peerStore"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Encodes the specified Request message. Does not implicitly {@link Request.verify|verify} messages.
     * @function encode
     * @memberof Request
     * @static
     * @param {IRequest} m Request message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Request.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(8).int32(m.type);
        if (m.connect != null && Object.hasOwnProperty.call(m, "connect"))
            $root.ConnectRequest.encode(m.connect, w.uint32(18).fork()).ldelim();
        if (m.streamOpen != null && Object.hasOwnProperty.call(m, "streamOpen"))
            $root.StreamOpenRequest.encode(m.streamOpen, w.uint32(26).fork()).ldelim();
        if (m.streamHandler != null && Object.hasOwnProperty.call(m, "streamHandler"))
            $root.StreamHandlerRequest.encode(m.streamHandler, w.uint32(34).fork()).ldelim();
        if (m.dht != null && Object.hasOwnProperty.call(m, "dht"))
            $root.DHTRequest.encode(m.dht, w.uint32(42).fork()).ldelim();
        if (m.connManager != null && Object.hasOwnProperty.call(m, "connManager"))
            $root.ConnManagerRequest.encode(m.connManager, w.uint32(50).fork()).ldelim();
        if (m.disconnect != null && Object.hasOwnProperty.call(m, "disconnect"))
            $root.DisconnectRequest.encode(m.disconnect, w.uint32(58).fork()).ldelim();
        if (m.pubsub != null && Object.hasOwnProperty.call(m, "pubsub"))
            $root.PSRequest.encode(m.pubsub, w.uint32(66).fork()).ldelim();
        if (m.peerStore != null && Object.hasOwnProperty.call(m, "peerStore"))
            $root.PeerstoreRequest.encode(m.peerStore, w.uint32(74).fork()).ldelim();
        return w;
    };

    /**
     * Decodes a Request message from the specified reader or buffer.
     * @function decode
     * @memberof Request
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {Request} Request
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Request.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.Request();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.type = r.int32();
                break;
            case 2:
                m.connect = $root.ConnectRequest.decode(r, r.uint32());
                break;
            case 3:
                m.streamOpen = $root.StreamOpenRequest.decode(r, r.uint32());
                break;
            case 4:
                m.streamHandler = $root.StreamHandlerRequest.decode(r, r.uint32());
                break;
            case 5:
                m.dht = $root.DHTRequest.decode(r, r.uint32());
                break;
            case 6:
                m.connManager = $root.ConnManagerRequest.decode(r, r.uint32());
                break;
            case 7:
                m.disconnect = $root.DisconnectRequest.decode(r, r.uint32());
                break;
            case 8:
                m.pubsub = $root.PSRequest.decode(r, r.uint32());
                break;
            case 9:
                m.peerStore = $root.PeerstoreRequest.decode(r, r.uint32());
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("type"))
            throw $util.ProtocolError("missing required 'type'", { instance: m });
        return m;
    };

    /**
     * Creates a Request message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Request
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {Request} Request
     */
    Request.fromObject = function fromObject(d) {
        if (d instanceof $root.Request)
            return d;
        var m = new $root.Request();
        switch (d.type) {
        case "IDENTIFY":
        case 0:
            m.type = 0;
            break;
        case "CONNECT":
        case 1:
            m.type = 1;
            break;
        case "STREAM_OPEN":
        case 2:
            m.type = 2;
            break;
        case "STREAM_HANDLER":
        case 3:
            m.type = 3;
            break;
        case "DHT":
        case 4:
            m.type = 4;
            break;
        case "LIST_PEERS":
        case 5:
            m.type = 5;
            break;
        case "CONNMANAGER":
        case 6:
            m.type = 6;
            break;
        case "DISCONNECT":
        case 7:
            m.type = 7;
            break;
        case "PUBSUB":
        case 8:
            m.type = 8;
            break;
        case "PEERSTORE":
        case 9:
            m.type = 9;
            break;
        }
        if (d.connect != null) {
            if (typeof d.connect !== "object")
                throw TypeError(".Request.connect: object expected");
            m.connect = $root.ConnectRequest.fromObject(d.connect);
        }
        if (d.streamOpen != null) {
            if (typeof d.streamOpen !== "object")
                throw TypeError(".Request.streamOpen: object expected");
            m.streamOpen = $root.StreamOpenRequest.fromObject(d.streamOpen);
        }
        if (d.streamHandler != null) {
            if (typeof d.streamHandler !== "object")
                throw TypeError(".Request.streamHandler: object expected");
            m.streamHandler = $root.StreamHandlerRequest.fromObject(d.streamHandler);
        }
        if (d.dht != null) {
            if (typeof d.dht !== "object")
                throw TypeError(".Request.dht: object expected");
            m.dht = $root.DHTRequest.fromObject(d.dht);
        }
        if (d.connManager != null) {
            if (typeof d.connManager !== "object")
                throw TypeError(".Request.connManager: object expected");
            m.connManager = $root.ConnManagerRequest.fromObject(d.connManager);
        }
        if (d.disconnect != null) {
            if (typeof d.disconnect !== "object")
                throw TypeError(".Request.disconnect: object expected");
            m.disconnect = $root.DisconnectRequest.fromObject(d.disconnect);
        }
        if (d.pubsub != null) {
            if (typeof d.pubsub !== "object")
                throw TypeError(".Request.pubsub: object expected");
            m.pubsub = $root.PSRequest.fromObject(d.pubsub);
        }
        if (d.peerStore != null) {
            if (typeof d.peerStore !== "object")
                throw TypeError(".Request.peerStore: object expected");
            m.peerStore = $root.PeerstoreRequest.fromObject(d.peerStore);
        }
        return m;
    };

    /**
     * Creates a plain object from a Request message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Request
     * @static
     * @param {Request} m Request
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Request.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.defaults) {
            d.type = o.enums === String ? "IDENTIFY" : 0;
        }
        if (m.type != null && m.hasOwnProperty("type")) {
            d.type = o.enums === String ? $root.Request.Type[m.type] : m.type;
        }
        if (m.connect != null && m.hasOwnProperty("connect")) {
            d.connect = $root.ConnectRequest.toObject(m.connect, o);
            if (o.oneofs)
                d._connect = "connect";
        }
        if (m.streamOpen != null && m.hasOwnProperty("streamOpen")) {
            d.streamOpen = $root.StreamOpenRequest.toObject(m.streamOpen, o);
            if (o.oneofs)
                d._streamOpen = "streamOpen";
        }
        if (m.streamHandler != null && m.hasOwnProperty("streamHandler")) {
            d.streamHandler = $root.StreamHandlerRequest.toObject(m.streamHandler, o);
            if (o.oneofs)
                d._streamHandler = "streamHandler";
        }
        if (m.dht != null && m.hasOwnProperty("dht")) {
            d.dht = $root.DHTRequest.toObject(m.dht, o);
            if (o.oneofs)
                d._dht = "dht";
        }
        if (m.connManager != null && m.hasOwnProperty("connManager")) {
            d.connManager = $root.ConnManagerRequest.toObject(m.connManager, o);
            if (o.oneofs)
                d._connManager = "connManager";
        }
        if (m.disconnect != null && m.hasOwnProperty("disconnect")) {
            d.disconnect = $root.DisconnectRequest.toObject(m.disconnect, o);
            if (o.oneofs)
                d._disconnect = "disconnect";
        }
        if (m.pubsub != null && m.hasOwnProperty("pubsub")) {
            d.pubsub = $root.PSRequest.toObject(m.pubsub, o);
            if (o.oneofs)
                d._pubsub = "pubsub";
        }
        if (m.peerStore != null && m.hasOwnProperty("peerStore")) {
            d.peerStore = $root.PeerstoreRequest.toObject(m.peerStore, o);
            if (o.oneofs)
                d._peerStore = "peerStore";
        }
        return d;
    };

    /**
     * Converts this Request to JSON.
     * @function toJSON
     * @memberof Request
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Request.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name Request.Type
     * @enum {number}
     * @property {number} IDENTIFY=0 IDENTIFY value
     * @property {number} CONNECT=1 CONNECT value
     * @property {number} STREAM_OPEN=2 STREAM_OPEN value
     * @property {number} STREAM_HANDLER=3 STREAM_HANDLER value
     * @property {number} DHT=4 DHT value
     * @property {number} LIST_PEERS=5 LIST_PEERS value
     * @property {number} CONNMANAGER=6 CONNMANAGER value
     * @property {number} DISCONNECT=7 DISCONNECT value
     * @property {number} PUBSUB=8 PUBSUB value
     * @property {number} PEERSTORE=9 PEERSTORE value
     */
    Request.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "IDENTIFY"] = 0;
        values[valuesById[1] = "CONNECT"] = 1;
        values[valuesById[2] = "STREAM_OPEN"] = 2;
        values[valuesById[3] = "STREAM_HANDLER"] = 3;
        values[valuesById[4] = "DHT"] = 4;
        values[valuesById[5] = "LIST_PEERS"] = 5;
        values[valuesById[6] = "CONNMANAGER"] = 6;
        values[valuesById[7] = "DISCONNECT"] = 7;
        values[valuesById[8] = "PUBSUB"] = 8;
        values[valuesById[9] = "PEERSTORE"] = 9;
        return values;
    })();

    return Request;
})();

export const Response = $root.Response = (() => {

    /**
     * Properties of a Response.
     * @exports IResponse
     * @interface IResponse
     * @property {Response.Type} type Response type
     * @property {IErrorResponse|null} [error] Response error
     * @property {IStreamInfo|null} [streamInfo] Response streamInfo
     * @property {IIdentifyResponse|null} [identify] Response identify
     * @property {IDHTResponse|null} [dht] Response dht
     * @property {Array.<IPeerInfo>|null} [peers] Response peers
     * @property {IPSResponse|null} [pubsub] Response pubsub
     * @property {IPeerstoreResponse|null} [peerStore] Response peerStore
     */

    /**
     * Constructs a new Response.
     * @exports Response
     * @classdesc Represents a Response.
     * @implements IResponse
     * @constructor
     * @param {IResponse=} [p] Properties to set
     */
    function Response(p) {
        this.peers = [];
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * Response type.
     * @member {Response.Type} type
     * @memberof Response
     * @instance
     */
    Response.prototype.type = 0;

    /**
     * Response error.
     * @member {IErrorResponse|null|undefined} error
     * @memberof Response
     * @instance
     */
    Response.prototype.error = null;

    /**
     * Response streamInfo.
     * @member {IStreamInfo|null|undefined} streamInfo
     * @memberof Response
     * @instance
     */
    Response.prototype.streamInfo = null;

    /**
     * Response identify.
     * @member {IIdentifyResponse|null|undefined} identify
     * @memberof Response
     * @instance
     */
    Response.prototype.identify = null;

    /**
     * Response dht.
     * @member {IDHTResponse|null|undefined} dht
     * @memberof Response
     * @instance
     */
    Response.prototype.dht = null;

    /**
     * Response peers.
     * @member {Array.<IPeerInfo>} peers
     * @memberof Response
     * @instance
     */
    Response.prototype.peers = $util.emptyArray;

    /**
     * Response pubsub.
     * @member {IPSResponse|null|undefined} pubsub
     * @memberof Response
     * @instance
     */
    Response.prototype.pubsub = null;

    /**
     * Response peerStore.
     * @member {IPeerstoreResponse|null|undefined} peerStore
     * @memberof Response
     * @instance
     */
    Response.prototype.peerStore = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * Response _error.
     * @member {"error"|undefined} _error
     * @memberof Response
     * @instance
     */
    Object.defineProperty(Response.prototype, "_error", {
        get: $util.oneOfGetter($oneOfFields = ["error"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Response _streamInfo.
     * @member {"streamInfo"|undefined} _streamInfo
     * @memberof Response
     * @instance
     */
    Object.defineProperty(Response.prototype, "_streamInfo", {
        get: $util.oneOfGetter($oneOfFields = ["streamInfo"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Response _identify.
     * @member {"identify"|undefined} _identify
     * @memberof Response
     * @instance
     */
    Object.defineProperty(Response.prototype, "_identify", {
        get: $util.oneOfGetter($oneOfFields = ["identify"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Response _dht.
     * @member {"dht"|undefined} _dht
     * @memberof Response
     * @instance
     */
    Object.defineProperty(Response.prototype, "_dht", {
        get: $util.oneOfGetter($oneOfFields = ["dht"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Response _pubsub.
     * @member {"pubsub"|undefined} _pubsub
     * @memberof Response
     * @instance
     */
    Object.defineProperty(Response.prototype, "_pubsub", {
        get: $util.oneOfGetter($oneOfFields = ["pubsub"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Response _peerStore.
     * @member {"peerStore"|undefined} _peerStore
     * @memberof Response
     * @instance
     */
    Object.defineProperty(Response.prototype, "_peerStore", {
        get: $util.oneOfGetter($oneOfFields = ["peerStore"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Encodes the specified Response message. Does not implicitly {@link Response.verify|verify} messages.
     * @function encode
     * @memberof Response
     * @static
     * @param {IResponse} m Response message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Response.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(8).int32(m.type);
        if (m.error != null && Object.hasOwnProperty.call(m, "error"))
            $root.ErrorResponse.encode(m.error, w.uint32(18).fork()).ldelim();
        if (m.streamInfo != null && Object.hasOwnProperty.call(m, "streamInfo"))
            $root.StreamInfo.encode(m.streamInfo, w.uint32(26).fork()).ldelim();
        if (m.identify != null && Object.hasOwnProperty.call(m, "identify"))
            $root.IdentifyResponse.encode(m.identify, w.uint32(34).fork()).ldelim();
        if (m.dht != null && Object.hasOwnProperty.call(m, "dht"))
            $root.DHTResponse.encode(m.dht, w.uint32(42).fork()).ldelim();
        if (m.peers != null && m.peers.length) {
            for (var i = 0; i < m.peers.length; ++i)
                $root.PeerInfo.encode(m.peers[i], w.uint32(50).fork()).ldelim();
        }
        if (m.pubsub != null && Object.hasOwnProperty.call(m, "pubsub"))
            $root.PSResponse.encode(m.pubsub, w.uint32(58).fork()).ldelim();
        if (m.peerStore != null && Object.hasOwnProperty.call(m, "peerStore"))
            $root.PeerstoreResponse.encode(m.peerStore, w.uint32(66).fork()).ldelim();
        return w;
    };

    /**
     * Decodes a Response message from the specified reader or buffer.
     * @function decode
     * @memberof Response
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {Response} Response
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Response.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.Response();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.type = r.int32();
                break;
            case 2:
                m.error = $root.ErrorResponse.decode(r, r.uint32());
                break;
            case 3:
                m.streamInfo = $root.StreamInfo.decode(r, r.uint32());
                break;
            case 4:
                m.identify = $root.IdentifyResponse.decode(r, r.uint32());
                break;
            case 5:
                m.dht = $root.DHTResponse.decode(r, r.uint32());
                break;
            case 6:
                if (!(m.peers && m.peers.length))
                    m.peers = [];
                m.peers.push($root.PeerInfo.decode(r, r.uint32()));
                break;
            case 7:
                m.pubsub = $root.PSResponse.decode(r, r.uint32());
                break;
            case 8:
                m.peerStore = $root.PeerstoreResponse.decode(r, r.uint32());
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("type"))
            throw $util.ProtocolError("missing required 'type'", { instance: m });
        return m;
    };

    /**
     * Creates a Response message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Response
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {Response} Response
     */
    Response.fromObject = function fromObject(d) {
        if (d instanceof $root.Response)
            return d;
        var m = new $root.Response();
        switch (d.type) {
        case "OK":
        case 0:
            m.type = 0;
            break;
        case "ERROR":
        case 1:
            m.type = 1;
            break;
        }
        if (d.error != null) {
            if (typeof d.error !== "object")
                throw TypeError(".Response.error: object expected");
            m.error = $root.ErrorResponse.fromObject(d.error);
        }
        if (d.streamInfo != null) {
            if (typeof d.streamInfo !== "object")
                throw TypeError(".Response.streamInfo: object expected");
            m.streamInfo = $root.StreamInfo.fromObject(d.streamInfo);
        }
        if (d.identify != null) {
            if (typeof d.identify !== "object")
                throw TypeError(".Response.identify: object expected");
            m.identify = $root.IdentifyResponse.fromObject(d.identify);
        }
        if (d.dht != null) {
            if (typeof d.dht !== "object")
                throw TypeError(".Response.dht: object expected");
            m.dht = $root.DHTResponse.fromObject(d.dht);
        }
        if (d.peers) {
            if (!Array.isArray(d.peers))
                throw TypeError(".Response.peers: array expected");
            m.peers = [];
            for (var i = 0; i < d.peers.length; ++i) {
                if (typeof d.peers[i] !== "object")
                    throw TypeError(".Response.peers: object expected");
                m.peers[i] = $root.PeerInfo.fromObject(d.peers[i]);
            }
        }
        if (d.pubsub != null) {
            if (typeof d.pubsub !== "object")
                throw TypeError(".Response.pubsub: object expected");
            m.pubsub = $root.PSResponse.fromObject(d.pubsub);
        }
        if (d.peerStore != null) {
            if (typeof d.peerStore !== "object")
                throw TypeError(".Response.peerStore: object expected");
            m.peerStore = $root.PeerstoreResponse.fromObject(d.peerStore);
        }
        return m;
    };

    /**
     * Creates a plain object from a Response message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Response
     * @static
     * @param {Response} m Response
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Response.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.arrays || o.defaults) {
            d.peers = [];
        }
        if (o.defaults) {
            d.type = o.enums === String ? "OK" : 0;
        }
        if (m.type != null && m.hasOwnProperty("type")) {
            d.type = o.enums === String ? $root.Response.Type[m.type] : m.type;
        }
        if (m.error != null && m.hasOwnProperty("error")) {
            d.error = $root.ErrorResponse.toObject(m.error, o);
            if (o.oneofs)
                d._error = "error";
        }
        if (m.streamInfo != null && m.hasOwnProperty("streamInfo")) {
            d.streamInfo = $root.StreamInfo.toObject(m.streamInfo, o);
            if (o.oneofs)
                d._streamInfo = "streamInfo";
        }
        if (m.identify != null && m.hasOwnProperty("identify")) {
            d.identify = $root.IdentifyResponse.toObject(m.identify, o);
            if (o.oneofs)
                d._identify = "identify";
        }
        if (m.dht != null && m.hasOwnProperty("dht")) {
            d.dht = $root.DHTResponse.toObject(m.dht, o);
            if (o.oneofs)
                d._dht = "dht";
        }
        if (m.peers && m.peers.length) {
            d.peers = [];
            for (var j = 0; j < m.peers.length; ++j) {
                d.peers[j] = $root.PeerInfo.toObject(m.peers[j], o);
            }
        }
        if (m.pubsub != null && m.hasOwnProperty("pubsub")) {
            d.pubsub = $root.PSResponse.toObject(m.pubsub, o);
            if (o.oneofs)
                d._pubsub = "pubsub";
        }
        if (m.peerStore != null && m.hasOwnProperty("peerStore")) {
            d.peerStore = $root.PeerstoreResponse.toObject(m.peerStore, o);
            if (o.oneofs)
                d._peerStore = "peerStore";
        }
        return d;
    };

    /**
     * Converts this Response to JSON.
     * @function toJSON
     * @memberof Response
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Response.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name Response.Type
     * @enum {number}
     * @property {number} OK=0 OK value
     * @property {number} ERROR=1 ERROR value
     */
    Response.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "OK"] = 0;
        values[valuesById[1] = "ERROR"] = 1;
        return values;
    })();

    return Response;
})();

export const IdentifyResponse = $root.IdentifyResponse = (() => {

    /**
     * Properties of an IdentifyResponse.
     * @exports IIdentifyResponse
     * @interface IIdentifyResponse
     * @property {Uint8Array} id IdentifyResponse id
     * @property {Array.<Uint8Array>|null} [addrs] IdentifyResponse addrs
     */

    /**
     * Constructs a new IdentifyResponse.
     * @exports IdentifyResponse
     * @classdesc Represents an IdentifyResponse.
     * @implements IIdentifyResponse
     * @constructor
     * @param {IIdentifyResponse=} [p] Properties to set
     */
    function IdentifyResponse(p) {
        this.addrs = [];
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * IdentifyResponse id.
     * @member {Uint8Array} id
     * @memberof IdentifyResponse
     * @instance
     */
    IdentifyResponse.prototype.id = $util.newBuffer([]);

    /**
     * IdentifyResponse addrs.
     * @member {Array.<Uint8Array>} addrs
     * @memberof IdentifyResponse
     * @instance
     */
    IdentifyResponse.prototype.addrs = $util.emptyArray;

    /**
     * Encodes the specified IdentifyResponse message. Does not implicitly {@link IdentifyResponse.verify|verify} messages.
     * @function encode
     * @memberof IdentifyResponse
     * @static
     * @param {IIdentifyResponse} m IdentifyResponse message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    IdentifyResponse.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(10).bytes(m.id);
        if (m.addrs != null && m.addrs.length) {
            for (var i = 0; i < m.addrs.length; ++i)
                w.uint32(18).bytes(m.addrs[i]);
        }
        return w;
    };

    /**
     * Decodes an IdentifyResponse message from the specified reader or buffer.
     * @function decode
     * @memberof IdentifyResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {IdentifyResponse} IdentifyResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    IdentifyResponse.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.IdentifyResponse();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.id = r.bytes();
                break;
            case 2:
                if (!(m.addrs && m.addrs.length))
                    m.addrs = [];
                m.addrs.push(r.bytes());
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("id"))
            throw $util.ProtocolError("missing required 'id'", { instance: m });
        return m;
    };

    /**
     * Creates an IdentifyResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof IdentifyResponse
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {IdentifyResponse} IdentifyResponse
     */
    IdentifyResponse.fromObject = function fromObject(d) {
        if (d instanceof $root.IdentifyResponse)
            return d;
        var m = new $root.IdentifyResponse();
        if (d.id != null) {
            if (typeof d.id === "string")
                $util.base64.decode(d.id, m.id = $util.newBuffer($util.base64.length(d.id)), 0);
            else if (d.id.length)
                m.id = d.id;
        }
        if (d.addrs) {
            if (!Array.isArray(d.addrs))
                throw TypeError(".IdentifyResponse.addrs: array expected");
            m.addrs = [];
            for (var i = 0; i < d.addrs.length; ++i) {
                if (typeof d.addrs[i] === "string")
                    $util.base64.decode(d.addrs[i], m.addrs[i] = $util.newBuffer($util.base64.length(d.addrs[i])), 0);
                else if (d.addrs[i].length)
                    m.addrs[i] = d.addrs[i];
            }
        }
        return m;
    };

    /**
     * Creates a plain object from an IdentifyResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof IdentifyResponse
     * @static
     * @param {IdentifyResponse} m IdentifyResponse
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    IdentifyResponse.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.arrays || o.defaults) {
            d.addrs = [];
        }
        if (o.defaults) {
            if (o.bytes === String)
                d.id = "";
            else {
                d.id = [];
                if (o.bytes !== Array)
                    d.id = $util.newBuffer(d.id);
            }
        }
        if (m.id != null && m.hasOwnProperty("id")) {
            d.id = o.bytes === String ? $util.base64.encode(m.id, 0, m.id.length) : o.bytes === Array ? Array.prototype.slice.call(m.id) : m.id;
        }
        if (m.addrs && m.addrs.length) {
            d.addrs = [];
            for (var j = 0; j < m.addrs.length; ++j) {
                d.addrs[j] = o.bytes === String ? $util.base64.encode(m.addrs[j], 0, m.addrs[j].length) : o.bytes === Array ? Array.prototype.slice.call(m.addrs[j]) : m.addrs[j];
            }
        }
        return d;
    };

    /**
     * Converts this IdentifyResponse to JSON.
     * @function toJSON
     * @memberof IdentifyResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    IdentifyResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return IdentifyResponse;
})();

export const ConnectRequest = $root.ConnectRequest = (() => {

    /**
     * Properties of a ConnectRequest.
     * @exports IConnectRequest
     * @interface IConnectRequest
     * @property {Uint8Array} peer ConnectRequest peer
     * @property {Array.<Uint8Array>|null} [addrs] ConnectRequest addrs
     * @property {number|null} [timeout] ConnectRequest timeout
     */

    /**
     * Constructs a new ConnectRequest.
     * @exports ConnectRequest
     * @classdesc Represents a ConnectRequest.
     * @implements IConnectRequest
     * @constructor
     * @param {IConnectRequest=} [p] Properties to set
     */
    function ConnectRequest(p) {
        this.addrs = [];
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * ConnectRequest peer.
     * @member {Uint8Array} peer
     * @memberof ConnectRequest
     * @instance
     */
    ConnectRequest.prototype.peer = $util.newBuffer([]);

    /**
     * ConnectRequest addrs.
     * @member {Array.<Uint8Array>} addrs
     * @memberof ConnectRequest
     * @instance
     */
    ConnectRequest.prototype.addrs = $util.emptyArray;

    /**
     * ConnectRequest timeout.
     * @member {number|null|undefined} timeout
     * @memberof ConnectRequest
     * @instance
     */
    ConnectRequest.prototype.timeout = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * ConnectRequest _timeout.
     * @member {"timeout"|undefined} _timeout
     * @memberof ConnectRequest
     * @instance
     */
    Object.defineProperty(ConnectRequest.prototype, "_timeout", {
        get: $util.oneOfGetter($oneOfFields = ["timeout"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Encodes the specified ConnectRequest message. Does not implicitly {@link ConnectRequest.verify|verify} messages.
     * @function encode
     * @memberof ConnectRequest
     * @static
     * @param {IConnectRequest} m ConnectRequest message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ConnectRequest.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(10).bytes(m.peer);
        if (m.addrs != null && m.addrs.length) {
            for (var i = 0; i < m.addrs.length; ++i)
                w.uint32(18).bytes(m.addrs[i]);
        }
        if (m.timeout != null && Object.hasOwnProperty.call(m, "timeout"))
            w.uint32(24).int64(m.timeout);
        return w;
    };

    /**
     * Decodes a ConnectRequest message from the specified reader or buffer.
     * @function decode
     * @memberof ConnectRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {ConnectRequest} ConnectRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ConnectRequest.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.ConnectRequest();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.peer = r.bytes();
                break;
            case 2:
                if (!(m.addrs && m.addrs.length))
                    m.addrs = [];
                m.addrs.push(r.bytes());
                break;
            case 3:
                m.timeout = r.int64();
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("peer"))
            throw $util.ProtocolError("missing required 'peer'", { instance: m });
        return m;
    };

    /**
     * Creates a ConnectRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ConnectRequest
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {ConnectRequest} ConnectRequest
     */
    ConnectRequest.fromObject = function fromObject(d) {
        if (d instanceof $root.ConnectRequest)
            return d;
        var m = new $root.ConnectRequest();
        if (d.peer != null) {
            if (typeof d.peer === "string")
                $util.base64.decode(d.peer, m.peer = $util.newBuffer($util.base64.length(d.peer)), 0);
            else if (d.peer.length)
                m.peer = d.peer;
        }
        if (d.addrs) {
            if (!Array.isArray(d.addrs))
                throw TypeError(".ConnectRequest.addrs: array expected");
            m.addrs = [];
            for (var i = 0; i < d.addrs.length; ++i) {
                if (typeof d.addrs[i] === "string")
                    $util.base64.decode(d.addrs[i], m.addrs[i] = $util.newBuffer($util.base64.length(d.addrs[i])), 0);
                else if (d.addrs[i].length)
                    m.addrs[i] = d.addrs[i];
            }
        }
        if (d.timeout != null) {
            if ($util.Long)
                (m.timeout = $util.Long.fromValue(d.timeout)).unsigned = false;
            else if (typeof d.timeout === "string")
                m.timeout = parseInt(d.timeout, 10);
            else if (typeof d.timeout === "number")
                m.timeout = d.timeout;
            else if (typeof d.timeout === "object")
                m.timeout = new $util.LongBits(d.timeout.low >>> 0, d.timeout.high >>> 0).toNumber();
        }
        return m;
    };

    /**
     * Creates a plain object from a ConnectRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ConnectRequest
     * @static
     * @param {ConnectRequest} m ConnectRequest
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ConnectRequest.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.arrays || o.defaults) {
            d.addrs = [];
        }
        if (o.defaults) {
            if (o.bytes === String)
                d.peer = "";
            else {
                d.peer = [];
                if (o.bytes !== Array)
                    d.peer = $util.newBuffer(d.peer);
            }
        }
        if (m.peer != null && m.hasOwnProperty("peer")) {
            d.peer = o.bytes === String ? $util.base64.encode(m.peer, 0, m.peer.length) : o.bytes === Array ? Array.prototype.slice.call(m.peer) : m.peer;
        }
        if (m.addrs && m.addrs.length) {
            d.addrs = [];
            for (var j = 0; j < m.addrs.length; ++j) {
                d.addrs[j] = o.bytes === String ? $util.base64.encode(m.addrs[j], 0, m.addrs[j].length) : o.bytes === Array ? Array.prototype.slice.call(m.addrs[j]) : m.addrs[j];
            }
        }
        if (m.timeout != null && m.hasOwnProperty("timeout")) {
            if (typeof m.timeout === "number")
                d.timeout = o.longs === String ? String(m.timeout) : m.timeout;
            else
                d.timeout = o.longs === String ? $util.Long.prototype.toString.call(m.timeout) : o.longs === Number ? new $util.LongBits(m.timeout.low >>> 0, m.timeout.high >>> 0).toNumber() : m.timeout;
            if (o.oneofs)
                d._timeout = "timeout";
        }
        return d;
    };

    /**
     * Converts this ConnectRequest to JSON.
     * @function toJSON
     * @memberof ConnectRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ConnectRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ConnectRequest;
})();

export const StreamOpenRequest = $root.StreamOpenRequest = (() => {

    /**
     * Properties of a StreamOpenRequest.
     * @exports IStreamOpenRequest
     * @interface IStreamOpenRequest
     * @property {Uint8Array} peer StreamOpenRequest peer
     * @property {Array.<string>|null} [proto] StreamOpenRequest proto
     * @property {number|null} [timeout] StreamOpenRequest timeout
     */

    /**
     * Constructs a new StreamOpenRequest.
     * @exports StreamOpenRequest
     * @classdesc Represents a StreamOpenRequest.
     * @implements IStreamOpenRequest
     * @constructor
     * @param {IStreamOpenRequest=} [p] Properties to set
     */
    function StreamOpenRequest(p) {
        this.proto = [];
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * StreamOpenRequest peer.
     * @member {Uint8Array} peer
     * @memberof StreamOpenRequest
     * @instance
     */
    StreamOpenRequest.prototype.peer = $util.newBuffer([]);

    /**
     * StreamOpenRequest proto.
     * @member {Array.<string>} proto
     * @memberof StreamOpenRequest
     * @instance
     */
    StreamOpenRequest.prototype.proto = $util.emptyArray;

    /**
     * StreamOpenRequest timeout.
     * @member {number|null|undefined} timeout
     * @memberof StreamOpenRequest
     * @instance
     */
    StreamOpenRequest.prototype.timeout = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * StreamOpenRequest _timeout.
     * @member {"timeout"|undefined} _timeout
     * @memberof StreamOpenRequest
     * @instance
     */
    Object.defineProperty(StreamOpenRequest.prototype, "_timeout", {
        get: $util.oneOfGetter($oneOfFields = ["timeout"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Encodes the specified StreamOpenRequest message. Does not implicitly {@link StreamOpenRequest.verify|verify} messages.
     * @function encode
     * @memberof StreamOpenRequest
     * @static
     * @param {IStreamOpenRequest} m StreamOpenRequest message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StreamOpenRequest.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(10).bytes(m.peer);
        if (m.proto != null && m.proto.length) {
            for (var i = 0; i < m.proto.length; ++i)
                w.uint32(18).string(m.proto[i]);
        }
        if (m.timeout != null && Object.hasOwnProperty.call(m, "timeout"))
            w.uint32(24).int64(m.timeout);
        return w;
    };

    /**
     * Decodes a StreamOpenRequest message from the specified reader or buffer.
     * @function decode
     * @memberof StreamOpenRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {StreamOpenRequest} StreamOpenRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StreamOpenRequest.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.StreamOpenRequest();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.peer = r.bytes();
                break;
            case 2:
                if (!(m.proto && m.proto.length))
                    m.proto = [];
                m.proto.push(r.string());
                break;
            case 3:
                m.timeout = r.int64();
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("peer"))
            throw $util.ProtocolError("missing required 'peer'", { instance: m });
        return m;
    };

    /**
     * Creates a StreamOpenRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof StreamOpenRequest
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {StreamOpenRequest} StreamOpenRequest
     */
    StreamOpenRequest.fromObject = function fromObject(d) {
        if (d instanceof $root.StreamOpenRequest)
            return d;
        var m = new $root.StreamOpenRequest();
        if (d.peer != null) {
            if (typeof d.peer === "string")
                $util.base64.decode(d.peer, m.peer = $util.newBuffer($util.base64.length(d.peer)), 0);
            else if (d.peer.length)
                m.peer = d.peer;
        }
        if (d.proto) {
            if (!Array.isArray(d.proto))
                throw TypeError(".StreamOpenRequest.proto: array expected");
            m.proto = [];
            for (var i = 0; i < d.proto.length; ++i) {
                m.proto[i] = String(d.proto[i]);
            }
        }
        if (d.timeout != null) {
            if ($util.Long)
                (m.timeout = $util.Long.fromValue(d.timeout)).unsigned = false;
            else if (typeof d.timeout === "string")
                m.timeout = parseInt(d.timeout, 10);
            else if (typeof d.timeout === "number")
                m.timeout = d.timeout;
            else if (typeof d.timeout === "object")
                m.timeout = new $util.LongBits(d.timeout.low >>> 0, d.timeout.high >>> 0).toNumber();
        }
        return m;
    };

    /**
     * Creates a plain object from a StreamOpenRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof StreamOpenRequest
     * @static
     * @param {StreamOpenRequest} m StreamOpenRequest
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    StreamOpenRequest.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.arrays || o.defaults) {
            d.proto = [];
        }
        if (o.defaults) {
            if (o.bytes === String)
                d.peer = "";
            else {
                d.peer = [];
                if (o.bytes !== Array)
                    d.peer = $util.newBuffer(d.peer);
            }
        }
        if (m.peer != null && m.hasOwnProperty("peer")) {
            d.peer = o.bytes === String ? $util.base64.encode(m.peer, 0, m.peer.length) : o.bytes === Array ? Array.prototype.slice.call(m.peer) : m.peer;
        }
        if (m.proto && m.proto.length) {
            d.proto = [];
            for (var j = 0; j < m.proto.length; ++j) {
                d.proto[j] = m.proto[j];
            }
        }
        if (m.timeout != null && m.hasOwnProperty("timeout")) {
            if (typeof m.timeout === "number")
                d.timeout = o.longs === String ? String(m.timeout) : m.timeout;
            else
                d.timeout = o.longs === String ? $util.Long.prototype.toString.call(m.timeout) : o.longs === Number ? new $util.LongBits(m.timeout.low >>> 0, m.timeout.high >>> 0).toNumber() : m.timeout;
            if (o.oneofs)
                d._timeout = "timeout";
        }
        return d;
    };

    /**
     * Converts this StreamOpenRequest to JSON.
     * @function toJSON
     * @memberof StreamOpenRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    StreamOpenRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return StreamOpenRequest;
})();

export const StreamHandlerRequest = $root.StreamHandlerRequest = (() => {

    /**
     * Properties of a StreamHandlerRequest.
     * @exports IStreamHandlerRequest
     * @interface IStreamHandlerRequest
     * @property {Uint8Array} addr StreamHandlerRequest addr
     * @property {Array.<string>|null} [proto] StreamHandlerRequest proto
     */

    /**
     * Constructs a new StreamHandlerRequest.
     * @exports StreamHandlerRequest
     * @classdesc Represents a StreamHandlerRequest.
     * @implements IStreamHandlerRequest
     * @constructor
     * @param {IStreamHandlerRequest=} [p] Properties to set
     */
    function StreamHandlerRequest(p) {
        this.proto = [];
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * StreamHandlerRequest addr.
     * @member {Uint8Array} addr
     * @memberof StreamHandlerRequest
     * @instance
     */
    StreamHandlerRequest.prototype.addr = $util.newBuffer([]);

    /**
     * StreamHandlerRequest proto.
     * @member {Array.<string>} proto
     * @memberof StreamHandlerRequest
     * @instance
     */
    StreamHandlerRequest.prototype.proto = $util.emptyArray;

    /**
     * Encodes the specified StreamHandlerRequest message. Does not implicitly {@link StreamHandlerRequest.verify|verify} messages.
     * @function encode
     * @memberof StreamHandlerRequest
     * @static
     * @param {IStreamHandlerRequest} m StreamHandlerRequest message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StreamHandlerRequest.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(10).bytes(m.addr);
        if (m.proto != null && m.proto.length) {
            for (var i = 0; i < m.proto.length; ++i)
                w.uint32(18).string(m.proto[i]);
        }
        return w;
    };

    /**
     * Decodes a StreamHandlerRequest message from the specified reader or buffer.
     * @function decode
     * @memberof StreamHandlerRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {StreamHandlerRequest} StreamHandlerRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StreamHandlerRequest.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.StreamHandlerRequest();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.addr = r.bytes();
                break;
            case 2:
                if (!(m.proto && m.proto.length))
                    m.proto = [];
                m.proto.push(r.string());
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("addr"))
            throw $util.ProtocolError("missing required 'addr'", { instance: m });
        return m;
    };

    /**
     * Creates a StreamHandlerRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof StreamHandlerRequest
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {StreamHandlerRequest} StreamHandlerRequest
     */
    StreamHandlerRequest.fromObject = function fromObject(d) {
        if (d instanceof $root.StreamHandlerRequest)
            return d;
        var m = new $root.StreamHandlerRequest();
        if (d.addr != null) {
            if (typeof d.addr === "string")
                $util.base64.decode(d.addr, m.addr = $util.newBuffer($util.base64.length(d.addr)), 0);
            else if (d.addr.length)
                m.addr = d.addr;
        }
        if (d.proto) {
            if (!Array.isArray(d.proto))
                throw TypeError(".StreamHandlerRequest.proto: array expected");
            m.proto = [];
            for (var i = 0; i < d.proto.length; ++i) {
                m.proto[i] = String(d.proto[i]);
            }
        }
        return m;
    };

    /**
     * Creates a plain object from a StreamHandlerRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof StreamHandlerRequest
     * @static
     * @param {StreamHandlerRequest} m StreamHandlerRequest
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    StreamHandlerRequest.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.arrays || o.defaults) {
            d.proto = [];
        }
        if (o.defaults) {
            if (o.bytes === String)
                d.addr = "";
            else {
                d.addr = [];
                if (o.bytes !== Array)
                    d.addr = $util.newBuffer(d.addr);
            }
        }
        if (m.addr != null && m.hasOwnProperty("addr")) {
            d.addr = o.bytes === String ? $util.base64.encode(m.addr, 0, m.addr.length) : o.bytes === Array ? Array.prototype.slice.call(m.addr) : m.addr;
        }
        if (m.proto && m.proto.length) {
            d.proto = [];
            for (var j = 0; j < m.proto.length; ++j) {
                d.proto[j] = m.proto[j];
            }
        }
        return d;
    };

    /**
     * Converts this StreamHandlerRequest to JSON.
     * @function toJSON
     * @memberof StreamHandlerRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    StreamHandlerRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return StreamHandlerRequest;
})();

export const ErrorResponse = $root.ErrorResponse = (() => {

    /**
     * Properties of an ErrorResponse.
     * @exports IErrorResponse
     * @interface IErrorResponse
     * @property {string} msg ErrorResponse msg
     */

    /**
     * Constructs a new ErrorResponse.
     * @exports ErrorResponse
     * @classdesc Represents an ErrorResponse.
     * @implements IErrorResponse
     * @constructor
     * @param {IErrorResponse=} [p] Properties to set
     */
    function ErrorResponse(p) {
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * ErrorResponse msg.
     * @member {string} msg
     * @memberof ErrorResponse
     * @instance
     */
    ErrorResponse.prototype.msg = "";

    /**
     * Encodes the specified ErrorResponse message. Does not implicitly {@link ErrorResponse.verify|verify} messages.
     * @function encode
     * @memberof ErrorResponse
     * @static
     * @param {IErrorResponse} m ErrorResponse message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ErrorResponse.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(10).string(m.msg);
        return w;
    };

    /**
     * Decodes an ErrorResponse message from the specified reader or buffer.
     * @function decode
     * @memberof ErrorResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {ErrorResponse} ErrorResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ErrorResponse.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.ErrorResponse();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.msg = r.string();
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("msg"))
            throw $util.ProtocolError("missing required 'msg'", { instance: m });
        return m;
    };

    /**
     * Creates an ErrorResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ErrorResponse
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {ErrorResponse} ErrorResponse
     */
    ErrorResponse.fromObject = function fromObject(d) {
        if (d instanceof $root.ErrorResponse)
            return d;
        var m = new $root.ErrorResponse();
        if (d.msg != null) {
            m.msg = String(d.msg);
        }
        return m;
    };

    /**
     * Creates a plain object from an ErrorResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ErrorResponse
     * @static
     * @param {ErrorResponse} m ErrorResponse
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ErrorResponse.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.defaults) {
            d.msg = "";
        }
        if (m.msg != null && m.hasOwnProperty("msg")) {
            d.msg = m.msg;
        }
        return d;
    };

    /**
     * Converts this ErrorResponse to JSON.
     * @function toJSON
     * @memberof ErrorResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ErrorResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ErrorResponse;
})();

export const StreamInfo = $root.StreamInfo = (() => {

    /**
     * Properties of a StreamInfo.
     * @exports IStreamInfo
     * @interface IStreamInfo
     * @property {Uint8Array} peer StreamInfo peer
     * @property {Uint8Array} addr StreamInfo addr
     * @property {string} proto StreamInfo proto
     */

    /**
     * Constructs a new StreamInfo.
     * @exports StreamInfo
     * @classdesc Represents a StreamInfo.
     * @implements IStreamInfo
     * @constructor
     * @param {IStreamInfo=} [p] Properties to set
     */
    function StreamInfo(p) {
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * StreamInfo peer.
     * @member {Uint8Array} peer
     * @memberof StreamInfo
     * @instance
     */
    StreamInfo.prototype.peer = $util.newBuffer([]);

    /**
     * StreamInfo addr.
     * @member {Uint8Array} addr
     * @memberof StreamInfo
     * @instance
     */
    StreamInfo.prototype.addr = $util.newBuffer([]);

    /**
     * StreamInfo proto.
     * @member {string} proto
     * @memberof StreamInfo
     * @instance
     */
    StreamInfo.prototype.proto = "";

    /**
     * Encodes the specified StreamInfo message. Does not implicitly {@link StreamInfo.verify|verify} messages.
     * @function encode
     * @memberof StreamInfo
     * @static
     * @param {IStreamInfo} m StreamInfo message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    StreamInfo.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(10).bytes(m.peer);
        w.uint32(18).bytes(m.addr);
        w.uint32(26).string(m.proto);
        return w;
    };

    /**
     * Decodes a StreamInfo message from the specified reader or buffer.
     * @function decode
     * @memberof StreamInfo
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {StreamInfo} StreamInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    StreamInfo.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.StreamInfo();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.peer = r.bytes();
                break;
            case 2:
                m.addr = r.bytes();
                break;
            case 3:
                m.proto = r.string();
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("peer"))
            throw $util.ProtocolError("missing required 'peer'", { instance: m });
        if (!m.hasOwnProperty("addr"))
            throw $util.ProtocolError("missing required 'addr'", { instance: m });
        if (!m.hasOwnProperty("proto"))
            throw $util.ProtocolError("missing required 'proto'", { instance: m });
        return m;
    };

    /**
     * Creates a StreamInfo message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof StreamInfo
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {StreamInfo} StreamInfo
     */
    StreamInfo.fromObject = function fromObject(d) {
        if (d instanceof $root.StreamInfo)
            return d;
        var m = new $root.StreamInfo();
        if (d.peer != null) {
            if (typeof d.peer === "string")
                $util.base64.decode(d.peer, m.peer = $util.newBuffer($util.base64.length(d.peer)), 0);
            else if (d.peer.length)
                m.peer = d.peer;
        }
        if (d.addr != null) {
            if (typeof d.addr === "string")
                $util.base64.decode(d.addr, m.addr = $util.newBuffer($util.base64.length(d.addr)), 0);
            else if (d.addr.length)
                m.addr = d.addr;
        }
        if (d.proto != null) {
            m.proto = String(d.proto);
        }
        return m;
    };

    /**
     * Creates a plain object from a StreamInfo message. Also converts values to other types if specified.
     * @function toObject
     * @memberof StreamInfo
     * @static
     * @param {StreamInfo} m StreamInfo
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    StreamInfo.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.defaults) {
            if (o.bytes === String)
                d.peer = "";
            else {
                d.peer = [];
                if (o.bytes !== Array)
                    d.peer = $util.newBuffer(d.peer);
            }
            if (o.bytes === String)
                d.addr = "";
            else {
                d.addr = [];
                if (o.bytes !== Array)
                    d.addr = $util.newBuffer(d.addr);
            }
            d.proto = "";
        }
        if (m.peer != null && m.hasOwnProperty("peer")) {
            d.peer = o.bytes === String ? $util.base64.encode(m.peer, 0, m.peer.length) : o.bytes === Array ? Array.prototype.slice.call(m.peer) : m.peer;
        }
        if (m.addr != null && m.hasOwnProperty("addr")) {
            d.addr = o.bytes === String ? $util.base64.encode(m.addr, 0, m.addr.length) : o.bytes === Array ? Array.prototype.slice.call(m.addr) : m.addr;
        }
        if (m.proto != null && m.hasOwnProperty("proto")) {
            d.proto = m.proto;
        }
        return d;
    };

    /**
     * Converts this StreamInfo to JSON.
     * @function toJSON
     * @memberof StreamInfo
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    StreamInfo.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return StreamInfo;
})();

export const DHTRequest = $root.DHTRequest = (() => {

    /**
     * Properties of a DHTRequest.
     * @exports IDHTRequest
     * @interface IDHTRequest
     * @property {DHTRequest.Type} type DHTRequest type
     * @property {Uint8Array|null} [peer] DHTRequest peer
     * @property {Uint8Array|null} [cid] DHTRequest cid
     * @property {Uint8Array|null} [key] DHTRequest key
     * @property {Uint8Array|null} [value] DHTRequest value
     * @property {number|null} [count] DHTRequest count
     * @property {number|null} [timeout] DHTRequest timeout
     */

    /**
     * Constructs a new DHTRequest.
     * @exports DHTRequest
     * @classdesc Represents a DHTRequest.
     * @implements IDHTRequest
     * @constructor
     * @param {IDHTRequest=} [p] Properties to set
     */
    function DHTRequest(p) {
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * DHTRequest type.
     * @member {DHTRequest.Type} type
     * @memberof DHTRequest
     * @instance
     */
    DHTRequest.prototype.type = 0;

    /**
     * DHTRequest peer.
     * @member {Uint8Array|null|undefined} peer
     * @memberof DHTRequest
     * @instance
     */
    DHTRequest.prototype.peer = null;

    /**
     * DHTRequest cid.
     * @member {Uint8Array|null|undefined} cid
     * @memberof DHTRequest
     * @instance
     */
    DHTRequest.prototype.cid = null;

    /**
     * DHTRequest key.
     * @member {Uint8Array|null|undefined} key
     * @memberof DHTRequest
     * @instance
     */
    DHTRequest.prototype.key = null;

    /**
     * DHTRequest value.
     * @member {Uint8Array|null|undefined} value
     * @memberof DHTRequest
     * @instance
     */
    DHTRequest.prototype.value = null;

    /**
     * DHTRequest count.
     * @member {number|null|undefined} count
     * @memberof DHTRequest
     * @instance
     */
    DHTRequest.prototype.count = null;

    /**
     * DHTRequest timeout.
     * @member {number|null|undefined} timeout
     * @memberof DHTRequest
     * @instance
     */
    DHTRequest.prototype.timeout = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * DHTRequest _peer.
     * @member {"peer"|undefined} _peer
     * @memberof DHTRequest
     * @instance
     */
    Object.defineProperty(DHTRequest.prototype, "_peer", {
        get: $util.oneOfGetter($oneOfFields = ["peer"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * DHTRequest _cid.
     * @member {"cid"|undefined} _cid
     * @memberof DHTRequest
     * @instance
     */
    Object.defineProperty(DHTRequest.prototype, "_cid", {
        get: $util.oneOfGetter($oneOfFields = ["cid"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * DHTRequest _key.
     * @member {"key"|undefined} _key
     * @memberof DHTRequest
     * @instance
     */
    Object.defineProperty(DHTRequest.prototype, "_key", {
        get: $util.oneOfGetter($oneOfFields = ["key"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * DHTRequest _value.
     * @member {"value"|undefined} _value
     * @memberof DHTRequest
     * @instance
     */
    Object.defineProperty(DHTRequest.prototype, "_value", {
        get: $util.oneOfGetter($oneOfFields = ["value"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * DHTRequest _count.
     * @member {"count"|undefined} _count
     * @memberof DHTRequest
     * @instance
     */
    Object.defineProperty(DHTRequest.prototype, "_count", {
        get: $util.oneOfGetter($oneOfFields = ["count"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * DHTRequest _timeout.
     * @member {"timeout"|undefined} _timeout
     * @memberof DHTRequest
     * @instance
     */
    Object.defineProperty(DHTRequest.prototype, "_timeout", {
        get: $util.oneOfGetter($oneOfFields = ["timeout"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Encodes the specified DHTRequest message. Does not implicitly {@link DHTRequest.verify|verify} messages.
     * @function encode
     * @memberof DHTRequest
     * @static
     * @param {IDHTRequest} m DHTRequest message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DHTRequest.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(8).int32(m.type);
        if (m.peer != null && Object.hasOwnProperty.call(m, "peer"))
            w.uint32(18).bytes(m.peer);
        if (m.cid != null && Object.hasOwnProperty.call(m, "cid"))
            w.uint32(26).bytes(m.cid);
        if (m.key != null && Object.hasOwnProperty.call(m, "key"))
            w.uint32(34).bytes(m.key);
        if (m.value != null && Object.hasOwnProperty.call(m, "value"))
            w.uint32(42).bytes(m.value);
        if (m.count != null && Object.hasOwnProperty.call(m, "count"))
            w.uint32(48).int32(m.count);
        if (m.timeout != null && Object.hasOwnProperty.call(m, "timeout"))
            w.uint32(56).int64(m.timeout);
        return w;
    };

    /**
     * Decodes a DHTRequest message from the specified reader or buffer.
     * @function decode
     * @memberof DHTRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {DHTRequest} DHTRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DHTRequest.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.DHTRequest();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.type = r.int32();
                break;
            case 2:
                m.peer = r.bytes();
                break;
            case 3:
                m.cid = r.bytes();
                break;
            case 4:
                m.key = r.bytes();
                break;
            case 5:
                m.value = r.bytes();
                break;
            case 6:
                m.count = r.int32();
                break;
            case 7:
                m.timeout = r.int64();
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("type"))
            throw $util.ProtocolError("missing required 'type'", { instance: m });
        return m;
    };

    /**
     * Creates a DHTRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DHTRequest
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {DHTRequest} DHTRequest
     */
    DHTRequest.fromObject = function fromObject(d) {
        if (d instanceof $root.DHTRequest)
            return d;
        var m = new $root.DHTRequest();
        switch (d.type) {
        case "FIND_PEER":
        case 0:
            m.type = 0;
            break;
        case "FIND_PEERS_CONNECTED_TO_PEER":
        case 1:
            m.type = 1;
            break;
        case "FIND_PROVIDERS":
        case 2:
            m.type = 2;
            break;
        case "GET_CLOSEST_PEERS":
        case 3:
            m.type = 3;
            break;
        case "GET_PUBLIC_KEY":
        case 4:
            m.type = 4;
            break;
        case "GET_VALUE":
        case 5:
            m.type = 5;
            break;
        case "SEARCH_VALUE":
        case 6:
            m.type = 6;
            break;
        case "PUT_VALUE":
        case 7:
            m.type = 7;
            break;
        case "PROVIDE":
        case 8:
            m.type = 8;
            break;
        }
        if (d.peer != null) {
            if (typeof d.peer === "string")
                $util.base64.decode(d.peer, m.peer = $util.newBuffer($util.base64.length(d.peer)), 0);
            else if (d.peer.length)
                m.peer = d.peer;
        }
        if (d.cid != null) {
            if (typeof d.cid === "string")
                $util.base64.decode(d.cid, m.cid = $util.newBuffer($util.base64.length(d.cid)), 0);
            else if (d.cid.length)
                m.cid = d.cid;
        }
        if (d.key != null) {
            if (typeof d.key === "string")
                $util.base64.decode(d.key, m.key = $util.newBuffer($util.base64.length(d.key)), 0);
            else if (d.key.length)
                m.key = d.key;
        }
        if (d.value != null) {
            if (typeof d.value === "string")
                $util.base64.decode(d.value, m.value = $util.newBuffer($util.base64.length(d.value)), 0);
            else if (d.value.length)
                m.value = d.value;
        }
        if (d.count != null) {
            m.count = d.count | 0;
        }
        if (d.timeout != null) {
            if ($util.Long)
                (m.timeout = $util.Long.fromValue(d.timeout)).unsigned = false;
            else if (typeof d.timeout === "string")
                m.timeout = parseInt(d.timeout, 10);
            else if (typeof d.timeout === "number")
                m.timeout = d.timeout;
            else if (typeof d.timeout === "object")
                m.timeout = new $util.LongBits(d.timeout.low >>> 0, d.timeout.high >>> 0).toNumber();
        }
        return m;
    };

    /**
     * Creates a plain object from a DHTRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DHTRequest
     * @static
     * @param {DHTRequest} m DHTRequest
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DHTRequest.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.defaults) {
            d.type = o.enums === String ? "FIND_PEER" : 0;
        }
        if (m.type != null && m.hasOwnProperty("type")) {
            d.type = o.enums === String ? $root.DHTRequest.Type[m.type] : m.type;
        }
        if (m.peer != null && m.hasOwnProperty("peer")) {
            d.peer = o.bytes === String ? $util.base64.encode(m.peer, 0, m.peer.length) : o.bytes === Array ? Array.prototype.slice.call(m.peer) : m.peer;
            if (o.oneofs)
                d._peer = "peer";
        }
        if (m.cid != null && m.hasOwnProperty("cid")) {
            d.cid = o.bytes === String ? $util.base64.encode(m.cid, 0, m.cid.length) : o.bytes === Array ? Array.prototype.slice.call(m.cid) : m.cid;
            if (o.oneofs)
                d._cid = "cid";
        }
        if (m.key != null && m.hasOwnProperty("key")) {
            d.key = o.bytes === String ? $util.base64.encode(m.key, 0, m.key.length) : o.bytes === Array ? Array.prototype.slice.call(m.key) : m.key;
            if (o.oneofs)
                d._key = "key";
        }
        if (m.value != null && m.hasOwnProperty("value")) {
            d.value = o.bytes === String ? $util.base64.encode(m.value, 0, m.value.length) : o.bytes === Array ? Array.prototype.slice.call(m.value) : m.value;
            if (o.oneofs)
                d._value = "value";
        }
        if (m.count != null && m.hasOwnProperty("count")) {
            d.count = m.count;
            if (o.oneofs)
                d._count = "count";
        }
        if (m.timeout != null && m.hasOwnProperty("timeout")) {
            if (typeof m.timeout === "number")
                d.timeout = o.longs === String ? String(m.timeout) : m.timeout;
            else
                d.timeout = o.longs === String ? $util.Long.prototype.toString.call(m.timeout) : o.longs === Number ? new $util.LongBits(m.timeout.low >>> 0, m.timeout.high >>> 0).toNumber() : m.timeout;
            if (o.oneofs)
                d._timeout = "timeout";
        }
        return d;
    };

    /**
     * Converts this DHTRequest to JSON.
     * @function toJSON
     * @memberof DHTRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DHTRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name DHTRequest.Type
     * @enum {number}
     * @property {number} FIND_PEER=0 FIND_PEER value
     * @property {number} FIND_PEERS_CONNECTED_TO_PEER=1 FIND_PEERS_CONNECTED_TO_PEER value
     * @property {number} FIND_PROVIDERS=2 FIND_PROVIDERS value
     * @property {number} GET_CLOSEST_PEERS=3 GET_CLOSEST_PEERS value
     * @property {number} GET_PUBLIC_KEY=4 GET_PUBLIC_KEY value
     * @property {number} GET_VALUE=5 GET_VALUE value
     * @property {number} SEARCH_VALUE=6 SEARCH_VALUE value
     * @property {number} PUT_VALUE=7 PUT_VALUE value
     * @property {number} PROVIDE=8 PROVIDE value
     */
    DHTRequest.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "FIND_PEER"] = 0;
        values[valuesById[1] = "FIND_PEERS_CONNECTED_TO_PEER"] = 1;
        values[valuesById[2] = "FIND_PROVIDERS"] = 2;
        values[valuesById[3] = "GET_CLOSEST_PEERS"] = 3;
        values[valuesById[4] = "GET_PUBLIC_KEY"] = 4;
        values[valuesById[5] = "GET_VALUE"] = 5;
        values[valuesById[6] = "SEARCH_VALUE"] = 6;
        values[valuesById[7] = "PUT_VALUE"] = 7;
        values[valuesById[8] = "PROVIDE"] = 8;
        return values;
    })();

    return DHTRequest;
})();

export const DHTResponse = $root.DHTResponse = (() => {

    /**
     * Properties of a DHTResponse.
     * @exports IDHTResponse
     * @interface IDHTResponse
     * @property {DHTResponse.Type} type DHTResponse type
     * @property {IPeerInfo|null} [peer] DHTResponse peer
     * @property {Uint8Array|null} [value] DHTResponse value
     */

    /**
     * Constructs a new DHTResponse.
     * @exports DHTResponse
     * @classdesc Represents a DHTResponse.
     * @implements IDHTResponse
     * @constructor
     * @param {IDHTResponse=} [p] Properties to set
     */
    function DHTResponse(p) {
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * DHTResponse type.
     * @member {DHTResponse.Type} type
     * @memberof DHTResponse
     * @instance
     */
    DHTResponse.prototype.type = 0;

    /**
     * DHTResponse peer.
     * @member {IPeerInfo|null|undefined} peer
     * @memberof DHTResponse
     * @instance
     */
    DHTResponse.prototype.peer = null;

    /**
     * DHTResponse value.
     * @member {Uint8Array|null|undefined} value
     * @memberof DHTResponse
     * @instance
     */
    DHTResponse.prototype.value = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * DHTResponse _peer.
     * @member {"peer"|undefined} _peer
     * @memberof DHTResponse
     * @instance
     */
    Object.defineProperty(DHTResponse.prototype, "_peer", {
        get: $util.oneOfGetter($oneOfFields = ["peer"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * DHTResponse _value.
     * @member {"value"|undefined} _value
     * @memberof DHTResponse
     * @instance
     */
    Object.defineProperty(DHTResponse.prototype, "_value", {
        get: $util.oneOfGetter($oneOfFields = ["value"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Encodes the specified DHTResponse message. Does not implicitly {@link DHTResponse.verify|verify} messages.
     * @function encode
     * @memberof DHTResponse
     * @static
     * @param {IDHTResponse} m DHTResponse message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DHTResponse.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(8).int32(m.type);
        if (m.peer != null && Object.hasOwnProperty.call(m, "peer"))
            $root.PeerInfo.encode(m.peer, w.uint32(18).fork()).ldelim();
        if (m.value != null && Object.hasOwnProperty.call(m, "value"))
            w.uint32(26).bytes(m.value);
        return w;
    };

    /**
     * Decodes a DHTResponse message from the specified reader or buffer.
     * @function decode
     * @memberof DHTResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {DHTResponse} DHTResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DHTResponse.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.DHTResponse();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.type = r.int32();
                break;
            case 2:
                m.peer = $root.PeerInfo.decode(r, r.uint32());
                break;
            case 3:
                m.value = r.bytes();
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("type"))
            throw $util.ProtocolError("missing required 'type'", { instance: m });
        return m;
    };

    /**
     * Creates a DHTResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DHTResponse
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {DHTResponse} DHTResponse
     */
    DHTResponse.fromObject = function fromObject(d) {
        if (d instanceof $root.DHTResponse)
            return d;
        var m = new $root.DHTResponse();
        switch (d.type) {
        case "BEGIN":
        case 0:
            m.type = 0;
            break;
        case "VALUE":
        case 1:
            m.type = 1;
            break;
        case "END":
        case 2:
            m.type = 2;
            break;
        }
        if (d.peer != null) {
            if (typeof d.peer !== "object")
                throw TypeError(".DHTResponse.peer: object expected");
            m.peer = $root.PeerInfo.fromObject(d.peer);
        }
        if (d.value != null) {
            if (typeof d.value === "string")
                $util.base64.decode(d.value, m.value = $util.newBuffer($util.base64.length(d.value)), 0);
            else if (d.value.length)
                m.value = d.value;
        }
        return m;
    };

    /**
     * Creates a plain object from a DHTResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DHTResponse
     * @static
     * @param {DHTResponse} m DHTResponse
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DHTResponse.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.defaults) {
            d.type = o.enums === String ? "BEGIN" : 0;
        }
        if (m.type != null && m.hasOwnProperty("type")) {
            d.type = o.enums === String ? $root.DHTResponse.Type[m.type] : m.type;
        }
        if (m.peer != null && m.hasOwnProperty("peer")) {
            d.peer = $root.PeerInfo.toObject(m.peer, o);
            if (o.oneofs)
                d._peer = "peer";
        }
        if (m.value != null && m.hasOwnProperty("value")) {
            d.value = o.bytes === String ? $util.base64.encode(m.value, 0, m.value.length) : o.bytes === Array ? Array.prototype.slice.call(m.value) : m.value;
            if (o.oneofs)
                d._value = "value";
        }
        return d;
    };

    /**
     * Converts this DHTResponse to JSON.
     * @function toJSON
     * @memberof DHTResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DHTResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name DHTResponse.Type
     * @enum {number}
     * @property {number} BEGIN=0 BEGIN value
     * @property {number} VALUE=1 VALUE value
     * @property {number} END=2 END value
     */
    DHTResponse.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "BEGIN"] = 0;
        values[valuesById[1] = "VALUE"] = 1;
        values[valuesById[2] = "END"] = 2;
        return values;
    })();

    return DHTResponse;
})();

export const PeerInfo = $root.PeerInfo = (() => {

    /**
     * Properties of a PeerInfo.
     * @exports IPeerInfo
     * @interface IPeerInfo
     * @property {Uint8Array} id PeerInfo id
     * @property {Array.<Uint8Array>|null} [addrs] PeerInfo addrs
     */

    /**
     * Constructs a new PeerInfo.
     * @exports PeerInfo
     * @classdesc Represents a PeerInfo.
     * @implements IPeerInfo
     * @constructor
     * @param {IPeerInfo=} [p] Properties to set
     */
    function PeerInfo(p) {
        this.addrs = [];
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * PeerInfo id.
     * @member {Uint8Array} id
     * @memberof PeerInfo
     * @instance
     */
    PeerInfo.prototype.id = $util.newBuffer([]);

    /**
     * PeerInfo addrs.
     * @member {Array.<Uint8Array>} addrs
     * @memberof PeerInfo
     * @instance
     */
    PeerInfo.prototype.addrs = $util.emptyArray;

    /**
     * Encodes the specified PeerInfo message. Does not implicitly {@link PeerInfo.verify|verify} messages.
     * @function encode
     * @memberof PeerInfo
     * @static
     * @param {IPeerInfo} m PeerInfo message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PeerInfo.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(10).bytes(m.id);
        if (m.addrs != null && m.addrs.length) {
            for (var i = 0; i < m.addrs.length; ++i)
                w.uint32(18).bytes(m.addrs[i]);
        }
        return w;
    };

    /**
     * Decodes a PeerInfo message from the specified reader or buffer.
     * @function decode
     * @memberof PeerInfo
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {PeerInfo} PeerInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PeerInfo.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.PeerInfo();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.id = r.bytes();
                break;
            case 2:
                if (!(m.addrs && m.addrs.length))
                    m.addrs = [];
                m.addrs.push(r.bytes());
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("id"))
            throw $util.ProtocolError("missing required 'id'", { instance: m });
        return m;
    };

    /**
     * Creates a PeerInfo message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PeerInfo
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {PeerInfo} PeerInfo
     */
    PeerInfo.fromObject = function fromObject(d) {
        if (d instanceof $root.PeerInfo)
            return d;
        var m = new $root.PeerInfo();
        if (d.id != null) {
            if (typeof d.id === "string")
                $util.base64.decode(d.id, m.id = $util.newBuffer($util.base64.length(d.id)), 0);
            else if (d.id.length)
                m.id = d.id;
        }
        if (d.addrs) {
            if (!Array.isArray(d.addrs))
                throw TypeError(".PeerInfo.addrs: array expected");
            m.addrs = [];
            for (var i = 0; i < d.addrs.length; ++i) {
                if (typeof d.addrs[i] === "string")
                    $util.base64.decode(d.addrs[i], m.addrs[i] = $util.newBuffer($util.base64.length(d.addrs[i])), 0);
                else if (d.addrs[i].length)
                    m.addrs[i] = d.addrs[i];
            }
        }
        return m;
    };

    /**
     * Creates a plain object from a PeerInfo message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PeerInfo
     * @static
     * @param {PeerInfo} m PeerInfo
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PeerInfo.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.arrays || o.defaults) {
            d.addrs = [];
        }
        if (o.defaults) {
            if (o.bytes === String)
                d.id = "";
            else {
                d.id = [];
                if (o.bytes !== Array)
                    d.id = $util.newBuffer(d.id);
            }
        }
        if (m.id != null && m.hasOwnProperty("id")) {
            d.id = o.bytes === String ? $util.base64.encode(m.id, 0, m.id.length) : o.bytes === Array ? Array.prototype.slice.call(m.id) : m.id;
        }
        if (m.addrs && m.addrs.length) {
            d.addrs = [];
            for (var j = 0; j < m.addrs.length; ++j) {
                d.addrs[j] = o.bytes === String ? $util.base64.encode(m.addrs[j], 0, m.addrs[j].length) : o.bytes === Array ? Array.prototype.slice.call(m.addrs[j]) : m.addrs[j];
            }
        }
        return d;
    };

    /**
     * Converts this PeerInfo to JSON.
     * @function toJSON
     * @memberof PeerInfo
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PeerInfo.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PeerInfo;
})();

export const ConnManagerRequest = $root.ConnManagerRequest = (() => {

    /**
     * Properties of a ConnManagerRequest.
     * @exports IConnManagerRequest
     * @interface IConnManagerRequest
     * @property {ConnManagerRequest.Type} type ConnManagerRequest type
     * @property {Uint8Array|null} [peer] ConnManagerRequest peer
     * @property {string|null} [tag] ConnManagerRequest tag
     * @property {number|null} [weight] ConnManagerRequest weight
     */

    /**
     * Constructs a new ConnManagerRequest.
     * @exports ConnManagerRequest
     * @classdesc Represents a ConnManagerRequest.
     * @implements IConnManagerRequest
     * @constructor
     * @param {IConnManagerRequest=} [p] Properties to set
     */
    function ConnManagerRequest(p) {
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * ConnManagerRequest type.
     * @member {ConnManagerRequest.Type} type
     * @memberof ConnManagerRequest
     * @instance
     */
    ConnManagerRequest.prototype.type = 0;

    /**
     * ConnManagerRequest peer.
     * @member {Uint8Array|null|undefined} peer
     * @memberof ConnManagerRequest
     * @instance
     */
    ConnManagerRequest.prototype.peer = null;

    /**
     * ConnManagerRequest tag.
     * @member {string|null|undefined} tag
     * @memberof ConnManagerRequest
     * @instance
     */
    ConnManagerRequest.prototype.tag = null;

    /**
     * ConnManagerRequest weight.
     * @member {number|null|undefined} weight
     * @memberof ConnManagerRequest
     * @instance
     */
    ConnManagerRequest.prototype.weight = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * ConnManagerRequest _peer.
     * @member {"peer"|undefined} _peer
     * @memberof ConnManagerRequest
     * @instance
     */
    Object.defineProperty(ConnManagerRequest.prototype, "_peer", {
        get: $util.oneOfGetter($oneOfFields = ["peer"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * ConnManagerRequest _tag.
     * @member {"tag"|undefined} _tag
     * @memberof ConnManagerRequest
     * @instance
     */
    Object.defineProperty(ConnManagerRequest.prototype, "_tag", {
        get: $util.oneOfGetter($oneOfFields = ["tag"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * ConnManagerRequest _weight.
     * @member {"weight"|undefined} _weight
     * @memberof ConnManagerRequest
     * @instance
     */
    Object.defineProperty(ConnManagerRequest.prototype, "_weight", {
        get: $util.oneOfGetter($oneOfFields = ["weight"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Encodes the specified ConnManagerRequest message. Does not implicitly {@link ConnManagerRequest.verify|verify} messages.
     * @function encode
     * @memberof ConnManagerRequest
     * @static
     * @param {IConnManagerRequest} m ConnManagerRequest message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ConnManagerRequest.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(8).int32(m.type);
        if (m.peer != null && Object.hasOwnProperty.call(m, "peer"))
            w.uint32(18).bytes(m.peer);
        if (m.tag != null && Object.hasOwnProperty.call(m, "tag"))
            w.uint32(26).string(m.tag);
        if (m.weight != null && Object.hasOwnProperty.call(m, "weight"))
            w.uint32(32).int64(m.weight);
        return w;
    };

    /**
     * Decodes a ConnManagerRequest message from the specified reader or buffer.
     * @function decode
     * @memberof ConnManagerRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {ConnManagerRequest} ConnManagerRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ConnManagerRequest.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.ConnManagerRequest();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.type = r.int32();
                break;
            case 2:
                m.peer = r.bytes();
                break;
            case 3:
                m.tag = r.string();
                break;
            case 4:
                m.weight = r.int64();
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("type"))
            throw $util.ProtocolError("missing required 'type'", { instance: m });
        return m;
    };

    /**
     * Creates a ConnManagerRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ConnManagerRequest
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {ConnManagerRequest} ConnManagerRequest
     */
    ConnManagerRequest.fromObject = function fromObject(d) {
        if (d instanceof $root.ConnManagerRequest)
            return d;
        var m = new $root.ConnManagerRequest();
        switch (d.type) {
        case "TAG_PEER":
        case 0:
            m.type = 0;
            break;
        case "UNTAG_PEER":
        case 1:
            m.type = 1;
            break;
        case "TRIM":
        case 2:
            m.type = 2;
            break;
        }
        if (d.peer != null) {
            if (typeof d.peer === "string")
                $util.base64.decode(d.peer, m.peer = $util.newBuffer($util.base64.length(d.peer)), 0);
            else if (d.peer.length)
                m.peer = d.peer;
        }
        if (d.tag != null) {
            m.tag = String(d.tag);
        }
        if (d.weight != null) {
            if ($util.Long)
                (m.weight = $util.Long.fromValue(d.weight)).unsigned = false;
            else if (typeof d.weight === "string")
                m.weight = parseInt(d.weight, 10);
            else if (typeof d.weight === "number")
                m.weight = d.weight;
            else if (typeof d.weight === "object")
                m.weight = new $util.LongBits(d.weight.low >>> 0, d.weight.high >>> 0).toNumber();
        }
        return m;
    };

    /**
     * Creates a plain object from a ConnManagerRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ConnManagerRequest
     * @static
     * @param {ConnManagerRequest} m ConnManagerRequest
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ConnManagerRequest.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.defaults) {
            d.type = o.enums === String ? "TAG_PEER" : 0;
        }
        if (m.type != null && m.hasOwnProperty("type")) {
            d.type = o.enums === String ? $root.ConnManagerRequest.Type[m.type] : m.type;
        }
        if (m.peer != null && m.hasOwnProperty("peer")) {
            d.peer = o.bytes === String ? $util.base64.encode(m.peer, 0, m.peer.length) : o.bytes === Array ? Array.prototype.slice.call(m.peer) : m.peer;
            if (o.oneofs)
                d._peer = "peer";
        }
        if (m.tag != null && m.hasOwnProperty("tag")) {
            d.tag = m.tag;
            if (o.oneofs)
                d._tag = "tag";
        }
        if (m.weight != null && m.hasOwnProperty("weight")) {
            if (typeof m.weight === "number")
                d.weight = o.longs === String ? String(m.weight) : m.weight;
            else
                d.weight = o.longs === String ? $util.Long.prototype.toString.call(m.weight) : o.longs === Number ? new $util.LongBits(m.weight.low >>> 0, m.weight.high >>> 0).toNumber() : m.weight;
            if (o.oneofs)
                d._weight = "weight";
        }
        return d;
    };

    /**
     * Converts this ConnManagerRequest to JSON.
     * @function toJSON
     * @memberof ConnManagerRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ConnManagerRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name ConnManagerRequest.Type
     * @enum {number}
     * @property {number} TAG_PEER=0 TAG_PEER value
     * @property {number} UNTAG_PEER=1 UNTAG_PEER value
     * @property {number} TRIM=2 TRIM value
     */
    ConnManagerRequest.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "TAG_PEER"] = 0;
        values[valuesById[1] = "UNTAG_PEER"] = 1;
        values[valuesById[2] = "TRIM"] = 2;
        return values;
    })();

    return ConnManagerRequest;
})();

export const DisconnectRequest = $root.DisconnectRequest = (() => {

    /**
     * Properties of a DisconnectRequest.
     * @exports IDisconnectRequest
     * @interface IDisconnectRequest
     * @property {Uint8Array} peer DisconnectRequest peer
     */

    /**
     * Constructs a new DisconnectRequest.
     * @exports DisconnectRequest
     * @classdesc Represents a DisconnectRequest.
     * @implements IDisconnectRequest
     * @constructor
     * @param {IDisconnectRequest=} [p] Properties to set
     */
    function DisconnectRequest(p) {
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * DisconnectRequest peer.
     * @member {Uint8Array} peer
     * @memberof DisconnectRequest
     * @instance
     */
    DisconnectRequest.prototype.peer = $util.newBuffer([]);

    /**
     * Encodes the specified DisconnectRequest message. Does not implicitly {@link DisconnectRequest.verify|verify} messages.
     * @function encode
     * @memberof DisconnectRequest
     * @static
     * @param {IDisconnectRequest} m DisconnectRequest message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DisconnectRequest.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(10).bytes(m.peer);
        return w;
    };

    /**
     * Decodes a DisconnectRequest message from the specified reader or buffer.
     * @function decode
     * @memberof DisconnectRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {DisconnectRequest} DisconnectRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DisconnectRequest.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.DisconnectRequest();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.peer = r.bytes();
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("peer"))
            throw $util.ProtocolError("missing required 'peer'", { instance: m });
        return m;
    };

    /**
     * Creates a DisconnectRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DisconnectRequest
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {DisconnectRequest} DisconnectRequest
     */
    DisconnectRequest.fromObject = function fromObject(d) {
        if (d instanceof $root.DisconnectRequest)
            return d;
        var m = new $root.DisconnectRequest();
        if (d.peer != null) {
            if (typeof d.peer === "string")
                $util.base64.decode(d.peer, m.peer = $util.newBuffer($util.base64.length(d.peer)), 0);
            else if (d.peer.length)
                m.peer = d.peer;
        }
        return m;
    };

    /**
     * Creates a plain object from a DisconnectRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DisconnectRequest
     * @static
     * @param {DisconnectRequest} m DisconnectRequest
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DisconnectRequest.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.defaults) {
            if (o.bytes === String)
                d.peer = "";
            else {
                d.peer = [];
                if (o.bytes !== Array)
                    d.peer = $util.newBuffer(d.peer);
            }
        }
        if (m.peer != null && m.hasOwnProperty("peer")) {
            d.peer = o.bytes === String ? $util.base64.encode(m.peer, 0, m.peer.length) : o.bytes === Array ? Array.prototype.slice.call(m.peer) : m.peer;
        }
        return d;
    };

    /**
     * Converts this DisconnectRequest to JSON.
     * @function toJSON
     * @memberof DisconnectRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DisconnectRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DisconnectRequest;
})();

export const PSRequest = $root.PSRequest = (() => {

    /**
     * Properties of a PSRequest.
     * @exports IPSRequest
     * @interface IPSRequest
     * @property {PSRequest.Type} type PSRequest type
     * @property {string|null} [topic] PSRequest topic
     * @property {Uint8Array|null} [data] PSRequest data
     */

    /**
     * Constructs a new PSRequest.
     * @exports PSRequest
     * @classdesc Represents a PSRequest.
     * @implements IPSRequest
     * @constructor
     * @param {IPSRequest=} [p] Properties to set
     */
    function PSRequest(p) {
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * PSRequest type.
     * @member {PSRequest.Type} type
     * @memberof PSRequest
     * @instance
     */
    PSRequest.prototype.type = 0;

    /**
     * PSRequest topic.
     * @member {string|null|undefined} topic
     * @memberof PSRequest
     * @instance
     */
    PSRequest.prototype.topic = null;

    /**
     * PSRequest data.
     * @member {Uint8Array|null|undefined} data
     * @memberof PSRequest
     * @instance
     */
    PSRequest.prototype.data = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * PSRequest _topic.
     * @member {"topic"|undefined} _topic
     * @memberof PSRequest
     * @instance
     */
    Object.defineProperty(PSRequest.prototype, "_topic", {
        get: $util.oneOfGetter($oneOfFields = ["topic"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * PSRequest _data.
     * @member {"data"|undefined} _data
     * @memberof PSRequest
     * @instance
     */
    Object.defineProperty(PSRequest.prototype, "_data", {
        get: $util.oneOfGetter($oneOfFields = ["data"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Encodes the specified PSRequest message. Does not implicitly {@link PSRequest.verify|verify} messages.
     * @function encode
     * @memberof PSRequest
     * @static
     * @param {IPSRequest} m PSRequest message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PSRequest.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(8).int32(m.type);
        if (m.topic != null && Object.hasOwnProperty.call(m, "topic"))
            w.uint32(18).string(m.topic);
        if (m.data != null && Object.hasOwnProperty.call(m, "data"))
            w.uint32(26).bytes(m.data);
        return w;
    };

    /**
     * Decodes a PSRequest message from the specified reader or buffer.
     * @function decode
     * @memberof PSRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {PSRequest} PSRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PSRequest.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.PSRequest();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.type = r.int32();
                break;
            case 2:
                m.topic = r.string();
                break;
            case 3:
                m.data = r.bytes();
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("type"))
            throw $util.ProtocolError("missing required 'type'", { instance: m });
        return m;
    };

    /**
     * Creates a PSRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PSRequest
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {PSRequest} PSRequest
     */
    PSRequest.fromObject = function fromObject(d) {
        if (d instanceof $root.PSRequest)
            return d;
        var m = new $root.PSRequest();
        switch (d.type) {
        case "GET_TOPICS":
        case 0:
            m.type = 0;
            break;
        case "LIST_PEERS":
        case 1:
            m.type = 1;
            break;
        case "PUBLISH":
        case 2:
            m.type = 2;
            break;
        case "SUBSCRIBE":
        case 3:
            m.type = 3;
            break;
        }
        if (d.topic != null) {
            m.topic = String(d.topic);
        }
        if (d.data != null) {
            if (typeof d.data === "string")
                $util.base64.decode(d.data, m.data = $util.newBuffer($util.base64.length(d.data)), 0);
            else if (d.data.length)
                m.data = d.data;
        }
        return m;
    };

    /**
     * Creates a plain object from a PSRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PSRequest
     * @static
     * @param {PSRequest} m PSRequest
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PSRequest.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.defaults) {
            d.type = o.enums === String ? "GET_TOPICS" : 0;
        }
        if (m.type != null && m.hasOwnProperty("type")) {
            d.type = o.enums === String ? $root.PSRequest.Type[m.type] : m.type;
        }
        if (m.topic != null && m.hasOwnProperty("topic")) {
            d.topic = m.topic;
            if (o.oneofs)
                d._topic = "topic";
        }
        if (m.data != null && m.hasOwnProperty("data")) {
            d.data = o.bytes === String ? $util.base64.encode(m.data, 0, m.data.length) : o.bytes === Array ? Array.prototype.slice.call(m.data) : m.data;
            if (o.oneofs)
                d._data = "data";
        }
        return d;
    };

    /**
     * Converts this PSRequest to JSON.
     * @function toJSON
     * @memberof PSRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PSRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name PSRequest.Type
     * @enum {number}
     * @property {number} GET_TOPICS=0 GET_TOPICS value
     * @property {number} LIST_PEERS=1 LIST_PEERS value
     * @property {number} PUBLISH=2 PUBLISH value
     * @property {number} SUBSCRIBE=3 SUBSCRIBE value
     */
    PSRequest.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "GET_TOPICS"] = 0;
        values[valuesById[1] = "LIST_PEERS"] = 1;
        values[valuesById[2] = "PUBLISH"] = 2;
        values[valuesById[3] = "SUBSCRIBE"] = 3;
        return values;
    })();

    return PSRequest;
})();

export const PSMessage = $root.PSMessage = (() => {

    /**
     * Properties of a PSMessage.
     * @exports IPSMessage
     * @interface IPSMessage
     * @property {Uint8Array|null} [from] PSMessage from
     * @property {Uint8Array|null} [data] PSMessage data
     * @property {Uint8Array|null} [seqno] PSMessage seqno
     * @property {Array.<string>|null} [topicIDs] PSMessage topicIDs
     * @property {Uint8Array|null} [signature] PSMessage signature
     * @property {Uint8Array|null} [key] PSMessage key
     */

    /**
     * Constructs a new PSMessage.
     * @exports PSMessage
     * @classdesc Represents a PSMessage.
     * @implements IPSMessage
     * @constructor
     * @param {IPSMessage=} [p] Properties to set
     */
    function PSMessage(p) {
        this.topicIDs = [];
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * PSMessage from.
     * @member {Uint8Array|null|undefined} from
     * @memberof PSMessage
     * @instance
     */
    PSMessage.prototype.from = null;

    /**
     * PSMessage data.
     * @member {Uint8Array|null|undefined} data
     * @memberof PSMessage
     * @instance
     */
    PSMessage.prototype.data = null;

    /**
     * PSMessage seqno.
     * @member {Uint8Array|null|undefined} seqno
     * @memberof PSMessage
     * @instance
     */
    PSMessage.prototype.seqno = null;

    /**
     * PSMessage topicIDs.
     * @member {Array.<string>} topicIDs
     * @memberof PSMessage
     * @instance
     */
    PSMessage.prototype.topicIDs = $util.emptyArray;

    /**
     * PSMessage signature.
     * @member {Uint8Array|null|undefined} signature
     * @memberof PSMessage
     * @instance
     */
    PSMessage.prototype.signature = null;

    /**
     * PSMessage key.
     * @member {Uint8Array|null|undefined} key
     * @memberof PSMessage
     * @instance
     */
    PSMessage.prototype.key = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * PSMessage _from.
     * @member {"from"|undefined} _from
     * @memberof PSMessage
     * @instance
     */
    Object.defineProperty(PSMessage.prototype, "_from", {
        get: $util.oneOfGetter($oneOfFields = ["from"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * PSMessage _data.
     * @member {"data"|undefined} _data
     * @memberof PSMessage
     * @instance
     */
    Object.defineProperty(PSMessage.prototype, "_data", {
        get: $util.oneOfGetter($oneOfFields = ["data"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * PSMessage _seqno.
     * @member {"seqno"|undefined} _seqno
     * @memberof PSMessage
     * @instance
     */
    Object.defineProperty(PSMessage.prototype, "_seqno", {
        get: $util.oneOfGetter($oneOfFields = ["seqno"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * PSMessage _signature.
     * @member {"signature"|undefined} _signature
     * @memberof PSMessage
     * @instance
     */
    Object.defineProperty(PSMessage.prototype, "_signature", {
        get: $util.oneOfGetter($oneOfFields = ["signature"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * PSMessage _key.
     * @member {"key"|undefined} _key
     * @memberof PSMessage
     * @instance
     */
    Object.defineProperty(PSMessage.prototype, "_key", {
        get: $util.oneOfGetter($oneOfFields = ["key"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Encodes the specified PSMessage message. Does not implicitly {@link PSMessage.verify|verify} messages.
     * @function encode
     * @memberof PSMessage
     * @static
     * @param {IPSMessage} m PSMessage message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PSMessage.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        if (m.from != null && Object.hasOwnProperty.call(m, "from"))
            w.uint32(10).bytes(m.from);
        if (m.data != null && Object.hasOwnProperty.call(m, "data"))
            w.uint32(18).bytes(m.data);
        if (m.seqno != null && Object.hasOwnProperty.call(m, "seqno"))
            w.uint32(26).bytes(m.seqno);
        if (m.topicIDs != null && m.topicIDs.length) {
            for (var i = 0; i < m.topicIDs.length; ++i)
                w.uint32(34).string(m.topicIDs[i]);
        }
        if (m.signature != null && Object.hasOwnProperty.call(m, "signature"))
            w.uint32(42).bytes(m.signature);
        if (m.key != null && Object.hasOwnProperty.call(m, "key"))
            w.uint32(50).bytes(m.key);
        return w;
    };

    /**
     * Decodes a PSMessage message from the specified reader or buffer.
     * @function decode
     * @memberof PSMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {PSMessage} PSMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PSMessage.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.PSMessage();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.from = r.bytes();
                break;
            case 2:
                m.data = r.bytes();
                break;
            case 3:
                m.seqno = r.bytes();
                break;
            case 4:
                if (!(m.topicIDs && m.topicIDs.length))
                    m.topicIDs = [];
                m.topicIDs.push(r.string());
                break;
            case 5:
                m.signature = r.bytes();
                break;
            case 6:
                m.key = r.bytes();
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        return m;
    };

    /**
     * Creates a PSMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PSMessage
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {PSMessage} PSMessage
     */
    PSMessage.fromObject = function fromObject(d) {
        if (d instanceof $root.PSMessage)
            return d;
        var m = new $root.PSMessage();
        if (d.from != null) {
            if (typeof d.from === "string")
                $util.base64.decode(d.from, m.from = $util.newBuffer($util.base64.length(d.from)), 0);
            else if (d.from.length)
                m.from = d.from;
        }
        if (d.data != null) {
            if (typeof d.data === "string")
                $util.base64.decode(d.data, m.data = $util.newBuffer($util.base64.length(d.data)), 0);
            else if (d.data.length)
                m.data = d.data;
        }
        if (d.seqno != null) {
            if (typeof d.seqno === "string")
                $util.base64.decode(d.seqno, m.seqno = $util.newBuffer($util.base64.length(d.seqno)), 0);
            else if (d.seqno.length)
                m.seqno = d.seqno;
        }
        if (d.topicIDs) {
            if (!Array.isArray(d.topicIDs))
                throw TypeError(".PSMessage.topicIDs: array expected");
            m.topicIDs = [];
            for (var i = 0; i < d.topicIDs.length; ++i) {
                m.topicIDs[i] = String(d.topicIDs[i]);
            }
        }
        if (d.signature != null) {
            if (typeof d.signature === "string")
                $util.base64.decode(d.signature, m.signature = $util.newBuffer($util.base64.length(d.signature)), 0);
            else if (d.signature.length)
                m.signature = d.signature;
        }
        if (d.key != null) {
            if (typeof d.key === "string")
                $util.base64.decode(d.key, m.key = $util.newBuffer($util.base64.length(d.key)), 0);
            else if (d.key.length)
                m.key = d.key;
        }
        return m;
    };

    /**
     * Creates a plain object from a PSMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PSMessage
     * @static
     * @param {PSMessage} m PSMessage
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PSMessage.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.arrays || o.defaults) {
            d.topicIDs = [];
        }
        if (m.from != null && m.hasOwnProperty("from")) {
            d.from = o.bytes === String ? $util.base64.encode(m.from, 0, m.from.length) : o.bytes === Array ? Array.prototype.slice.call(m.from) : m.from;
            if (o.oneofs)
                d._from = "from";
        }
        if (m.data != null && m.hasOwnProperty("data")) {
            d.data = o.bytes === String ? $util.base64.encode(m.data, 0, m.data.length) : o.bytes === Array ? Array.prototype.slice.call(m.data) : m.data;
            if (o.oneofs)
                d._data = "data";
        }
        if (m.seqno != null && m.hasOwnProperty("seqno")) {
            d.seqno = o.bytes === String ? $util.base64.encode(m.seqno, 0, m.seqno.length) : o.bytes === Array ? Array.prototype.slice.call(m.seqno) : m.seqno;
            if (o.oneofs)
                d._seqno = "seqno";
        }
        if (m.topicIDs && m.topicIDs.length) {
            d.topicIDs = [];
            for (var j = 0; j < m.topicIDs.length; ++j) {
                d.topicIDs[j] = m.topicIDs[j];
            }
        }
        if (m.signature != null && m.hasOwnProperty("signature")) {
            d.signature = o.bytes === String ? $util.base64.encode(m.signature, 0, m.signature.length) : o.bytes === Array ? Array.prototype.slice.call(m.signature) : m.signature;
            if (o.oneofs)
                d._signature = "signature";
        }
        if (m.key != null && m.hasOwnProperty("key")) {
            d.key = o.bytes === String ? $util.base64.encode(m.key, 0, m.key.length) : o.bytes === Array ? Array.prototype.slice.call(m.key) : m.key;
            if (o.oneofs)
                d._key = "key";
        }
        return d;
    };

    /**
     * Converts this PSMessage to JSON.
     * @function toJSON
     * @memberof PSMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PSMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PSMessage;
})();

export const PSResponse = $root.PSResponse = (() => {

    /**
     * Properties of a PSResponse.
     * @exports IPSResponse
     * @interface IPSResponse
     * @property {Array.<string>|null} [topics] PSResponse topics
     * @property {Array.<Uint8Array>|null} [peerIDs] PSResponse peerIDs
     */

    /**
     * Constructs a new PSResponse.
     * @exports PSResponse
     * @classdesc Represents a PSResponse.
     * @implements IPSResponse
     * @constructor
     * @param {IPSResponse=} [p] Properties to set
     */
    function PSResponse(p) {
        this.topics = [];
        this.peerIDs = [];
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * PSResponse topics.
     * @member {Array.<string>} topics
     * @memberof PSResponse
     * @instance
     */
    PSResponse.prototype.topics = $util.emptyArray;

    /**
     * PSResponse peerIDs.
     * @member {Array.<Uint8Array>} peerIDs
     * @memberof PSResponse
     * @instance
     */
    PSResponse.prototype.peerIDs = $util.emptyArray;

    /**
     * Encodes the specified PSResponse message. Does not implicitly {@link PSResponse.verify|verify} messages.
     * @function encode
     * @memberof PSResponse
     * @static
     * @param {IPSResponse} m PSResponse message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PSResponse.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        if (m.topics != null && m.topics.length) {
            for (var i = 0; i < m.topics.length; ++i)
                w.uint32(10).string(m.topics[i]);
        }
        if (m.peerIDs != null && m.peerIDs.length) {
            for (var i = 0; i < m.peerIDs.length; ++i)
                w.uint32(18).bytes(m.peerIDs[i]);
        }
        return w;
    };

    /**
     * Decodes a PSResponse message from the specified reader or buffer.
     * @function decode
     * @memberof PSResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {PSResponse} PSResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PSResponse.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.PSResponse();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                if (!(m.topics && m.topics.length))
                    m.topics = [];
                m.topics.push(r.string());
                break;
            case 2:
                if (!(m.peerIDs && m.peerIDs.length))
                    m.peerIDs = [];
                m.peerIDs.push(r.bytes());
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        return m;
    };

    /**
     * Creates a PSResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PSResponse
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {PSResponse} PSResponse
     */
    PSResponse.fromObject = function fromObject(d) {
        if (d instanceof $root.PSResponse)
            return d;
        var m = new $root.PSResponse();
        if (d.topics) {
            if (!Array.isArray(d.topics))
                throw TypeError(".PSResponse.topics: array expected");
            m.topics = [];
            for (var i = 0; i < d.topics.length; ++i) {
                m.topics[i] = String(d.topics[i]);
            }
        }
        if (d.peerIDs) {
            if (!Array.isArray(d.peerIDs))
                throw TypeError(".PSResponse.peerIDs: array expected");
            m.peerIDs = [];
            for (var i = 0; i < d.peerIDs.length; ++i) {
                if (typeof d.peerIDs[i] === "string")
                    $util.base64.decode(d.peerIDs[i], m.peerIDs[i] = $util.newBuffer($util.base64.length(d.peerIDs[i])), 0);
                else if (d.peerIDs[i].length)
                    m.peerIDs[i] = d.peerIDs[i];
            }
        }
        return m;
    };

    /**
     * Creates a plain object from a PSResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PSResponse
     * @static
     * @param {PSResponse} m PSResponse
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PSResponse.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.arrays || o.defaults) {
            d.topics = [];
            d.peerIDs = [];
        }
        if (m.topics && m.topics.length) {
            d.topics = [];
            for (var j = 0; j < m.topics.length; ++j) {
                d.topics[j] = m.topics[j];
            }
        }
        if (m.peerIDs && m.peerIDs.length) {
            d.peerIDs = [];
            for (var j = 0; j < m.peerIDs.length; ++j) {
                d.peerIDs[j] = o.bytes === String ? $util.base64.encode(m.peerIDs[j], 0, m.peerIDs[j].length) : o.bytes === Array ? Array.prototype.slice.call(m.peerIDs[j]) : m.peerIDs[j];
            }
        }
        return d;
    };

    /**
     * Converts this PSResponse to JSON.
     * @function toJSON
     * @memberof PSResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PSResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PSResponse;
})();

export const PeerstoreRequest = $root.PeerstoreRequest = (() => {

    /**
     * Properties of a PeerstoreRequest.
     * @exports IPeerstoreRequest
     * @interface IPeerstoreRequest
     * @property {PeerstoreRequest.Type} type PeerstoreRequest type
     * @property {Uint8Array|null} [id] PeerstoreRequest id
     * @property {Array.<string>|null} [protos] PeerstoreRequest protos
     */

    /**
     * Constructs a new PeerstoreRequest.
     * @exports PeerstoreRequest
     * @classdesc Represents a PeerstoreRequest.
     * @implements IPeerstoreRequest
     * @constructor
     * @param {IPeerstoreRequest=} [p] Properties to set
     */
    function PeerstoreRequest(p) {
        this.protos = [];
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * PeerstoreRequest type.
     * @member {PeerstoreRequest.Type} type
     * @memberof PeerstoreRequest
     * @instance
     */
    PeerstoreRequest.prototype.type = 1;

    /**
     * PeerstoreRequest id.
     * @member {Uint8Array|null|undefined} id
     * @memberof PeerstoreRequest
     * @instance
     */
    PeerstoreRequest.prototype.id = null;

    /**
     * PeerstoreRequest protos.
     * @member {Array.<string>} protos
     * @memberof PeerstoreRequest
     * @instance
     */
    PeerstoreRequest.prototype.protos = $util.emptyArray;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * PeerstoreRequest _id.
     * @member {"id"|undefined} _id
     * @memberof PeerstoreRequest
     * @instance
     */
    Object.defineProperty(PeerstoreRequest.prototype, "_id", {
        get: $util.oneOfGetter($oneOfFields = ["id"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Encodes the specified PeerstoreRequest message. Does not implicitly {@link PeerstoreRequest.verify|verify} messages.
     * @function encode
     * @memberof PeerstoreRequest
     * @static
     * @param {IPeerstoreRequest} m PeerstoreRequest message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PeerstoreRequest.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        w.uint32(8).int32(m.type);
        if (m.id != null && Object.hasOwnProperty.call(m, "id"))
            w.uint32(18).bytes(m.id);
        if (m.protos != null && m.protos.length) {
            for (var i = 0; i < m.protos.length; ++i)
                w.uint32(26).string(m.protos[i]);
        }
        return w;
    };

    /**
     * Decodes a PeerstoreRequest message from the specified reader or buffer.
     * @function decode
     * @memberof PeerstoreRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {PeerstoreRequest} PeerstoreRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PeerstoreRequest.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.PeerstoreRequest();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.type = r.int32();
                break;
            case 2:
                m.id = r.bytes();
                break;
            case 3:
                if (!(m.protos && m.protos.length))
                    m.protos = [];
                m.protos.push(r.string());
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        if (!m.hasOwnProperty("type"))
            throw $util.ProtocolError("missing required 'type'", { instance: m });
        return m;
    };

    /**
     * Creates a PeerstoreRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PeerstoreRequest
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {PeerstoreRequest} PeerstoreRequest
     */
    PeerstoreRequest.fromObject = function fromObject(d) {
        if (d instanceof $root.PeerstoreRequest)
            return d;
        var m = new $root.PeerstoreRequest();
        switch (d.type) {
        case "GET_PROTOCOLS":
        case 1:
            m.type = 1;
            break;
        case "GET_PEER_INFO":
        case 2:
            m.type = 2;
            break;
        }
        if (d.id != null) {
            if (typeof d.id === "string")
                $util.base64.decode(d.id, m.id = $util.newBuffer($util.base64.length(d.id)), 0);
            else if (d.id.length)
                m.id = d.id;
        }
        if (d.protos) {
            if (!Array.isArray(d.protos))
                throw TypeError(".PeerstoreRequest.protos: array expected");
            m.protos = [];
            for (var i = 0; i < d.protos.length; ++i) {
                m.protos[i] = String(d.protos[i]);
            }
        }
        return m;
    };

    /**
     * Creates a plain object from a PeerstoreRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PeerstoreRequest
     * @static
     * @param {PeerstoreRequest} m PeerstoreRequest
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PeerstoreRequest.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.arrays || o.defaults) {
            d.protos = [];
        }
        if (o.defaults) {
            d.type = o.enums === String ? "GET_PROTOCOLS" : 1;
        }
        if (m.type != null && m.hasOwnProperty("type")) {
            d.type = o.enums === String ? $root.PeerstoreRequest.Type[m.type] : m.type;
        }
        if (m.id != null && m.hasOwnProperty("id")) {
            d.id = o.bytes === String ? $util.base64.encode(m.id, 0, m.id.length) : o.bytes === Array ? Array.prototype.slice.call(m.id) : m.id;
            if (o.oneofs)
                d._id = "id";
        }
        if (m.protos && m.protos.length) {
            d.protos = [];
            for (var j = 0; j < m.protos.length; ++j) {
                d.protos[j] = m.protos[j];
            }
        }
        return d;
    };

    /**
     * Converts this PeerstoreRequest to JSON.
     * @function toJSON
     * @memberof PeerstoreRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PeerstoreRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Type enum.
     * @name PeerstoreRequest.Type
     * @enum {number}
     * @property {number} GET_PROTOCOLS=1 GET_PROTOCOLS value
     * @property {number} GET_PEER_INFO=2 GET_PEER_INFO value
     */
    PeerstoreRequest.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[1] = "GET_PROTOCOLS"] = 1;
        values[valuesById[2] = "GET_PEER_INFO"] = 2;
        return values;
    })();

    return PeerstoreRequest;
})();

export const PeerstoreResponse = $root.PeerstoreResponse = (() => {

    /**
     * Properties of a PeerstoreResponse.
     * @exports IPeerstoreResponse
     * @interface IPeerstoreResponse
     * @property {IPeerInfo|null} [peer] PeerstoreResponse peer
     * @property {Array.<string>|null} [protos] PeerstoreResponse protos
     */

    /**
     * Constructs a new PeerstoreResponse.
     * @exports PeerstoreResponse
     * @classdesc Represents a PeerstoreResponse.
     * @implements IPeerstoreResponse
     * @constructor
     * @param {IPeerstoreResponse=} [p] Properties to set
     */
    function PeerstoreResponse(p) {
        this.protos = [];
        if (p)
            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                if (p[ks[i]] != null)
                    this[ks[i]] = p[ks[i]];
    }

    /**
     * PeerstoreResponse peer.
     * @member {IPeerInfo|null|undefined} peer
     * @memberof PeerstoreResponse
     * @instance
     */
    PeerstoreResponse.prototype.peer = null;

    /**
     * PeerstoreResponse protos.
     * @member {Array.<string>} protos
     * @memberof PeerstoreResponse
     * @instance
     */
    PeerstoreResponse.prototype.protos = $util.emptyArray;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * PeerstoreResponse _peer.
     * @member {"peer"|undefined} _peer
     * @memberof PeerstoreResponse
     * @instance
     */
    Object.defineProperty(PeerstoreResponse.prototype, "_peer", {
        get: $util.oneOfGetter($oneOfFields = ["peer"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Encodes the specified PeerstoreResponse message. Does not implicitly {@link PeerstoreResponse.verify|verify} messages.
     * @function encode
     * @memberof PeerstoreResponse
     * @static
     * @param {IPeerstoreResponse} m PeerstoreResponse message or plain object to encode
     * @param {$protobuf.Writer} [w] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PeerstoreResponse.encode = function encode(m, w) {
        if (!w)
            w = $Writer.create();
        if (m.peer != null && Object.hasOwnProperty.call(m, "peer"))
            $root.PeerInfo.encode(m.peer, w.uint32(10).fork()).ldelim();
        if (m.protos != null && m.protos.length) {
            for (var i = 0; i < m.protos.length; ++i)
                w.uint32(18).string(m.protos[i]);
        }
        return w;
    };

    /**
     * Decodes a PeerstoreResponse message from the specified reader or buffer.
     * @function decode
     * @memberof PeerstoreResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
     * @param {number} [l] Message length if known beforehand
     * @returns {PeerstoreResponse} PeerstoreResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PeerstoreResponse.decode = function decode(r, l) {
        if (!(r instanceof $Reader))
            r = $Reader.create(r);
        var c = l === undefined ? r.len : r.pos + l, m = new $root.PeerstoreResponse();
        while (r.pos < c) {
            var t = r.uint32();
            switch (t >>> 3) {
            case 1:
                m.peer = $root.PeerInfo.decode(r, r.uint32());
                break;
            case 2:
                if (!(m.protos && m.protos.length))
                    m.protos = [];
                m.protos.push(r.string());
                break;
            default:
                r.skipType(t & 7);
                break;
            }
        }
        return m;
    };

    /**
     * Creates a PeerstoreResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PeerstoreResponse
     * @static
     * @param {Object.<string,*>} d Plain object
     * @returns {PeerstoreResponse} PeerstoreResponse
     */
    PeerstoreResponse.fromObject = function fromObject(d) {
        if (d instanceof $root.PeerstoreResponse)
            return d;
        var m = new $root.PeerstoreResponse();
        if (d.peer != null) {
            if (typeof d.peer !== "object")
                throw TypeError(".PeerstoreResponse.peer: object expected");
            m.peer = $root.PeerInfo.fromObject(d.peer);
        }
        if (d.protos) {
            if (!Array.isArray(d.protos))
                throw TypeError(".PeerstoreResponse.protos: array expected");
            m.protos = [];
            for (var i = 0; i < d.protos.length; ++i) {
                m.protos[i] = String(d.protos[i]);
            }
        }
        return m;
    };

    /**
     * Creates a plain object from a PeerstoreResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PeerstoreResponse
     * @static
     * @param {PeerstoreResponse} m PeerstoreResponse
     * @param {$protobuf.IConversionOptions} [o] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PeerstoreResponse.toObject = function toObject(m, o) {
        if (!o)
            o = {};
        var d = {};
        if (o.arrays || o.defaults) {
            d.protos = [];
        }
        if (m.peer != null && m.hasOwnProperty("peer")) {
            d.peer = $root.PeerInfo.toObject(m.peer, o);
            if (o.oneofs)
                d._peer = "peer";
        }
        if (m.protos && m.protos.length) {
            d.protos = [];
            for (var j = 0; j < m.protos.length; ++j) {
                d.protos[j] = m.protos[j];
            }
        }
        return d;
    };

    /**
     * Converts this PeerstoreResponse to JSON.
     * @function toJSON
     * @memberof PeerstoreResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PeerstoreResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return PeerstoreResponse;
})();

export { $root as default };
