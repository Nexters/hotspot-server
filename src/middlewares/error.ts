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
  if (err instanceof HttpError) {
    res.status(err.status).send({
      message: err.message,
    })
  } else {
    console.error(err)
    res.status(500).send({
      message: 'Unexpected Error',
    })
  }
}
