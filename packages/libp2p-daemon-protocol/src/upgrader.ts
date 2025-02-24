import type { Connection, MultiaddrConnection, Upgrader } from '@libp2p/interface'

export interface OnConnection {
  (conn: MultiaddrConnection): void
}

export class PassThroughUpgrader implements Upgrader {
  private readonly onConnection?: OnConnection

  constructor (handler?: OnConnection) {
    this.onConnection = handler
  }

  async upgradeInbound (maConn: MultiaddrConnection): Promise<void> {
    this.onConnection?.(maConn)
  }

  async upgradeOutbound (maConn: MultiaddrConnection): Promise<Connection> {
    // @ts-expect-error should return a connection
    return maConn
  }
}
