libp2p-daemon client JavaScript implementation
======

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](https://protocol.ai/)
[![](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23libp2p)
[![Discourse posts](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg)](https://discuss.libp2p.io)

> A Javascript client to interact with a standalone deployment of a libp2p host, running in its own OS process. Essentially, this client allows to communicate with other peers, interact with the DHT, participate in pubsub, etc. no matter the language they are implemented with.

## Lead Maintainer

[Vasco Santos](https://github.com/vasco-santos)

## Table of Contents

* [Specs](#specs)
* [Install](#install)
* [Usage](#usage)
* [API](#api)
* [Contribute](#contribute)
* [License](#license)

## Specs

The specs for the daemon are currently housed in the go implementation. You can read them at [libp2p/go-libp2p-daemon](https://github.com/libp2p/go-libp2p-daemon/blob/master/specs/README.md)

## Install

`npm install libp2p-daemon-client`

## Usage

### Run a daemon process

There are currently two implementations of the `libp2p-daemon`:

- [js-libp2p-daemon](https://github.com/libp2p/js-libp2p-daemon)
- [go-libp2p-daemon](https://github.com/libp2p/go-libp2p-daemon)

### Interact with the daemon process using the client

```js
const Client = require('libp2p-daemon-client')

const defaultSock = '/tmp/p2pd.sock'
const client = new Client(defaultSock)

// interact with the daemon
let identify
try {
  identify = await client.identify()
} catch (err) {
  // ...
}

// close the socket
await client.close()
```

## API

* [Getting started](API.md#getting-started)
* [`close`](API.md#close)
* [`connect`](API.md#connect)
* [`identify`](API.md#identify)
* [`listPeers`](API.md#listPeers)
* [`openStream`](API.md#openStream)
* [`registerStream`](API.md#registerStream)
* [`dht.put`](API.md#dht.put)
* [`dht.get`](API.md#dht.get)
* [`dht.findPeer`](API.md#dht.findPeer)
* [`dht.provide`](API.md#dht.provide)
* [`dht.findProviders`](API.md#dht.findProviders)
* [`dht.getClosestPeers`](API.md#dht.getClosestPeers)
* [`dht.getPublicKey`](API.md#dht.getPublicKey)

## Contribute

This module is actively under development. Please check out the issues and submit PRs!

## License

MIT © Protocol Labs