import { Document, model, Schema } from 'mongoose'
import { IPlace } from './types/place'

export interface IMyPlaceUserView {
  id: string
  userId: string
  place: IPlace
  visited: boolean
  memo?: string
  rating?: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface IMyPlace extends Document {
  _id: string
  userId: string
  place: IPlace
  visited: boolean
  memo?: string
  rating?: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  toUserView(): IMyPlaceUserView
}

const schema = new Schema<IMyPlace>(
  {
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
    deletedAt: Date,
  },
  { timestamps: true },
)

schema.index({ userId: 1 })
schema.index({ userId: 1, 'place.kakaoId': 1 }, { unique: true })
schema.index({ updatedAt: -1 })

// tslint:disable-next-line:only-arrow-functions
schema.methods.toUserView = function(): IMyPlaceUserView {
  return {
    id: this.id,
    userId: this.userId,
    place: this.place,
    visited: this.visited,
    memo: this.memo,
    rating: this.rating,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const MyPlace = model<IMyPlace>('user_places', schema)
