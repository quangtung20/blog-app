import { Document } from 'mongoose'

export interface IBlog extends Document{
    user:string
    title:string
    content:string
    description:string
    thumbnail:string
    category:string
    _doc:object
}