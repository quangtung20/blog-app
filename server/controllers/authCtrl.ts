import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { token } from '../config/generateToken'
import { sendEmail } from '../config/sendMail'
import { sendSms, smsOTP, smsVerify } from '../config/sendSMS'
import { validateEmail } from '../middleware/valid'
import Users from '../models/userModel'
import jwt from "jsonwebtoken"
import { IDecodeToken } from '../interfaces/DecodeToken'
import { IGgUser, IUser, IGUserParams, INewUser } from '../interfaces/User'
import { IAuth } from '../interfaces/Auth'
import fetch from 'node-fetch'
import { OAuth2Client } from 'google-auth-library'

const CLIENT_URL = `${process.env.BASE_URL}`

const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`)



const authCtrl = {
    register: async (req: Request, res: Response) => {
        try {
            const { name, account, password } = req.body
            const user = await Users.findOne({ account: account })

            if (user) throw new Error('Your email or phone number has already exists')

            const passHash = await bcrypt.hash(password, 12)
            const newUser = { name, account, password: passHash }
            const active_token = token.generateActiveToken({ newUser })
            const url = `${CLIENT_URL}/active/${active_token}`
            if (validateEmail(account)) {
                sendEmail(account, url, "verify your email address")
                return res.status(200).json({ msg: 'Done, please check your email. ' })
            } else {
                sendSms(account, url, "verify your phone number")
                return res.status(200).json({ msg: 'Done, please check your phone number. ' })
            }

        } catch (err: any) {
            return res.status(500).json({ msg: err.message })
        }
    },

    activeAccount: async (req: Request, res: Response) => {
        try {
            const { active_token } = req.body
            const decode = <IDecodeToken>jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
            const { newUser } = decode

            if (!newUser) return res.status(400).json({ msg: "Invalid authentication " })
            const checkUser = await Users.findOne({ account: newUser.account })
            if (checkUser) return res.status(400).json({ msg: "This account has been already exists " })

            const savedUser = new Users(newUser)
            await savedUser.save()
            res.json({ msg: "Account has been activated!" })

        } catch (err: any) {
            return res.status(500).json({ msg: 'authentic failed' })
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const { account, password } = req.body
            const user: (IUser | null) = await Users.findOne({ account })
            loginUser(user, password, res)
        } catch (error) {
            return res.status(500).json({ msg: 'error from server' })
        }
    },
    logout: async (req: IAuth, res: Response) => {
        if(!req.user){
            {return res.status(400).json({msg: "Invalid authentication"})}
        }
        try {
            res.clearCookie('refreshtoken', { path: `/api/refresh_token` })

            await Users.findOneAndUpdate({_id: req.user._id}, {
                rf_token: ''
              })

            return res.json({ msg: 'logged out!' })
        } catch (error) {
            return res.status(500).json({ msg: 'error from server' })
        }
    },
    refreshToken: async(req: Request, res: Response) => {
        try {
          const rf_token = req.cookies.refreshtoken
          if(!rf_token) {return res.status(400).json({msg: "Please login now!"})}
    
          const decoded = <IDecodeToken>jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
          if(!decoded._id) {return res.status(400).json({msg: "Please login now!"})}
          const user = await Users.findById(decoded._id).select("-password +rf_token")
          if(!user) {return res.status(400).json({msg: "This account does not exist."})}
    
          const access_token = token.generateAccessToken({_id: user._id})
          const refresh_token = token.generateRefreshToken({_id: user._id}, res)

          await Users.findOneAndUpdate({_id: user._id}, {
            rf_token: refresh_token
          })

          res.json({ access_token, user })
          
        } catch (err: any) {
          return res.status(500).json({msg: err.message})
        }
      },
    googleLogin: async (req: Request, res: Response) => {
        try {
            const { id_token } = req.body
            // console.log(id_token)
            const verify = await client.verifyIdToken({
                idToken:id_token, audience:`${process.env.MAIL_CLIENT_ID}`
            })
            const { email, email_verified, name, picture } = <IGgUser>verify.getPayload()// báo rằng payload phải có kiểu của IGUser
            if (!email_verified) return res.status(400).json({ msg: 'Your email is not verify' })

            const user = await Users.findOne({ account: email })
            const passwordDefaut = 'quangtung123456'
            const passDefHash = await bcrypt.hash(passwordDefaut, 12)
            if (user) {
                loginUser(user, passwordDefaut, res)
            } else {
                const newUser: IGUserParams = {
                    name: name,
                    account: email,
                    password: passDefHash,
                    avatar: picture,
                    type: 'google'
                }
                registerByOauth(newUser, res)
            }
        } catch (err: any) {
            return res.status(500).json({ msg: err.message })
        }
    },
    facebookLogin: async (req: Request, res: Response) => {
        try {
            const { accessToken, userID } = req.body

            const URL = `https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`
            const data = await fetch(URL)
                .then(res => res.json())
                .then(res => { return res })

            const { name, email, picture } = data;
            console.log(picture.data.url)
            const passwordDefaut = '123456'
            const passDefHash = await bcrypt.hash(passwordDefaut, 12)

            const user = await Users.findOne({ account: email })
            if (user) {
                loginUser(user, passwordDefaut, res)
            } else {
                const newUser: IGUserParams = {
                    name,
                    account: email,
                    password: passDefHash,
                    avatar: `${picture.data.url}`,
                    type: 'facebook'
                }
                registerByOauth(newUser, res)
            }
        } catch (err: any) {
            return res.status(500).json({ msg: err.message })
        }
    },
   loginSMS:async(req:Request,res:Response)=>{
        try {
            const {phone} = req.body
            const data = await smsOTP(phone,'sms')
            res.status(200).json(data)
        } catch (err:any) {
            return res.status(500).json({ msg: err.message })
        }
    },
    smsVerify:async(req:Request,res:Response)=>{
        try {
            const {phone,code} = req.body
            const data = await smsVerify(phone,code)
            console.log(data)
            if(!data?.valid) return res.status(400).json({msg:'Invalid authentication.'})

            const password = '123456'
            const passHash = await bcrypt.hash(password,12)

            const user = await Users.findOne({account:phone})
            if(user) {
                loginUser(user,password,res)
            }else{
                const newUser:IGUserParams = {
                    name:phone,
                    account:phone,
                    password:passHash,
                    type:'sms'
                }
                registerByOauth(newUser,res)
            }

        } catch (err:any) {
            
        }
    }

}

const loginUser = async (user: (IUser | null), password: string, res: Response) => {

    if (!user) return res.status(400).json({ msg: 'This account is not exist' })

    const isMatchPassword = await bcrypt.compare(password, user.password)
    // if (!isMatchPassword) return res.status(400).json({ msg: 'wrong password, please try again' })
    if(!isMatchPassword){
        let errMessage = (user.type === 'register')
        ?'Password is incorrect'
        :`Password is incorrect. This account login with ${user.type}`
        return res.status(400).json({ msg: errMessage })
    }

    const access_token = token.generateAccessToken({ _id: user._id })
    const refresh_token = token.generateRefreshToken({ _id: user._id },res)

    await Users.findOneAndUpdate({_id: user._id}, {
        rf_token:refresh_token
      })

    console.log(user)

    res.status(200).json({
        msg: 'login success',
        access_token,
        user: {
            ...user._doc,
            password: ''
        }
    })
}

const registerByOauth = async (user: IGUserParams, res: Response) => {

    const newUser = new Users(user)
    newUser.save()

    const access_token = token.generateAccessToken({ id: newUser._id })
    const refresh_token = token.generateRefreshToken({ id: newUser._id },res)

    newUser.rf_token = refresh_token
    await newUser.save()

    res.status(200).json({
        msg: 'login success',
        access_token,
        user: {
            ...newUser._doc,
            password: ''
        }
    })
}



export default authCtrl