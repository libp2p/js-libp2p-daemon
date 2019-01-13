libp2p-daemon JavaScript implementation
======

<a href="http://libp2p.io/"><img src="https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square" /></a>
<a href="http://webchat.freenode.net/?channels=%23libp2p"><img src="https://img.shields.io/badge/freenode-%23libp2p-yellow.svg?style=flat-square" /></a>
<a href="https://waffle.io/libp2p/libp2p"><img src="https://img.shields.io/badge/pm-waffle-yellow.svg?style=flat-square" /></a>

> A standalone deployment of a libp2p host, running in its own OS process and installing a set of virtual endpoints to enable co-local applications to: communicate with peers, handle protocols, interact with the DHT, participate in pubsub, etc. no matter the language they are developed in, nor whether a native libp2p implementation exists in that language.

## Lead Maintainer

[Jacob Heun](https://github.com/jacobheun)

## Specs

The specs for the daemon are currently housed in the go implementation. You can read them at [libp2p/go-libp2p-daemon](https://github.com/libp2p/go-libp2p-daemon/blob/master/specs/README.md)

## Install

```
npm i -g libp2p-daemon
```

## Usage

For a full list of options, you can run help `jsp2pd --help`.
Running the defaults, `jsp2pd`, will start the daemon and bind it to a local unix socket path.
Daemon clients will be able to communicate with the daemon over that unix socket.

## Contribute

This module is actively under development. Please check out the issues and submit PRs!

## License

MIT © Protocol Labs
