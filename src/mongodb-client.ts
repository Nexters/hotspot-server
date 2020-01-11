import { connect } from 'mongoose'
import { MONGO_URL } from './config'

export async function initializeDb() {
  await connect(MONGO_URL, { useNewUrlParser: true })
}
