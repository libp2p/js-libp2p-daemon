'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const Client = require('../../src/client')
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

  await client.attach()

  const request = {
    type: Request.Type.CONNECT,
    connect: {
      peer: Buffer.from(libp2pPeer.peerInfo.id.toBytes()),
      addrs: libp2pPeer.peerInfo.multiaddrs.toArray().map(addr => addr.buffer)
    }
  }

  const stream = client.send(request)

  const message = await stream.first()
  let response = Response.decode(message)
  expect(response.type).to.eql(Response.Type.OK)
  stream.end()

  await client.close()
}

module.exports.connect = connect
