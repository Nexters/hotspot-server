import { Request, Response } from 'express'
import { HttpError } from '../middlewares/error'
import { MyPlace } from '../models/my_place'

export default async function deleteMyPlace(req: Request, res: Response) {
  if (!req.user) {
    throw new HttpError(401, 'Authorization Required')
  }

  const { _id: userId } = req.user
  const { userPlaceId } = req.params

  if (!(await MyPlace.exists({ userId, _id: userPlaceId }))) {
    throw new HttpError(404, 'Place Not Exists')
  }
  const myPlace = await MyPlace.updateOne(
    { userId, _id: userPlaceId },
    { $currentDate: { deletedAt: true } },
  )

  res.send({
    myPlace,
  })
}
