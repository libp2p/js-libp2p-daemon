import { IResponse, Response } from '@libp2p/daemon-protocol'

/**
 * Creates and encodes an OK response
 */
export function OkResponse (data?: Partial<IResponse>): Uint8Array {
  return Response.encode({
    type: Response.Type.OK,
    ...data
  }).finish()
}

/**
 * Creates and encodes an ErrorResponse
 */
export function ErrorResponse (err: Error): Uint8Array {
  return Response.encode({
    type: Response.Type.ERROR,
    error: {
      msg: err.message
    }
  }).finish()
}
