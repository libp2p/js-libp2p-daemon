'use strict'

const {
  proto: { 
    Connection,
    EndpointPair,
    Stream,
    StreamList
  },
} = require('@libp2p/observer-proto')

const {
  createTraffic
} = require('./traffic')

const {
  randomLatency,
  createTimestamp
} = require('../utils')

function createStreamTimeline({ open = 0 }) {
  const streamTimeline = new Stream.Timeline([open])

  return streamTimeline
}

function createStream (s, connection) {
  const stream = new Stream()
  stream.setId(Buffer.from(s.id))
  stream.setProtocol(s.protocol)

  stream.setConn(new Stream.ConnectionRef(connection))
  stream.setTimeline(createStreamTimeline({ open: s.timeline.open }))
  stream.setRole(0) // TODO: map Role from stat.direction
  stream.setTraffic(createTraffic()) // TODO: fix randomness
  stream.setLatencyNs(randomLatency()) // TODO: proper latency

  return stream
}

function createConnection (connection) {
  const c = new Connection()
  c.setId(Buffer.from(connection.id))
  c.setStatus(0) // TODO: map connection.stat.status
  c.setTransportId(Buffer.from(connection.stat.multiplexer)) // TODO: infer from addresses
  c.setPeerId(connection.remotePeer.toB58String())
  c.setRole(0) // TODO: map Role from stat.direction
  c.setTraffic(createTraffic()) // TODO: fix randomness
  c.setAttribs(new Connection.Attributes([connection.stat.multiplexer, connection.stat.encryption]))
  c.setTimeline(
    new Connection.Timeline(mockConnectionTimeline({ open: connection.stat.timeline.open }))
  )

  c.setEndpoints(
    new EndpointPair(
      // TODO: UseRole
      // role === roleList.getNum('INITIATOR')
      //   ? [HOST_PEER_ID, peerId]
      //   : [peerId, HOST_PEER_ID]
      [connection.localAddr && connection.localAddr.toString(), connection.remoteAddr.toString()]
    )
  )
  c.setLatencyNs(randomLatency()) // TODO: proper latency

  const streamList = new StreamList()
  connection.streams.forEach((s) => {
    // TODO: This should really come from libp2p conn
    const streamMetadata = connection.registry.get(s.id) || {}
    const stream = createStream({
      ...s,
      ...streamMetadata
    }, c)
    streamList.addStreams(stream)
  })

  c.setStreams(streamList)

  return c
}

function mockConnectionTimeline ({ timeline, open, close, upgraded }) {
  const openTs = open && createTimestamp(open)
  const closeTs = close && createTimestamp(close)
  const upgradedTs = upgraded && createTimestamp(upgraded)

  if (!timeline) return [openTs, closeTs, upgradedTs]

  if (openTs) timeline.setOpenTs(openTs)
  if (closeTs) timeline.setCloseTs(closeTs)
  if (upgradedTs) timeline.setUpgradedTs(upgradedTs)
}

module.exports = {
  createConnection
}
