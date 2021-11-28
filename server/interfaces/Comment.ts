import { Document } from 'mongoose'

export interface IComment extends Document {
    user:string
    blog_id:string
    blog_user_id:string
    content:string
    replyCM:string[]
    reply_user:string
    comment_root: string
    _doc:object
}