import { INewUser } from "./User";

export interface IDecodeToken extends INewUser {
    _id?: string
    newUser?: INewUser
    iat: number
    exp: number
}