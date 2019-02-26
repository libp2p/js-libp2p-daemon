'use strict'

const os = require('os')
const { resolve } = require('path')

exports.first = async iterator => {
  for await (const value of iterator) return value
}

exports.last = async iterator => {
  let value
  for await (value of iterator) { }
  return value
}

exports.ends = iterator => {
  iterator.first = () => exports.first(iterator)
  iterator.last = () => exports.last(iterator)
  return iterator
}

/**
 * Converts the multiaddr to a nodejs NET compliant option
 * for .connect or .listen
 * @param {Multiaddr} addr
 * @returns {string|object} A nodejs NET compliant option
 */
exports.multiaddrToNetConfig = function multiaddrToNetConfig (addr) {
  const listenPath = addr.getPath()
  // unix socket listening
  if (listenPath) {
    return resolve(listenPath)
  }
  // tcp listening
  return addr.nodeAddress()
}

exports.isWindows = os.platform() === 'win32'
