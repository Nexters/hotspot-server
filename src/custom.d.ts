import { IUser } from './models/user'

declare global {
  namespace Express {
    // tslint:disable-next-line:interface-name
    interface Request {
      user?: IUser
    }
  }
}
