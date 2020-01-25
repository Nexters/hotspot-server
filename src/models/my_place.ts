import { Document, model, Schema } from 'mongoose'
import { IPlace } from './types/place'

export interface IMyPlace extends Document {
  _id: string
  userId: string
  place: IPlace
  visited: boolean
  memo?: string
  rating?: number
}

const schema = new Schema({
  _id: String,
  userId: String,
  place: {
    kakaoId: String,
    kakaoUrl: String,
    placeName: String,
    addressName: String,
    roadAddressName: String,
    x: String,
    y: String,
  },
  visited: Boolean,
  memo: String,
  rating: Number,
})

schema.index({ userId: 1, 'place.kakaoId': 1 }, { unique: true })

export const MyPlace = model<IMyPlace>('user_places', schema)
