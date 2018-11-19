const chai = require('chai')
const expect = chai.expect
const { createDaemon } = require('../src/daemon')
const { createLibp2p } = require('../src/libp2p')

describe('daemon', () => {
  it('should be able to  start and stop the daemon', async () => {
    const daemon = await createDaemon({
      quiet: false,
      q: false,
      bootstrap: false,
      b: false,
      dht: false,
      dhtClient: false,
      connMgr: false,
      sock: '/tmp/p2pd.sock',
      id: '',
      bootstrapPeers: ''
    })

    await daemon.start()
    await daemon.stop()
  })
})