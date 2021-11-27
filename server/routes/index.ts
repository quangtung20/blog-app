import authRouter from './authRoute'
import userRouter from './userRoute'
import categoryRouter from './categoryRoute'
import express, { Router } from 'express'
import blogRouter from './blogRoute'

const router = express.Router()

router.use('/',authRouter)
router.use('/',userRouter)
router.use('/',categoryRouter)
router.use('/',blogRouter)

export default router