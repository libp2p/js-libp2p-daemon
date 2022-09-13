import { promises as fs } from 'fs'
import type { Multiaddr } from '@multiformats/multiaddr'
import { createServer, Libp2pServer } from '@libp2p/daemon-server'
import { Libp2p, createLibp2p, Libp2pOptions } from 'libp2p'
import { PreSharedKeyConnectionProtector } from 'libp2p/pnet'
import { Noise } from '@chainsafe/libp2p-noise'
import { Mplex } from '@libp2p/mplex'
import { TCP } from '@libp2p/tcp'
import { WebSockets } from '@libp2p/websockets'
import { Bootstrap } from '@libp2p/bootstrap'
import { GossipSub } from '@chainsafe/libp2p-gossipsub'
import { FloodSub } from '@libp2p/floodsub'
import { PubSubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { unmarshalPrivateKey } from '@libp2p/crypto/keys'
import { createFromPrivKey } from '@libp2p/peer-id-factory'
import { KadDHT } from '@libp2p/kad-dht'

export default {
  createLibp2pServer: async function (listenAddr: Multiaddr, argv: any): Promise<Libp2pServer> {
    // Minimum libp2p setup.
    const options: Libp2pOptions = {
      addresses: {
        listen: argv.hostAddrs.split(','),
        announce: argv.announceAddrs.split(',')
      },

      transports: [new TCP(), new WebSockets()],
      connectionEncryption: [new Noise()],
      streamMuxers: [new Mplex()],
      peerDiscovery: []
    }

    // Load key file as peer ID.
    if (argv.id != null) {
      const marshaledKey: Buffer = await fs.readFile(argv.id)
      const unmarshaledKey = await unmarshalPrivateKey(marshaledKey)
      const peerId = await createFromPrivKey(unmarshaledKey)

      options.peerId = peerId
    }

    // Enable bootstrap peers.
    if (argv.bootstrap === true && options.peerDiscovery != null) {
      options.peerDiscovery.push(
        new Bootstrap({
          interval: argv.discoveryInterval,
          list: argv.bootstrapPeers.split(',')
        })
      )
    }

    // Configure PubSub
    if (argv.pubsub === true) {
      // Router implementation.
      switch (argv.pubsubRouter) {
        case 'gossipsub':
          options.pubsub = new GossipSub({ allowPublishToZeroPeers: true })
          break
        case 'floodsub':
          options.pubsub = new FloodSub()
          break
        default:
          throw new Error('invalid pubsubRouter type')
      }

      // Peer discovery
      if (argv.pubsubDiscovery === true && options.peerDiscovery != null) {
        options.peerDiscovery.push(
          new PubSubPeerDiscovery({ interval: argv.discoveryInterval })
        )
      }
    }

    // Enable DHT
    if (argv.dht === true) {
      options.dht = new KadDHT()
    }

    // Configure PSK
    if (argv.psk != null) {
      const swarmKey: Buffer = await fs.readFile(argv.psk)

      options.connectionProtector = new PreSharedKeyConnectionProtector({
        psk: swarmKey
      })
    }

    // Configure relay
    if (argv.relay === true) {
      options.relay = {
        enabled: true
      }

      if (argv.relayAuto === true) {
        options.relay.autoRelay = {
          enabled: true,
          maxListeners: argv.relayAutoListeners
        }
      }

      if (argv.relayHop === true) {
        options.relay.hop = {
          enabled: true
        }
      }

      if (argv.relayAdvertise === true) {
        options.relay.advertise = {
          enabled: true
        }
      }
    }

    const libp2p: Libp2p = await createLibp2p(options)
    const daemon: Libp2pServer = createServer(listenAddr, libp2p)

    return daemon
  }
}
