import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken"
import { IAuth } from '../interfaces/Auth'
import { IDecodeToken } from '../interfaces/DecodeToken'
import { IUser } from '../interfaces/User'
import Users from '../models/userModel'

export const auth = async(req:IAuth,res:Response,next:NextFunction)=>{
    try {
        
        const token = req.header('authorization')
        if(!token) {
            return res.status(400).json({msg: "Invalid Authentication."})
        }

        const decoded = <IDecodeToken>jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
        if(!decoded) {
            return res.status(400).json({msg: "Invalid Authentication."})
        }
        console.log('day la decode: ',decoded)

        const user = await Users.findOne({_id:decoded._id}).select("-password")
        if(!user) {
            return res.status(400).json({msg: "User does not exist"})
        }

        req.user = user

        next()
    } catch (err:any) {
        return res.status(500).json({msg: err.message})
    }
}