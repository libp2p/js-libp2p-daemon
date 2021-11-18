# [0.8.0](https://github.com/libp2p/js-libp2p-daemon/compare/v0.7.0...v0.8.0) (2021-11-18)


### chore

* update dht ([#49](https://github.com/libp2p/js-libp2p-daemon/issues/49)) ([b1f1aaa](https://github.com/libp2p/js-libp2p-daemon/commit/b1f1aaab3466ec7ac693dcb5a211cd119aaa4f95))


### BREAKING CHANGES

* The DHT is now enabled by default



# [0.7.0](https://github.com/libp2p/js-libp2p-daemon/compare/v0.6.1...v0.7.0) (2021-07-30)



## [0.6.1](https://github.com/libp2p/js-libp2p-daemon/compare/v0.6.0...v0.6.1) (2021-06-11)



# [0.6.0](https://github.com/libp2p/js-libp2p-daemon/compare/v0.5.2...v0.6.0) (2021-05-03)


### chore

* update libp2p 0.31 ([#46](https://github.com/libp2p/js-libp2p-daemon/issues/46)) ([6625eba](https://github.com/libp2p/js-libp2p-daemon/commit/6625ebaa6027cee7cd8d08de09035f0edc894c1a))


### BREAKING CHANGES

* secio removed and noise is now default crypto, multiaddr@9 and libp2p@31



## [0.5.2](https://github.com/libp2p/js-libp2p-daemon/compare/v0.2.3...v0.5.2) (2021-02-16)


### Bug Fixes

* replace node buffers with uint8arrays ([#41](https://github.com/libp2p/js-libp2p-daemon/issues/41)) ([cd009d5](https://github.com/libp2p/js-libp2p-daemon/commit/cd009d5e1f83724f907dd7f84239679633e8d197))


### Features

* add support for specifying noise ([#32](https://github.com/libp2p/js-libp2p-daemon/issues/32)) ([e5582cd](https://github.com/libp2p/js-libp2p-daemon/commit/e5582cdd00b7601cfe8ecc2b0d61a66bad71ab8a))
* specify libp2p dependency through env ([#30](https://github.com/libp2p/js-libp2p-daemon/issues/30)) ([07b0695](https://github.com/libp2p/js-libp2p-daemon/commit/07b0695157da539774de75f2316748164fdbd72d))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/libp2p/js-libp2p-daemon/compare/v0.5.0...v0.5.1) (2020-08-26)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/libp2p/js-libp2p-daemon/compare/v0.4.0...v0.5.0) (2020-08-23)


### Bug Fixes

* replace node buffers with uint8arrays ([#41](https://github.com/libp2p/js-libp2p-daemon/issues/41)) ([cd009d5](https://github.com/libp2p/js-libp2p-daemon/commit/cd009d5))


### BREAKING CHANGES

* - All deps of this module now use uint8arrays in place of node buffers

* chore: bump deps

Co-authored-by: Jacob Heun <jacobheun@gmail.com>



<a name="0.4.0"></a>
# [0.4.0](https://github.com/libp2p/js-libp2p-daemon/compare/v0.3.1...v0.4.0) (2020-06-05)



<a name="0.3.1"></a>
## [0.3.1](https://github.com/libp2p/js-libp2p-daemon/compare/v0.3.0...v0.3.1) (2020-04-22)


### Features

* add support for specifying noise ([#32](https://github.com/libp2p/js-libp2p-daemon/issues/32)) ([e5582cd](https://github.com/libp2p/js-libp2p-daemon/commit/e5582cd))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/libp2p/js-libp2p-daemon/compare/v0.2.3...v0.3.0) (2020-01-31)


### Features

* specify libp2p dependency through env ([#30](https://github.com/libp2p/js-libp2p-daemon/issues/30)) ([07b0695](https://github.com/libp2p/js-libp2p-daemon/commit/07b0695))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/libp2p/js-libp2p-daemon/compare/v0.2.2...v0.2.3) (2019-08-26)


### Bug Fixes

* **tests:** fix secp256k1 test ([#26](https://github.com/libp2p/js-libp2p-daemon/issues/26)) ([fc46dbb](https://github.com/libp2p/js-libp2p-daemon/commit/fc46dbb))


### Features

* integrate gossipsub by default ([#19](https://github.com/libp2p/js-libp2p-daemon/issues/19)) ([2959fc8](https://github.com/libp2p/js-libp2p-daemon/commit/2959fc8))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/libp2p/js-libp2p-daemon/compare/v0.2.1...v0.2.2) (2019-07-10)


### Bug Fixes

* **bin:** exit with status 1 on unhandled rejection ([#23](https://github.com/libp2p/js-libp2p-daemon/issues/23)) ([596005d](https://github.com/libp2p/js-libp2p-daemon/commit/596005d))
* **main:** deal with unhandled rejections ([#20](https://github.com/libp2p/js-libp2p-daemon/issues/20)) ([49e685a](https://github.com/libp2p/js-libp2p-daemon/commit/49e685a))
* **package.json:** fix main property ([#22](https://github.com/libp2p/js-libp2p-daemon/issues/22)) ([1d505b8](https://github.com/libp2p/js-libp2p-daemon/commit/1d505b8))
* resolve loading of private key from file ([#21](https://github.com/libp2p/js-libp2p-daemon/issues/21)) ([3e70ace](https://github.com/libp2p/js-libp2p-daemon/commit/3e70ace))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/libp2p/js-libp2p-daemon/compare/v0.2.0...v0.2.1) (2019-04-29)


### Bug Fixes

* peer info ([#17](https://github.com/libp2p/js-libp2p-daemon/issues/17)) ([69cf26b](https://github.com/libp2p/js-libp2p-daemon/commit/69cf26b))


### Features

* add support initial peerstore support ([#14](https://github.com/libp2p/js-libp2p-daemon/issues/14)) ([36a520c](https://github.com/libp2p/js-libp2p-daemon/commit/36a520c))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/libp2p/js-libp2p-daemon/compare/v0.1.2...v0.2.0) (2019-03-20)


### Bug Fixes

* decapsulate ipfs protocol on daemon startup ([#11](https://github.com/libp2p/js-libp2p-daemon/issues/11)) ([190df09](https://github.com/libp2p/js-libp2p-daemon/commit/190df09))


### Features

* add pubsub support ([#12](https://github.com/libp2p/js-libp2p-daemon/issues/12)) ([5d27b90](https://github.com/libp2p/js-libp2p-daemon/commit/5d27b90))
* add support for unix multiaddr listen ([#10](https://github.com/libp2p/js-libp2p-daemon/issues/10)) ([9106d68](https://github.com/libp2p/js-libp2p-daemon/commit/9106d68))


### BREAKING CHANGES

* The --sock param/flag has been replaced by --listen, which now expects a multiaddr string.

Example: `jsp2pd --sock=/tmp/p2p.sock` would now be `jsp2pd --listen=/unix/tmp/p2p.sock`

* feat: add support for unix multiaddr listen
* feat: add support for hostAddrs flag
* feat: add support for websockets
* feat: add announceAddrs support
* test: split up tests into files
* feat: use multiaddr instead of path for everything
* feat: update stream handler to use multiaddr bytes
* chore: fix lint
* chore: update multiaddr dep
* test: fix test runners
* fix: add a default host address
* fix: catch decapsulate errors when no ipfs present
* chore: fix feedback



<a name="0.1.2"></a>
## [0.1.2](https://github.com/libp2p/js-libp2p-daemon/compare/v0.1.1...v0.1.2) (2019-02-14)


### Bug Fixes

* remove ipfs from identify multiaddrs ([7cee6ea](https://github.com/libp2p/js-libp2p-daemon/commit/7cee6ea))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/libp2p/js-libp2p-daemon/compare/v0.1.0...v0.1.1) (2019-02-13)


### Bug Fixes

* connect should use peer id in bytes ([021b006](https://github.com/libp2p/js-libp2p-daemon/commit/021b006))



<a name="0.1.0"></a>
# 0.1.0 (2019-01-31)


### Features

* initial implementation of the libp2p daemon spec ([#1](https://github.com/libp2p/js-libp2p-daemon/issues/1)) ([383a6bd](https://github.com/libp2p/js-libp2p-daemon/commit/383a6bd))



