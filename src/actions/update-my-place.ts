import { Request, Response } from 'express'
import { HttpError } from '../middlewares/error'
import { MyPlace } from '../models/my_place'

export default async function updateMyPlace(req: Request, res: Response) {

  if (!req.user) {
    throw new HttpError(401, 'Authorization Required')
  }
  const { _id: userId } = req.user
  const { userPlaceId } = req.params
  const {
    place,
    visited,
    memo,
    rating,
    images,
    bestMenu,
    businessHours,
    priceRange,
    parkingAvailable,
    allDayAvailable,
    powerPlugAvailable,
  } = req.body

  const findMyPlace = await MyPlace.findById({ _id: userPlaceId })

  if (!findMyPlace) {
    throw new HttpError(404, 'Place Not Exists')
  }

  if (findMyPlace.userId !== userId) {
    throw new HttpError(403, 'This Place Is Not Registered By This User.')
  }

  const updateMyPlace = findMyPlace
//   updateMyPlace ({ visited})
  await findMyPlace.save()
  res.send({
    myPlace: findMyPlace.toUserView(),
  })
}
