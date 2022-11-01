#! /usr/bin/env node
/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

import { multiaddr } from '@multiformats/multiaddr'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import esMain from 'es-main'
import server from './server.js'

const log = console.log

export default async function main (processArgs: string[]) {
  const argv: { [key: string]: any } = yargs(hideBin(processArgs))
    .option('listen', {
      desc: 'daemon control listen multiaddr',
      type: 'string',
      default: '/unix/tmp/p2pd.sock'
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
    .option('pubsubDiscovery', {
      desc: 'Enables pubsub peer discovery',
      type: 'boolean',
      default: false
    })
    .option('psk', {
      desc: 'Pre-shared key file',
      type: 'string'
    })
    .option('discoveryInterval', {
      desc: 'The interval (ms) to perform peer discovery',
      type: 'number',
      default: 60e3
    })
    .option('relay', {
      desc: 'Enables relay',
      type: 'boolean',
      default: false
    })
    .option('relayHop', {
      desc: 'Enables relay HOP',
      type: 'boolean',
      default: false
    })
    .option('relayAdvertise', {
      desc: 'Enables realy HOP advertisement',
      type: 'boolean',
      default: false
    })
    .option('relayAuto', {
      desc: 'Enables Auto Relay',
      type: 'boolean',
      default: false
    })
    .option('relayAutoListeners', {
      desc: 'Maximum number of simultaneous HOP connections for Auto Relay to open',
      type: 'number',
      default: 2
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

  const daemon = await server.createLibp2pServer(multiaddr(argv.listen), argv)
  await daemon.start()

  if (argv.quiet !== true) {
    // eslint-disable-next-line
    log('daemon has started')
  }
}

if (esMain(import.meta)) {
  main(process.argv)
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
