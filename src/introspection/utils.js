// https://github.com/libp2p/observer-toolkit/blob/0a6a2368bdc939c297319378b25508c464419851/packages/samples/mock/utils.js
'use strict'

const base32 = require('base32.js')
const { fnv1a } = require('@libp2p/observer-proto')

const DEFAULT_CONNECTIONS = 20
const DEFAULT_PEERS = 30
const DEFAULT_SNAPSHOT_DURATION = 2000 // Miliseconds
const DEFAULT_CUTOFFTIME_SECONDS = 120

const GIGABYTE_IN_BYTES = 1e9

function createBufferSegment (packet) {
  const { buffer, byteLength } = packet.serializeBinary()
  const contentBuffer = Buffer.from(buffer)
  const checksum = fnv1a(contentBuffer)

  // Mimics the output format of go-libp2p-introspection's ws writer.
  // First is a 4-byte LE integer that is a checksum for the following buffer
  // Then a 4-byte LE integer stating the byte length of a state / timebar position.
  const metaBuffer = Buffer.alloc(8)
  metaBuffer.writeUIntLE(checksum, 0, 4)
  metaBuffer.writeUIntLE(byteLength, 4, 4)

  return Buffer.concat([metaBuffer, contentBuffer])
}

function encodeNumToBin (num) {
  const buf = Buffer.alloc(4)
  buf.writeUIntLE(num, 0, 4)
  return buf
}

function decodeBinToNum (buf, offset = 0) {
  return buf.readUIntLE(offset, 4)
}

function mapArray(size, map) {
  // create a new array of predefined size and fill with values from map function
  return Array.apply(null, Array(size)).map(map)
}

function createTimestamp (utcNum) {
  if (typeof utcNum !== 'number' || Number.isNaN(utcNum)) {
    throw new Error(
      `Can't create timestamp from ${utcNum} (typeof ${typeof utcNum}), must be number`
    )
  }
  return Math.round(utcNum) // new Timestamp([Math.round(utcNum)])
}

function getRandomiser() {
  // Use real random numbers in real mocks, consistent ones in tests

  const isTest = !!process.env.TAP

  // The *tiny* but real chance of Math.random() returning actual 0 is an edge case we don't need
  const randomAndTruthy = () => Math.random() || randomAndTruthy()
  /* istanbul ignore if */
  if (!isTest) return randomAndTruthy

  let index = 0
  const pseudoRandom = () => {
    // Avoid flakey test failures with varied but consistent values
    index = index < 39 ? index + 1 : 1
    const decimal = (index / 4) * 0.1
    // 0.025, 0.95, 0.075, 0.9, 0.125, 0.85...
    return index % 2 ? decimal : 1 - decimal
  }
  return pseudoRandom
}

const random = getRandomiser()

// Adapted from https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randomNormalDistribution ({ min, max, skew }) {
  let u = random()
  let v = random()
  let num = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  num = num / 10 + 0.5

  /* istanbul ignore if : prevent unlikely cases that break the maths */
  if (num > 1 || num < 0) return randomNormalDistribution(min, max, skew)

  num = Math.pow(num, skew) // higher skew => lower values
  return num * (max - min) + min
}

function randomBandwidth () {
  return Math.round(
    randomNormalDistribution({
      min: 1,
      max: GIGABYTE_IN_BYTES,
      skew: 6, // Mean of around 15 mbs / second per stream
    })
  )
}

function randomFluctuationMultiplier () {
  return randomNormalDistribution({
    min: 0.5,
    max: 2,
    skew: 1.6, // Mean of around 1 so fluctuations don't trend up or down
  })
}

function randomLatency () {
  // TODO: get more info on expected values here
  return Math.round(
    randomNormalDistribution({
      min: 1,
      max: 1e9,
      skew: 9, // Mean around 6 ms or 6e+6 ns
    })
  )
}

/**
 * Encode a given Uint8Array into a base32 string.
 * @param {Uint8Array} buf
 * @returns {string}
 */
function encodeBase32 (buf) {
  const enc = new base32.Encoder()
  return enc.write(buf).finalize()
}

module.exports = {
  DEFAULT_CONNECTIONS,
  DEFAULT_PEERS,
  DEFAULT_SNAPSHOT_DURATION,
  DEFAULT_CUTOFFTIME_SECONDS,
  createBufferSegment,
  createTimestamp,
  encodeNumToBin,
  decodeBinToNum,
  randomBandwidth,
  randomFluctuationMultiplier,
  randomLatency,
  mapArray,
  encodeBase32
}
