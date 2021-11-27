import mongoose, { Schema } from 'mongoose'
import { IUser } from '../interfaces/User'

const userSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add your name"],
        trim: true,
        maxlength: [20, "your name is up to 20 char long"]
    },
    account: {
        type: String,
        required: [true, "please add your email or phone"],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "please type your password"],
        minlength: [6, "password must be at least 6 chars"]
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png',
    },
    role: {
        type: String,
        default: 'user' // admin
    },
    type: {
        type: String,
        default: 'register' // fast
    }
}, {
    timestamps: true
})

export default mongoose.model<IUser>('user', userSchema) 