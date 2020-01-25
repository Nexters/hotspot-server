import { NextFunction, Request, Response } from 'express'
import { User } from '../models/user'
import { HttpError } from './error'

export async function handleAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.headers.authorization) {
    next()
    return
  }

  if (!req.headers.authorization.startsWith('Bearer')) {
    throw new HttpError(401, 'Authentication Failed')
  }

  const accessToken = req.headers.authorization.split('Bearer ')[1]

  const user = await User.findOne({
    accessToken,
  })

  if (!user) {
    throw new HttpError(401, 'Authentication Failed')
  }

  req.user = user
  next()
}
