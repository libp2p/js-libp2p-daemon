# libp2p-daemon JavaScript implementation <!-- omit in toc -->

<a href="http://libp2p.io/"><img src="https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square" /></a>
<a href="http://webchat.freenode.net/?channels=%23libp2p"><img src="https://img.shields.io/badge/freenode-%23libp2p-yellow.svg?style=flat-square" /></a>
<a href="https://discuss.libp2p.io"><img src="https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg" /></a>

> A standalone deployment of a libp2p host, running in its own OS process and installing a set of virtual endpoints to enable co-local applications to: communicate with peers, handle protocols, interact with the DHT, participate in pubsub, etc. no matter the language they are developed in, nor whether a native libp2p implementation exists in that language.

## Table of contents <!-- omit in toc -->

- [Specs](#specs)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Specs

The specs for the daemon are currently housed in the go implementation. You can read them at [libp2p/go-libp2p-daemon](https://github.com/libp2p/go-libp2p-daemon/blob/master/specs/README.md)

## Install

```
npm i -g @libp2p/daemon-server
```

## Usage

```js
import { createServer } from '@libp2p/daemon-server'
import { createLibp2p } from 'libp2p'

const libp2p = await createLibp2p({
  // .. config
})

const multiaddr = new Multiaddr('/ip4/0.0.0.0/tcp/0')

const server = await createServer(multiaddr, libp2p)
await server.start()
```

## Contribute

This module is actively under development. Please check out the issues and submit PRs!

## License

[Apache-2.0](LICENSE-APACHE) or [MIT](LICENSE-MIT) © Protocol Labs
