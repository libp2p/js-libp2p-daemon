'use strict'

const {
  createResponseServerMessage,
  createRuntimeServerMessage,
  createStateServerMessage
} = require('./messages/server-message')

const {
  createConnection
} = require('./messages/connections')

const {
  createState: createStateMessage
} = require('./messages/states')

const {
  createDHT,
  updateDHT,
} = require('./messages/dht')

const {
  createCommandMessage
} = require('./messages/command-response')

const {
  createBufferSegment
} = require('./utils')

// TODO: Perhaps use in this context
function createVersion () {
  const versionBuf = Buffer.alloc(4)
  versionBuf.writeUInt32LE(1, 0)
  return versionBuf
}

function createRuntimeMessage (options = {}, runtime = createRuntime(options)) {
  const runtimePacket = createRuntimeServerMessage(runtime)
  return createBufferSegment(runtimePacket)
}

function createCommandResponse (options = {}, response = createCommandMessage(options)) {
  const responsePacket = createResponseServerMessage(response)
  return createBufferSegment(responsePacket)
}

function createConnections (connections = []) {
  const connectionsPbs = []

  connections.forEach((c) => {
    connectionsPbs.push(createConnection(c))
  })

  return connectionsPbs
}

function createState (connections, utcNow, dht, durationSnapshot) {
  const state = createStateMessage(connections, utcNow, dht, durationSnapshot)
  const statePacket = createStateServerMessage(state)
  return createBufferSegment(statePacket)
}

module.exports = {
  createDHT,
  createConnections,
  createRuntimeMessage,
  createVersion,
  createState,
  createCommandResponse,
  updateDHT
}
