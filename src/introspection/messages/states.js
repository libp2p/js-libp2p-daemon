'use strict'

const {
  proto: { State, Subsystems },
} = require('@libp2p/observer-proto')

const { createTimestamp } = require('../utils')
// const { createTraffic, sumTraffic } = require('./traffic')

function createState (connectionsList, now, dht, duration) {
  const state = new State()

  state.setInstantTs(createTimestamp(now))
  state.setStartTs(createTimestamp(now - duration + 1))
  state.setSnapshotDurationMs(duration)

  // TODO
  // const stateTraffic = createTraffic()
  // state.setTraffic(stateTraffic)
  // sumTraffic(stateTraffic, connectionsList)

  const subsystems = new Subsystems()
  subsystems.setConnectionsList(connectionsList)
  subsystems.setDht(dht)
  state.setSubsystems(subsystems)

  return state
}

module.exports = {
  createState
}
