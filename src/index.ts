import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import loginKakao from './actions/login'
import dotenv from 'dotenv'

import { searchPlace } from './actions/place'
import { handleHttpError } from './middlewares/error'
import { initializeDb } from './mongodb-client'

function asyncTryCatchWrapper(
  asyncFn: (req: Request, res: Response, next: NextFunction) => void,
) {
  return async function wrappedAsyncFn(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      return await asyncFn(req, res, next)
    } catch (e) {
      return next(e)
    }
  }
}

async function init() {
  await initializeDb()

  const app = express()
  dotenv.config();
  
  app.get('/health', (req, res) => res.send())

  app.use(morgan('combined'))
  app.use(express.json())

  app.post('/auth/login/kakao', asyncTryCatchWrapper(loginKakao))
  app.post('/place/search', asyncTryCatchWrapper(searchPlace))

  app.use(handleHttpError)

  app.listen(3000, () => console.log(`Hotspot server listening on port 3000!`))
}

init()
