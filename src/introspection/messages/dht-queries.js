'use strict'

const { proto: { DHT } } = require('@libp2p/observer-proto')

function createQueries({ dht, ...props }) {
  const peers = dht
    .getBucketsList()
    .reduce((peers, bucket) => [...peers, ...bucket.getPeersList()], [])

  const activeDhtPeers = peers.filter(
    peer => peer.getStatus() === DHT.PeerInDHT.Status.ACTIVE
  )
  // const queryCount = randomQueryCount(activeDhtPeers.length)

  // const createRandomQuery = () =>
  //   dhtQueryDirectionList.getRandom(1) === 'INBOUND'
  //     ? createInboundQuery(activeDhtPeers, props)
  //     : createOutboundQuery(activeDhtPeers, props)

  // return Array(queryCount)
  //   .fill()
  //   .map(createRandomQuery)
}

module.exports = {
  createQueries
}
