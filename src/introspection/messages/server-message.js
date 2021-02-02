'use strict'

const {
  proto: { ServerMessage, Version },
} = require('@libp2p/observer-proto')

function createServerMessage(message, type) {
  const serverMessage = new ServerMessage()

  serverMessage.setVersion(new Version(1))

  if (type === 'runtime') {
    serverMessage.setRuntime(message)
  } else if (type === 'event') {
    serverMessage.setEvent(message)
  } else if (type === 'state') {
    serverMessage.setState(message)
  } else if (type === 'response') {
    serverMessage.setResponse(message)
  } else if (type === 'notice') {
    serverMessage.setNotice(message)
  } else {
    throw new Error(`Unrecognised ServerMessage payload type "${type}"`)
  }

  return serverMessage
}

function createEventServerMessage(message) {
  return createServerMessage(message, 'event')
}

function createRuntimeServerMessage(message) {
  return createServerMessage(message, 'runtime')
}

function createStateServerMessage(message) {
  return createServerMessage(message, 'state')
}

function createResponseServerMessage(message) {
  return createServerMessage(message, 'response')
}

function createNoticeServerMessage(message) {
  return createServerMessage(message, 'notice')
}

module.exports = {
  createServerMessage,
  createEventServerMessage,
  createRuntimeServerMessage,
  createStateServerMessage,
  createResponseServerMessage,
  createNoticeServerMessage,
}
