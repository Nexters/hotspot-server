import { Request, Response } from 'express'
import uuidv4 from 'uuid/v4'

import { HttpError } from '../middlewares/error'
import { IMyPlace, MyPlace } from '../models/my_place'

export default async function createMyPlace(req: Request, res: Response) {
  if (!req.user) {
    throw new HttpError(401, 'Authorization Required')
  }

  const { _id: userId } = req.user
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

  if (
    await MyPlace.existsExceptDeleted({
      userId,
      'place.kakaoId': place.kakaoId,
    })
  ) {
    throw new HttpError(403, 'Place Already Exists')
  }

  const newMyPlace = new MyPlace({
    _id: uuidv4(),
    userId,
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
  } as IMyPlace)

  await newMyPlace.save()

  res.send({
    myPlace: newMyPlace.toUserView(),
  })
}
