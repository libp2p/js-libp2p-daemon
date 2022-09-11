#! /usr/bin/env node
/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

import { promises as fs } from 'fs'
import { Multiaddr } from '@multiformats/multiaddr'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import esMain from 'es-main'
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
import { unmarshalPrivateKey } from '@libp2p/crypto/keys'
import { createFromPrivKey } from '@libp2p/peer-id-factory'
import { KadDHT } from '@libp2p/kad-dht'

const log = console.log

export default async function main (processArgs: string[]) {
  const argv: { [key: string]: any } = yargs(hideBin(processArgs))
    .option('listen', {
      desc: 'daemon control listen multiaddr',
      type: 'string',
      // default: '/unix/tmp/p2pd.sock'
      // UNIX sockets are not supported by @libp2p/tcp yet...
      default: '/ip4/127.0.0.1/tcp/1234'
    })
    .option('quiet', {
      alias: 'q',
      desc: 'be quiet',
      type: 'boolean',
      default: false
    })
    .option('id', {
      desc: 'peer identity; private key file',
      type: 'string'
    })
    .option('hostAddrs', {
      desc: 'Comma separated list of multiaddrs the host should listen on',
      type: 'string',
      default: '/ip4/0.0.0.0/tcp/0'
    })
    .option('announceAddrs', {
      desc: 'Comma separated list of multiaddrs the host should announce to the network',
      type: 'string',
      default: ''
    })
    .option('bootstrap', {
      alias: 'b',
      desc: 'Connects to bootstrap peers and bootstraps the dht if enabled',
      type: 'boolean',
      default: false
    })
    .option('bootstrapPeers', {
      desc: 'Comma separated list of bootstrap peers; defaults to the IPFS DHT peers',
      type: 'string',
      default: '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ,/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN,/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb,/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp,/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa,/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
    })
    .option('dht', {
      desc: 'Enables the DHT in full node mode',
      type: 'boolean',
      default: false
    })
    .option('dhtClient', {
      desc: '(Not yet supported) Enables the DHT in client mode',
      type: 'boolean',
      default: false
    })
    .option('nat', {
      desc: '(Not yet supported) Enables UPnP NAT hole punching',
      type: 'boolean',
      default: false
    })
    .option('connMgr', {
      desc: '(Not yet supported) Enables the Connection Manager',
      type: 'boolean',
      default: false
    })
    .option('connMgrLo', {
      desc: 'Number identifying the number of peers below which this node will not activate preemptive disconnections',
      type: 'number'
    })
    .option('connMgrHi', {
      desc: 'Number identifying the maximum number of peers the current peer is willing to be connected to before is starts disconnecting',
      type: 'number'
    })
    .option('pubsub', {
      desc: 'Enables pubsub',
      type: 'boolean',
      default: false
    })
    .option('pubsubRouter', {
      desc: 'Specifies the pubsub router implementation',
      type: 'string',
      default: 'gossipsub'
    })
    .option('psk', {
      desc: 'Pre-shared key file',
      type: 'string'
    })
    .fail((msg: string, err: Error | undefined, yargs?: any) => {
      if (err != null) {
        throw err // preserve stack
      }

      if (hideBin(processArgs).length > 0) {
        // eslint-disable-next-line
        log(msg)
      }

      yargs.showHelp()
    })
    .parse()

  const daemon = await createLibp2pServer(new Multiaddr(argv.listen), argv)
  await daemon.start()

  if (argv.quiet !== true) {
    // eslint-disable-next-line
    log('daemon has started')
  }
}

export async function createLibp2pServer (listenAddr: Multiaddr, argv: any): Promise<Libp2pServer> {
  // Minimum libp2p setup.
  const options: Libp2pOptions = {
    addresses: {
      listen: argv.hostAddrs.split(','),
      announce: argv.announceAddrs.split(',')
    },

    transports: [new TCP(), new WebSockets()],
    connectionEncryption: [new Noise()],
    streamMuxers: [new Mplex()]
  }

  // Load key file as peer ID.
  if (argv.id != null) {
    const marshaledKey: Buffer = await fs.readFile(argv.id)
    const unmarshaledKey = await unmarshalPrivateKey(marshaledKey)
    const peerId = await createFromPrivKey(unmarshaledKey)

    options.peerId = peerId
  }

  // Enable bootstrap peers.
  if (argv.bootstrap === true) {
    options.peerDiscovery = [
      new Bootstrap({
        interval: 60e3,
        list: argv.bootstrapPeers.split(',')
      })
    ]
  }

  // Configure PubSub
  if (argv.pubsub === true) {
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

  const libp2p: Libp2p = await createLibp2p(options)
  const daemon: Libp2pServer = createServer(listenAddr, libp2p)

  return daemon
}

if (esMain(import.meta)) {
  main(process.argv)
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
