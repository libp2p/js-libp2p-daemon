/* eslint-env mocha */
'use strict'

const chai = require('chai')
const expect = chai.expect

const multiaddr = require('multiaddr')
const uint8ArrayFromString = require('uint8arrays/from-string')

const {
  ConnManagerRequest,
  DHTRequest,
  Request,
  Response
} = require('../src/protocol')

describe('protocol', () => {
  describe('request', () => {
    it('should be able to encode/decode a ConnectRequest', () => {
      const connRequest = {
        peer: uint8ArrayFromString('QmTarget'),
        addrs: [
          multiaddr('/ip4/0.0.0.0/tcp/0').bytes
        ],
        timeout: 0
      }
      const request = {
        type: Request.Type.CONNECT,
        connect: connRequest,
        streamOpen: null,
        streamHandler: null,
        dht: null,
        disconnect: null,
        peerStore: null,
        pubsub: null,
        connManager: null
      }
      const message = Request.encode(request)
      const decoded = Request.decode(message)
      expect(decoded).to.eql(request)
    })

    it('should be able to encode/decode a StreamOpenRequest', () => {
      const streamOpenRequest = {
        peer: uint8ArrayFromString('QmTarget'),
        proto: ['/p2pdaemon/1.0.0'],
        timeout: 0
      }
      const request = {
        type: Request.Type.STREAM_OPEN,
        connect: null,
        streamOpen: streamOpenRequest,
        streamHandler: null,
        dht: null,
        disconnect: null,
        peerStore: null,
        pubsub: null,
        connManager: null
      }
      const message = Request.encode(request)
      const decoded = Request.decode(message)
      expect(decoded).to.eql(request)
    })

    it('should be able to encode/decode a StreamHandlerRequest', () => {
      const streamHandlerRequest = {
        addr: multiaddr('/unix/tmp/p2p.sock').bytes,
        proto: ['/p2pdaemon/1.0.0']
      }
      const request = {
        type: Request.Type.STREAM_HANDLER,
        connect: null,
        streamOpen: null,
        streamHandler: streamHandlerRequest,
        dht: null,
        disconnect: null,
        peerStore: null,
        pubsub: null,
        connManager: null
      }
      const message = Request.encode(request)
      const decoded = Request.decode(message)
      expect(decoded).to.eql(request)
    })

    it('should be able to encode/decode a DHTRequest', () => {
      const dhtRequest = {
        type: DHTRequest.Type.FIND_PEER,
        peer: uint8ArrayFromString('QmTarget'),
        cid: null,
        key: Buffer.alloc(0),
        value: null,
        count: 0,
        timeout: 0
      }
      const request = {
        type: Request.Type.DHT,
        connect: null,
        streamOpen: null,
        streamHandler: null,
        dht: dhtRequest,
        disconnect: null,
        peerStore: null,
        pubsub: null,
        connManager: null
      }
      const message = Request.encode(request)
      const decoded = Request.decode(message)
      expect(decoded).to.eql(request)
    })

    it('should be able to encode/decode a ConnManagerRequest', () => {
      const connManagerRequest = {
        type: ConnManagerRequest.Type.TAG_PEER,
        peer: uint8ArrayFromString('QmTarget'),
        tag: '',
        weight: 0
      }
      const request = {
        type: Request.Type.CONNMANAGER,
        connect: null,
        streamOpen: null,
        streamHandler: null,
        dht: null,
        disconnect: null,
        peerStore: null,
        pubsub: null,
        connManager: connManagerRequest
      }
      const message = Request.encode(request)
      const decoded = Request.decode(message)
      expect(decoded).to.eql(request)
    })
  })

  describe('response', () => {
    it('should be able to encode/decode an ErrorResponse', () => {
      const response = {
        type: Response.Type.ERROR,
        error: {
          msg: 'ERR_NOT_FOUND'
        },
        streamInfo: null,
        identify: null,
        dht: null,
        pubsub: null,
        peerStore: null,
        peers: []
      }
      const message = Response.encode(response)
      const decoded = Response.decode(message)
      expect(decoded).to.eql(response)
    })
  })
})
