'use strict'

const { proto: { DHT } } = require('@libp2p/observer-proto')
const { getKademliaDistance } = require('@libp2p/observer-data')

const {
  createTimestamp,
  encodeBase32
} = require('../utils')

const {
  createQueries
} = require('./dht-queries')

const DEFAULT_PEERS = 30

function getActiveConnectionPeerIds (connections) {
  const activeConnections = connections.filter(
    conn => conn.getStatus() === statusList.getNum('ACTIVE')
  )
  return activeConnections.map(conn => conn.getPeerId())
}

function getCurrentBucketPeers (bucket) {
  const inBucketStatuses = ['ACTIVE', 'MISSING']
  return bucket
    .getPeersList()
    .filter(peer =>
      inBucketStatuses.includes(dhtStatusList.getItem(peer.getStatus()))
    )
}

function removePeerFromBucket (peer, bucket) {
  const peerId = peer.getPeerId()
  const peerList = bucket.getPeersList()
  const peerIndex = peerList.findIndex(_peer => _peer.getPeerId() === peerId)

  if (peerIndex < 0) {
    throw new Error(
      `Delete failed: bucket ${bucket.getCpl()} does not contain peer ${peerId}`
    )
  }

  peerList.splice(peerIndex, 1)
  bucket.setPeersList(peerList)
  return peerList
}

function createPeerInDHT({
  peerId,
  bucketAge = 0,
  status = DHT.PeerInDHT.Status.ACTIVE,
} = {}) {
  const pdht = new DHT.PeerInDHT()
  pdht.setPeerId(peerId)
  pdht.setAgeInBucket(bucketAge)
  pdht.setStatus(status)
  return pdht
}

function createDHT (libp2pDht) {
  const dht = new DHT()

  // Set Params
  const params = new DHT.Params()
  params.setK(libp2pDht.kBucketSize)
  params.setAlpha(libp2pDht.concurrency)
  params.setDisjointPaths(libp2pDht.disjointPaths)
  dht.setParams(params)

  dht.setProtocol(libp2pDht.protocol)
  dht.setEnabled(true) // TODO: this should not get here if disabled
  dht.setStartTs(createTimestamp(Date.now())) // TODO: Set proper started ts

  // Start with just the "catch-all" zero-distance bucket then unfold as needed
  const bucketZero = new DHT.Bucket()
  bucketZero.setCpl(0)

  bucketZero.setPeersList([])
  dht.addBuckets(bucketZero)

  return dht
}

function updatePeerStatus (peer, connection) {
  // If this corresponds to a connection, mimic its status
  if (connection) {
    setPeerStatusByConnection(peer, connection)
    return
  }
}

function setPeerStatusByConnection (peer, connection) {
  const connStatus = connection.getStatus()
  const connActive = connStatus === 0 || connStatus === 2 // Active / Opening

  const peerStatus = connActive ? DHT.PeerInDHT.Status.ACTIVE : DHT.PeerInDHT.Status.MISSING
  peer.setStatus(peerStatus)
}

function updatePeerInDHTBucket(peer, duration) {
  const age = peer.getAgeInBucket()
  peer.setAgeInBucket(age + duration)
}

function updatePeerInDHT (peer, connection, duration) {
  updatePeerStatus(peer, connection)
  if (peer.getStatus() === DHT.PeerInDHT.Status.ACTIVE) {
    updatePeerInDHTBucket(peer, duration)
  }
}

function updatePeersInDHT (peers, connections, dht, duration) {
  // const activeConnPeerIds = getActiveConnectionPeerIds(connections)
  peers.forEach(dhtPeer => {
    const connection = connections.find(
      conn => conn.getPeerId() === dhtPeer.getPeerId()
    )
    updatePeerInDHT(dhtPeer, connection, duration)
  })
}

function updateDHT (dht, libp2pDht, connections, { utcFrom, utcTo }) {
  const peers = dht
    .getBucketsList()
    .reduce((peers, bucket) => [...peers, ...bucket.getPeersList()], [])
  
  const duration = utcTo - utcFrom
  const buckets = libp2pDht.routingTable.bucketsToArray()

  // Update / Remove
  updatePeersInDHT(peers, connections, dht, duration)

  // Remover peers from the bucket
  for (let i = 0; i < buckets.length; i++) {
    const bucketList = dht.getBucketsList()[i]

    if (bucketList) {
      const peerList = bucketList.getPeersList()

      for (let j = 0; j < peerList.length; j++) {
        if (!buckets[i].contacts.find((c) => c.peerId.toB58String() === peerList[j].getPeerId())) {
          removePeerFromBucket(peerList[j], dht.getBucketsList()[i])
        }
      }
    }
  }

  // Add new peers to bucket
  for (let i = 0; i < buckets.length; i++) {
    if (!dht.getBucketsList()[i]) {
      const b = new DHT.Bucket()

      b.setPeersList([])
      dht.addBuckets(b)
    }

    const bucketList = dht.getBucketsList()[i]

    // console.log('  Bucket %d (%d peers)\t\t\t', i, buckets[i].contacts.length)
    // console.log('    Peer\t\t\t\t\t\t\tlast useful\tlast queried\tAgent Version')

    for (const contact of buckets[i].contacts) {
      const peerId = contact.peerId.toB58String()

      const state = ' ' // should be '@' if peer is connected
      // console.log('  %s %s\t%s\t%s\t%s', state, contact.peerId.toB58String(), contact.lastUsefulAt, contact.lastSuccessfulOutboundQueryAt, '-')

      if (!bucketList.getPeersList().find((bl) => bl.getPeerId() === peerId)) {
        bucketList.addPeers(createPeerInDHT({ peerId }))
      }
    }
  }

  // Iterate over Lookups
  // TODO: Need to update instead of replace for endTs
  const dhtLookups = Array.from(libp2pDht._queryManager.queries)
  const lookups = []
  console.log('lookups', dhtLookups.length)
  for (let i = 0; i < dhtLookups.length; i++) {
    const lookup = new DHT.Lookup()

    console.log('lookup queries', dhtLookups[i]._run.queries.length)

    lookup.setTarget(encodeBase32(dhtLookups[i].key))
    lookup.setStartTs(dhtLookups[i]._startTime)

    const queries = []
    for (const q of dhtLookups[i]._run.queries) {
      const query = new DHT.Query()

      // console.log('query', q.peerId.toB58String(), q.startTime, q.endTime, q.closerPeers.map((c) => c.toB58String()))
      // console.log('query', q.peerId.toB58String(), q.startTime, q.endTime, q.status)
      query.setTarget(q.peerId.toB58String())
      query.setStartTs(q.startTime)
      query.setEndTs(q.endTime)
      query.setStatus(q.status)
      query.setDistance(q.distance)

      for (const closer of q.closerPeers) {
        query.addPeerId(closer.toB58String())
      }

      queries.push(query)
    }
    lookup.setQueriesList(queries)
    lookups.push(lookup)
  }

  dht.setLookupsList(lookups)
}

module.exports = {
  createDHT,
  updateDHT
}
