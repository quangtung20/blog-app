import { Document } from 'mongoose'
export interface INewUser {
    name: string
    account: string
    password: string
    type?:string
}

export interface IUser extends Document {
    name: string
    account: string
    password: string
    avatar: string
    role: string
    type: string
    rf_token?:string
    _doc: object // vi data chua nhieu thong tin ko can thiet nen _doc de lay noi dung data 
}

export interface IGgUser {
    email: string
    email_verified: boolean
    name: string
    picture: string
}

export interface IGUserParams {
    name: string
    account: string
    password: string
    avatar?: string
    type: string
}