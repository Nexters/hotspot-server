import { Request, Response } from 'express'
import { HttpError } from '../middlewares/error'
import { MyPlace } from '../models/my_place'

export default async function findMyPlace(req: Request, res: Response) {
  if (!req.user) {
    throw new HttpError(401, 'Authorization Required')
  }

  const { _id: userId } = req.user
  const { kakaoId } = req.params

  const myPlace = await MyPlace.findOneExceptDeleted({
    userId,
    'place.kakaoId': kakaoId,
  })

  res.send({
    myPlace: myPlace ? myPlace.toUserView() : null,
  })
}
