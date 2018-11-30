#! /usr/bin/env node
'use strict'

const yargs = require('yargs')
const YargsPromise = require('yargs-promise')
const { createDaemon } = require('../daemon')

const args = process.argv.slice(2)
const parser = new YargsPromise(yargs)

const main = async (processArgs) => {
  parser.yargs
    .option('sock', {
      desc: 'daemon control socket path',
      type: 'string',
      default: '/tmp/p2pd.sock'
    })
    .option('quiet', {
      alias: 'q',
      desc: 'be quiet',
      type: 'boolean',
      default: false
    })
    .option('id', {
      desc: 'peer identity; private key file',
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
      default: ''
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
    .fail((msg, err, yargs) => {
      if (err) {
        throw err // preserve stack
      }

      if (args.length > 0) {
        // eslint-disable-next-line
        console.log(msg)
      }

      yargs.showHelp()
    })

  try {
    const { data, argv } = await parser.parse(processArgs)
    // eslint-disable-next-line
    if (data) console.log(data)
    const daemon = await createDaemon(argv)
    await daemon.start()
    // eslint-disable-next-line
    console.log('daemon has started')
  } catch (err) {
    throw err
  }
}

module.exports = main
if (require.main === module) {
  main(process.argv)
}
