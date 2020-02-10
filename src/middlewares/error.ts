import { NextFunction, Request, Response } from 'express'
import { MulterError } from 'multer'

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
  } else if (err instanceof MulterError && err.code === 'LIMIT_FILE_COUNT') {
    res.status(403).send({
      message: 'Too many files',
    })
  } else {
    console.error(err)
    res.status(500).send({
      message: 'Unexpected Error',
    })
  }
}
