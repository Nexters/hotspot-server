import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import createMyPlace from './actions/create-my-place'
import findMyPlace from './actions/find-my-place'
import getMyPlaces from './actions/get-my-places'
import loginKakao from './actions/login'
import { searchPlace } from './actions/place'
import { handleAuth } from './middlewares/auth'
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

  app.get('/health', (req, res) => res.send())

  app.use(morgan('combined'))
  app.use(express.json())
  app.use(asyncTryCatchWrapper(handleAuth))

  app.post('/auth/login/kakao', asyncTryCatchWrapper(loginKakao))
  app.get('/place/search', asyncTryCatchWrapper(searchPlace))
  app.post('/place/my_places', asyncTryCatchWrapper(createMyPlace))
  app.get('/place/my_places', asyncTryCatchWrapper(getMyPlaces))
  app.get('/place/find/:kakaoId', asyncTryCatchWrapper(findMyPlace))

  app.use(handleHttpError)

  app.listen(3000, () => console.log(`Hotspot server listening on port 3000!`))
}

init()
