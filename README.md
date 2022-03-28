# js-libp2p-daemon

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://protocol.ai)
[![](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![](https://img.shields.io/badge/freenode-%23libp2p-yellow.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23libp2p)
[![](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg)](https://discuss.libp2p.io)
[![codecov](https://img.shields.io/codecov/c/github/libp2p/js-libp2p-interfaces.svg?style=flat-square)](https://codecov.io/gh/libp2p/js-libp2p-interfaces)
[![test & maybe release](https://github.com/libp2p/js-libp2p-daemon/actions/workflows/js-test-and-release.yml/badge.svg)](https://github.com/libp2p/js-libp2p-daemon/actions/workflows/js-test-and-release.yml)

> Standalone libp2p executable

## Structure

* [`/packages/libp2p-daemon`](./packages/libp2p-daemon) The CLI tool - starts an instance of the server
* [`/packages/libp2p-daemon-client`](./packages/libp2p-daemon-client) A client to talk to libp2p-daemon instances
* [`/packages/libp2p-daemon-protocol`](./packages/libp2p-daemon-protocol) The wire protocol used by the client/server
* [`/packages/libp2p-daemon-server`](./packages/libp2p-daemon-server) An RPC server controllable by the client

## Contribute

Feel free to join in. All welcome. Open an [issue](https://github.com/libp2p/js-interfaces/issues)!

This repository falls under the IPFS [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md).

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/contributing.md)

## License

[Apache-2.0](LICENSE-APACHE) or [MIT](LICENSE-MIT) © Protocol Labs
