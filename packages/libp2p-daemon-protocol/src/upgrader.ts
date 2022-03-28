import type { Upgrader } from '@libp2p/interfaces/transport'

export const passThroughUpgrader: Upgrader = {
  // @ts-expect-error should return a connection
  upgradeInbound: async maConn => maConn,
  // @ts-expect-error should return a connection
  upgradeOutbound: async maConn => maConn
}
