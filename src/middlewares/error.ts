import { NextFunction, Request, Response } from 'express'

export class HttpError extends Error {
  public status: number

  constructor(status: number, message: string) {
    super()
    this.status = status
    this.message = message
  }
}

export function handleHttpError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = err instanceof HttpError ? err.status : 500

  res.status(status).send({
    message: err.message,
  })
}
