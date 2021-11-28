import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParse from 'cookie-parser'
import { connectDB } from './config/database'
import router from './routes/index'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { SocketServer } from './config/socket'

dotenv.config()
const app = express();
const port = process.env.PORT || 5000
const http = createServer(app)
export const io = new Server(http)




connectDB()
    .then(() => {
        console.log('connect DB succeed')
        console.log('start boot server')
    })
    .then(() => {
        bootServer();
    })


const bootServer = () => {  
    io.on('connection',(socket:Socket)=>{
        SocketServer(socket)
    })

    app.use(morgan('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParse())
    app.use(cors())
    app.use('/api', router)

    http.listen(port, () => {
        console.log('App listen on port: ', port)
    })
}