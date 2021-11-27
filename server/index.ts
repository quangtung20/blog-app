import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParse from 'cookie-parser'
import { connectDB } from './config/database'
import router from './routes/index'

dotenv.config()

const app = express();
const port = process.env.PORT || 5000

connectDB()
    .then(() => {
        console.log('connect DB succeed')
        console.log('start boot server')
    })
    .then(() => {
        bootServer();
    })


const bootServer = () => {

    app.use(morgan('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParse())
    app.use(cors())
    app.use('/api', router)

    app.listen(port, () => {
        console.log('App listen on port: ', port)
    })
}