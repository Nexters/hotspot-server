import { Document, DocumentQuery, Model, model, Schema } from 'mongoose'
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

export interface IMyPlaceModel extends Model<IMyPlace> {
  findExceptDeleted(conditions: any): DocumentQuery<IMyPlace[], IMyPlace>
  findOneExceptDeleted(
    conditions: any,
  ): DocumentQuery<IMyPlace | null, IMyPlace>
  existsExceptDeleted(filter: any): Promise<boolean>
}

const schema = new Schema<IMyPlace>(
  {
    _id: String,
    userId: {
      type: String,
      required: true,
    },
    place: {
      kakaoId: {
        type: String,
        required: true,
      },
      kakaoUrl: {
        type: String,
        required: true,
      },
      placeName: {
        type: String,
        required: true,
      },
      categoryName: {
        type: String,
        required: true,
      },
      addressName: String,
      roadAddressName: String,
      x: {
        type: String,
        required: true,
      },
      y: {
        type: String,
        required: true,
      },
    },
    visited: {
      type: Boolean,
      required: true,
    },
    memo: String,
    rating: {
      type: Number,
      min: 1,
      max: 3,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value',
      },
    },
    deletedAt: Date,
  },
  { timestamps: true },
)

schema.index({ userId: 1 })
schema.index({ userId: 1, 'place.kakaoId': 1 })
schema.index({ createdAt: -1 })
schema.index({ deletedAt: 1 })

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

schema.statics.findExceptDeleted = function(conditions: any) {
  return this.find({ ...conditions, deletedAt: null })
}

schema.statics.findOneExceptDeleted = function(conditions: any) {
  return this.findOne({ ...conditions, deletedAt: null })
}

schema.statics.existsExceptDeleted = function(filter: any) {
  return this.exists({ ...filter, deletedAt: null })
}

export const MyPlace = model<IMyPlace, IMyPlaceModel>('user_places', schema)
