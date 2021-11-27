import { Request } from 'express'
import { IUser } from './User';
export interface IAuth extends Request {
    user?:IUser
}