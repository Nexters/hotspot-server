import { Request, Response } from 'express'
import { HttpError } from '../middlewares/error'
import { IMyPlace, MyPlace } from '../models/my_place'

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

  const myPlace = await MyPlace.findOneExceptDeleted({ _id: userPlaceId })

  if (!myPlace) {
    throw new HttpError(404, 'Place Not Exists')
  }

  if (myPlace.userId !== userId) {
    throw new HttpError(403, 'This Place Is Not Registered By This User.')
  }

  myPlace.set({
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
  })

  myPlace.save()

  res.send({
    myPlace: myPlace.toUserView(),
  })
}
