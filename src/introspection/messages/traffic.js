'use strict'

const {
  proto: { DataGauge, Traffic },
} = require('@libp2p/observer-proto')

const {
  randomFluctuationMultiplier,
  randomBandwidth,
} = require('../utils')

// Store characteristics of a p2p node used for mocking
// that don't and can't exist in the proto definition
const mockTrafficProps = new Map()

// FIX: Randomness

function createTraffic() {
  const traffic = new Traffic()

  traffic.setTrafficIn(createDataGauge())
  traffic.setTrafficOut(createDataGauge())

  mockTrafficProps.set(traffic, {
    inOutRatio: randomFluctuationMultiplier(),
  })

  return traffic
}

const mockDataGaugeProps = new Map()

function createDataGauge({ bandwidth = randomBandwidth() } = {}) {
  const dataGauge = new DataGauge()

  dataGauge.setCumBytes(0)
  dataGauge.setCumPackets(0)
  dataGauge.setInstBw(bandwidth)

  mockDataGaugeProps.set(dataGauge, {
    previousBandwidths: [bandwidth, bandwidth, bandwidth],
  })

  return dataGauge
}

module.exports = {
  createTraffic
}