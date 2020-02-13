import { Request, Response } from 'express'
import { HttpError } from '../middlewares/error'
import { MyPlace } from '../models/my_place'

export default async function getMyPlaces(req: Request, res: Response) {
  if (!req.user) {
    throw new HttpError(401, 'Authorization Required')
  }

  const { _id: userId } = req.user

  const myPlaces = await MyPlace.findExceptDeleted({ userId }).sort({
    createdAt: -1,
  })

  res.send({
    myPlaces: myPlaces.map((myPlace) => myPlace.toUserView()),
    count: myPlaces.length,
  })
}
