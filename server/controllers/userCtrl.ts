import { Request, Response } from 'express'
import { IAuth } from '../interfaces/Auth'
import Users from '../models/userModel'
import bcrypt from 'bcrypt'

const userCtrl = {
    updateUser: async(req:IAuth,res:Response)=>{
        try {
            const check = req.user
            if(!check){
                return res.status(400).json({msg: "Invalid Authentication."})
            }
            const {name,avatar} = req.body

            const updateUser = await Users.findOneAndUpdate({_id:check._id},{
                name,
                avatar
            })
            if(!updateUser) {
                throw new Error('error from database')
            }
            return res.json({ msg: "Update Success!" })

        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    },
    resetPassword:async(req:IAuth,res:Response)=>{
        try {
            const user = req.user
            if(!user) {
                return res.status(400).json({msg: "Invalid Authentication."})
            }
            if(user.type !== 'register'){
                return res.status(400).json({msg: `You're use login with ${user.type}, you can't use this function`})
            }

            const {password} = req.body
            const passHash = await bcrypt.hash(password,12)

            await Users.findOneAndUpdate({_id:user._id},{password:passHash})

            res.json({ msg: "Reset Password Success!" })
            

        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUser:async(req:Request,res:Response)=>{
        try {
            const user = await Users.findById(req.params.id).select('-password')
            res.json(user)
        } catch (err:any) {
            return res.status(500).json({msg: err.message})
        }
    }
}


export default userCtrl