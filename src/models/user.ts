import { Document, model, Schema } from 'mongoose'

export interface IUser extends Document {
  _id: string
  accessToken?: string
  social_account?: {
    kakao: {
      id: number
      nickname: string
      profileImage: string
      email: string
      ageRange: string
      gender: string
    }
  }
}

const schema = new Schema({
  _id: String,
  accessToken: String,
  social_account: {
    kakao: {
      id: Number,
      nickname: String,
      profileImage: String,
      email: String,
      ageRange: String,
      gender: String,
    },
  },
})

export const User = model<IUser>('users', schema)
