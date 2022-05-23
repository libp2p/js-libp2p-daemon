## [@libp2p/daemon-client-v1.0.4](https://github.com/libp2p/js-libp2p-daemon/compare/@libp2p/daemon-client-v1.0.3...@libp2p/daemon-client-v1.0.4) (2022-05-23)


### Bug Fixes

* update deps ([#90](https://github.com/libp2p/js-libp2p-daemon/issues/90)) ([b50eba3](https://github.com/libp2p/js-libp2p-daemon/commit/b50eba3770e47969dbc30cbcf87c41672cd9c175))

## [@libp2p/daemon-client-v1.0.3](https://github.com/libp2p/js-libp2p-daemon/compare/@libp2p/daemon-client-v1.0.2...@libp2p/daemon-client-v1.0.3) (2022-05-10)


### Bug Fixes

* encode enums correctly ([#86](https://github.com/libp2p/js-libp2p-daemon/issues/86)) ([6ce4633](https://github.com/libp2p/js-libp2p-daemon/commit/6ce4633f3db41ab66f9b8b1abbe84955dde3e9be))

## [@libp2p/daemon-client-v1.0.2](https://github.com/libp2p/js-libp2p-daemon/compare/@libp2p/daemon-client-v1.0.1...@libp2p/daemon-client-v1.0.2) (2022-04-20)


### Bug Fixes

* update interfaces and deps ([#84](https://github.com/libp2p/js-libp2p-daemon/issues/84)) ([25173d5](https://github.com/libp2p/js-libp2p-daemon/commit/25173d5b2edf0e9dd9132707d349cdc862caecdb))

## [@libp2p/daemon-client-v1.0.1](https://github.com/libp2p/js-libp2p-daemon/compare/@libp2p/daemon-client-v1.0.0...@libp2p/daemon-client-v1.0.1) (2022-04-07)


### Bug Fixes

* remove protobufjs and replace with protons ([#81](https://github.com/libp2p/js-libp2p-daemon/issues/81)) ([78dd02a](https://github.com/libp2p/js-libp2p-daemon/commit/78dd02a679e55f22c7e24c1ee2b6f92a4679a0b9))


### Trivial Changes

* update aegir to latest version ([#80](https://github.com/libp2p/js-libp2p-daemon/issues/80)) ([3a98959](https://github.com/libp2p/js-libp2p-daemon/commit/3a98959617d9c19bba9fb064defee3d51acfcc29))

## @libp2p/daemon-client-v1.0.0 (2022-03-28)


### ⚠ BREAKING CHANGES

* This module is now ESM only

### Features

* convert to typescript ([#78](https://github.com/libp2p/js-libp2p-daemon/issues/78)) ([f18b2a4](https://github.com/libp2p/js-libp2p-daemon/commit/f18b2a45871a2704db51b03e8583eefdcd13554c))

# [0.11.0](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.10.0...v0.11.0) (2022-01-17)


### Features

* async peerstore ([#110](https://github.com/libp2p/js-libp2p-daemon-client/issues/110)) ([41dc8a5](https://github.com/libp2p/js-libp2p-daemon-client/commit/41dc8a59ce14447b9b5ab7ba9930f4140bda3652))


### BREAKING CHANGES

* peerstore methods are now all async



# [0.10.0](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.9.0...v0.10.0) (2021-12-29)


### chore

* update deps ([#103](https://github.com/libp2p/js-libp2p-daemon-client/issues/103)) ([cdbc4b2](https://github.com/libp2p/js-libp2p-daemon-client/commit/cdbc4b22f3599f33911be1b406b02d06515389b8))


### BREAKING CHANGES

* only node15+ is supported



# [0.9.0](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.7.0...v0.9.0) (2021-11-18)



# [0.7.0](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.6.0...v0.7.0) (2021-07-30)



# [0.6.0](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.5.0...v0.6.0) (2021-05-04)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.4.0...v0.5.0) (2020-08-23)


### Bug Fixes

* replace node buffers with uint8arrays ([#42](https://github.com/libp2p/js-libp2p-daemon-client/issues/42)) ([33be887](https://github.com/libp2p/js-libp2p-daemon-client/commit/33be887))


### BREAKING CHANGES

* - All deps of this module now use uint8arrays in place of node buffers
- DHT keys/values are Uint8Arrays, not Strings or Buffers

* chore: bump daemon dep

Co-authored-by: Jacob Heun <jacobheun@gmail.com>



<a name="0.4.0"></a>
# [0.4.0](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.3.1...v0.4.0) (2020-06-08)



<a name="0.3.1"></a>
## [0.3.1](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.3.0...v0.3.1) (2020-04-20)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.2.2...v0.3.0) (2020-01-31)


### Chores

* update deps ([#18](https://github.com/libp2p/js-libp2p-daemon-client/issues/18)) ([61813b9](https://github.com/libp2p/js-libp2p-daemon-client/commit/61813b9))


### BREAKING CHANGES

* api changed as attach is not needed anymore

* chore: apply suggestions from code review

Co-Authored-By: Jacob Heun <jacobheun@gmail.com>

* chore: update aegir

* chore: update daemon version

Co-authored-by: Jacob Heun <jacobheun@gmail.com>



<a name="0.2.2"></a>
## [0.2.2](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.2.1...v0.2.2) (2019-09-05)



<a name="0.2.1"></a>
## [0.2.1](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.2.0...v0.2.1) (2019-07-09)


### Bug Fixes

* **client.connect:** handle empty response ([#13](https://github.com/libp2p/js-libp2p-daemon-client/issues/13)) ([ace789d](https://github.com/libp2p/js-libp2p-daemon-client/commit/ace789d))
* **client.connect:** handle unspecified error in response ([#12](https://github.com/libp2p/js-libp2p-daemon-client/issues/12)) ([7db681b](https://github.com/libp2p/js-libp2p-daemon-client/commit/7db681b))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.1.2...v0.2.0) (2019-07-09)


### Bug Fixes

* use error as field name instead of ErrorResponse ([#14](https://github.com/libp2p/js-libp2p-daemon-client/issues/14)) ([0ff9eda](https://github.com/libp2p/js-libp2p-daemon-client/commit/0ff9eda))


### BREAKING CHANGES

* errors property name is now `error` instead of `ErrorResponse`



<a name="0.1.2"></a>
## [0.1.2](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.1.1...v0.1.2) (2019-03-29)


### Bug Fixes

* dht find providers stream ([24eb727](https://github.com/libp2p/js-libp2p-daemon-client/commit/24eb727))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.1.0...v0.1.1) (2019-03-25)


### Bug Fixes

* code review feedback ([7fd02d9](https://github.com/libp2p/js-libp2p-daemon-client/commit/7fd02d9))


### Features

* pubsub ([c485f50](https://github.com/libp2p/js-libp2p-daemon-client/commit/c485f50))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/libp2p/js-libp2p-daemon-client/compare/v0.0.4...v0.1.0) (2019-03-22)


### Bug Fixes

* update code to work with latest daemon ([#6](https://github.com/libp2p/js-libp2p-daemon-client/issues/6)) ([0ada86c](https://github.com/libp2p/js-libp2p-daemon-client/commit/0ada86c))



<a name="0.0.4"></a>
## [0.0.4](https://github.com/libp2p/js-libp2p-daemon-client/compare/0.0.3...v0.0.4) (2019-03-15)


### Features

* streams ([7cefefd](https://github.com/libp2p/js-libp2p-daemon-client/commit/7cefefd))



<a name="0.0.3"></a>
## [0.0.3](https://github.com/libp2p/js-libp2p-daemon-client/compare/0.0.2...0.0.3) (2019-02-13)


### Bug Fixes

* connect should use peer id in bytes ([b9e4e44](https://github.com/libp2p/js-libp2p-daemon-client/commit/b9e4e44))



<a name="0.0.2"></a>
## [0.0.2](https://github.com/libp2p/js-libp2p-daemon-client/compare/e748b7c...0.0.2) (2019-02-11)


### Bug Fixes

* code review ([6ae7ce0](https://github.com/libp2p/js-libp2p-daemon-client/commit/6ae7ce0))
* code review ([80e3d62](https://github.com/libp2p/js-libp2p-daemon-client/commit/80e3d62))
* main on package.json ([8fcc62b](https://github.com/libp2p/js-libp2p-daemon-client/commit/8fcc62b))


### Features

* initial implementation ([e748b7c](https://github.com/libp2p/js-libp2p-daemon-client/commit/e748b7c))
