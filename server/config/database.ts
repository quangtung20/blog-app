import mongoose, { ConnectOptions } from 'mongoose'
import config from './default'


export const connectDB = async () => {
    await mongoose.connect(config.dbUri)
}