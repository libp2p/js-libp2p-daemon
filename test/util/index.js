'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const Client = require('../../src/client')
const StreamHandler = require('../../src/stream-handler')
const {
  Request,
  Response
} = require('../../src/protocol')

/**
 * Creates a new client connected at `options.multiaddr` and connects the daemon
 * to`libp2pPeer`.
 * @param {object} options
 * @param {Libp2p} options.libp2pPeer
 * @param {Multiaddr} options.multiaddr
 * @returns {void}
 */
async function connect ({
  libp2pPeer,
  multiaddr
}) {
  const client = new Client(multiaddr)

  const maConn = await client.connect()
  const request = {
    type: Request.Type.CONNECT,
    connect: {
      peer: libp2pPeer.peerId.toBytes(),
      addrs: libp2pPeer.multiaddrs.map(addr => addr.bytes)
    }
  }

  const streamHandler = new StreamHandler({ stream: maConn })
  streamHandler.write(Request.encode(request))

  const message = await streamHandler.read()
  const response = Response.decode(message)
  expect(response.type).to.eql(Response.Type.OK)

  await maConn.close()
}

module.exports.connect = connect
