'use strict'

const http = require('http')
const WebSocket = require('ws')

const {
  proto: {
    ClientCommand,
    Runtime,
    Configuration
  },
} = require('@libp2p/observer-proto')

const {
  createRuntimeMessage,
  createVersion,
  createDHT,
  createConnections,
  createState,
  createCommandResponse,
  updateDHT
} = require('./create-message')

const {
  DEFAULT_CONNECTIONS,
  DEFAULT_PEERS,
  DEFAULT_SNAPSHOT_DURATION,
  DEFAULT_CUTOFFTIME_SECONDS,
} = require('./utils')

const createIntrospection = ({
  libp2p,
  port = 8080,
  connectionsCount = DEFAULT_CONNECTIONS,
  peersCount = DEFAULT_PEERS,
  duration = DEFAULT_SNAPSHOT_DURATION,
  cutoffSeconds = DEFAULT_CUTOFFTIME_SECONDS
}) => {
  const version = createVersion()
  const server = http.createServer()
  const wss = new WebSocket.Server({ noServer: true })
  const msgQueue = []

  let connections
  let dht
  let runtime
  let effectiveConfig
  let pushEvents = false
  let pushStates = false
  let addDataInterval
  let sendInterval

  // TODO: Improve
  const generateMEssages = ({
    connectionsCount,
    duration: durationSnapshot,
    peersCount,
    cutoffSeconds,
  }) => {
    const utcNow = Date.now()
    const utcFrom = utcNow
    const utcTo = utcNow + duration

    if (!runtime) {
      runtime = new Runtime([
        'js-libp2p', // Implementation
        '2', // Version
        'macOS', // Platform
        libp2p.peerId.toB58String(), // Introspecting user's own peer ID
      ])
      // TODO Add Runtime Events
    }

    if (!dht) {
      dht = createDHT(libp2p._dht)
    }

    // Connections
    const connectionsLibp2p = Array.from(libp2p.connectionManager.connections.values()).flat()
    connections = createConnections(connectionsLibp2p)

    updateDHT(dht, libp2p._dht, connections, {
      utcFrom,
      utcTo
    })

    if (pushStates) {
      const statePacket = createState(
        connections,
        utcNow,
        dht,
        durationSnapshot
      )
      const data = Buffer.concat([version, statePacket]).toString('binary')
      // TODO: move concat upstream
      msgQueue.push({ ts: utcTo, type: 'state', data })
    }
  }

  const sendQueue = (ws) => {
    const utcNow = Date.now()
    const queue = []
    msgQueue.forEach((item, idx) => {
      queue.push(msgQueue.splice(idx, 1)[0])
    })

    // console.log('send queue', queue.length)
    queue
      .sort((a, b) => a.ts - b.ts)
      .forEach(item => {
        setTimeout(() => {
          ws.send(item.data)
        }, Math.max(0, item.ts - utcNow))
      })
  }

  const handleClientMessage = (ws, server, clientCommand, props) => {
    let sendEmptyOKResponse = true

    const command = clientCommand.getCommand()
    const commandId = clientCommand.getId()
    const commandSource = clientCommand.getSource()

    if (command === ClientCommand.Command.REQUEST) {
      if (commandSource === ClientCommand.Source.RUNTIME) {
        console.log('Sending requested runtime')
        sendRuntime()
      } else {
        console.log('Sending requested messages')
        generateMessages(props)
        sendQueue(ws)
      }
    } else if (command === ClientCommand.Command.PUSH_ENABLE) {
      if (commandSource === ClientCommand.Source.STATE) pushStates = true
      if (commandSource === ClientCommand.Source.EVENTS) pushEvents = true
    } else if (command === ClientCommand.Command.PUSH_DISABLE) {
      if (commandSource === ClientCommand.Source.STATE) pushStates = false
      if (commandSource === ClientCommand.Source.EVENTS) pushEvents = false
    } else if (command === ClientCommand.Command.PUSH_RESUME) {
      clearInterval(sendInterval)
      sendInterval = setInterval(() => {
        sendQueue(ws)
      }, 200)
    } else if (command === ClientCommand.Command.PUSH_PAUSE) {
      clearInterval(sendInterval)
    } else if (
      command === ClientCommand.Command.UPDATE_CONFIG ||
      command === ClientCommand.Command.HELLO
    ) {
      const newConfig = clientCommand.getConfig()
      if (newConfig) {
        updateConfig(newConfig, commandId, ws, server)
        sendEmptyOKResponse = false
      } else if (command === ClientCommand.Command.HELLO) {
        // Send default config
        sendCommandResponse(
          {
            id: commandId,
            effectiveConfig,
          },
          ws
        )
        sendEmptyOKResponse = false
      }
    } else {
      sendCommandResponse(
        {
          id: commandId,
          error: `Command ${command} ("${ClientCommand.Command[command]}") unrecognised by server`,
        },
        ws
      )

      sendEmptyOKResponse = false
    }

    if (sendEmptyOKResponse) {
      sendCommandResponse(
        {
          id: commandId,
        },
        ws
      )
    }    
  }

  const updateConfig = (newConfig, commandId, ws, server) => {
    let hasChanged = false

    const newStateInterval = newConfig.getStateSnapshotIntervalMs()
    const newRetentionPeriod = newConfig.getRetentionPeriodMs()

    if (newStateInterval) {
      clearInterval(server.generator)
      server.generator = setInterval(() => {
        generateMEssages({
          connectionsCount: server.connectionsCount,
          duration: newStateInterval
        })
      }, newStateInterval)
      hasChanged = true
      effectiveConfig.setStateSnapshotIntervalMs(newStateInterval)
    }
    if (newRetentionPeriod) {
      hasChanged = true
      effectiveConfig.setRetentionPeriodMs(newRetentionPeriod)
    }
    if (hasChanged) {
      sendCommandResponse(
        {
          id: commandId,
          effectiveConfig,
        },
        ws
      )
    }
  }

  const sendRuntime = (attempts = 0) => {
    if (!runtime) {
      // If connection requests runtime before runtime generated, wait and try again
      if (attempts < 20) setTimeout(() => sendRuntime(attempts + 1), 500)
      return
    }

    const runtimePacket = createRuntimeMessage({}, runtime)
    const data = Buffer.concat([version, runtimePacket]).toString('binary')
    // TODO: move concat upstream

    msgQueue.push({ ts: Date.now(), type: 'runtime', data })
  }

  function sendCommandResponse(props, ws) {
    const responsePacket = createCommandResponse(props)
    // TODO: move concat upstream
    const data = Buffer.concat([version, responsePacket]).toString('binary')
    ws.send(data)
  }

  return {
    start: () => {
      if (effectiveConfig) {
        duration = effectiveConfig.getStateSnapshotIntervalMs()
        cutoffSeconds = effectiveConfig.getRetentionPeriodMs() / 1000
      } else {
        effectiveConfig = new Configuration()
        effectiveConfig.setStateSnapshotIntervalMs(duration)
        effectiveConfig.setRetentionPeriodMs(cutoffSeconds * 1000)
      }

      wss.connectionsCount = connectionsCount
      clearInterval(addDataInterval)
      clearInterval(sendInterval)

      addDataInterval = setInterval(() => {
        generateMEssages({ connectionsCount, peersCount, duration, cutoffSeconds })
      }, duration)
      wss.generator = addDataInterval

      // handle connections
      wss.on('connection', ws => {
        sendInterval = setInterval(() => {
          sendQueue(ws)
        }, 400)

        // handle incoming messages
        ws.on('message', msg => {
          if (!msg) {
            return
          }

          const command = ClientCommand.deserializeBinary(msg)

          try {
            handleClientMessage(ws, wss, command)
          } catch (err) {
            sendCommandResponse(
              {
                id: command.getId(),
                error: err.toString(),
              },
              ws
            )
            throw err
          }
        })

        // Send runtime on connection
        sendRuntime()
      })

      server.on('upgrade', function upgrade(request, socket, head) {
        wss.handleUpgrade(request, socket, head, function done(ws) {
          wss.emit('connection', ws, request)
        })
      })

      // listen for connections
      server.listen(port, err => {
        if (err) {
          console.error(err)
        } else {
          console.log(`Websocket server listening on ws://localhost:${port}`)
        }
      })
    },
    stop: () => {
      // Clean up timers and server
      clearInterval(sendInterval)
      clearInterval(addDataInterval)

      // TODO: need to handle callback
      server.close(() => {})
    }
  }
}
module.exports = createIntrospection
