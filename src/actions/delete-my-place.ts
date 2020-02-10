import { Request, Response } from 'express'
import { HttpError } from '../middlewares/error'
import { MyPlace } from '../models/my_place'

export default async function deleteMyPlace(req: Request, res: Response) {
  if (!req.user) {
    throw new HttpError(401, 'Authorization Required')
  }

  const { _id: userId } = req.user
  const { userPlaceId } = req.params

  const findMyPlace = await MyPlace.findById({ _id: userPlaceId })

  if (!findMyPlace) {
    throw new HttpError(404, 'Place Not Exists')
  }

  if (findMyPlace.userId !== userId) {
    throw new HttpError(403, 'This Place Is Not Registered By This User.')
  }

  const myPlace = await MyPlace.updateOne(
    { userId, _id: userPlaceId },
    { $currentDate: { deletedAt: true } },
  )

  res.send({
    myPlace,
  })
}
