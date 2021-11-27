import { Request, Response, NextFunction } from 'express'

export const validRegister = async (req: Request, res: Response, next: NextFunction) => {

    const { name, account, password } = req.body
    const errors = []
    if (!name) {
        errors.push("please type your user name")
    } else if (name.length > 20) {
        errors.push("Your name is up to 20 chars long.")
    }
    if (!account) {
        errors.push("please type your email")
    } else if (!validPhone && !validateEmail) {
        errors.push("your email or your phone is incorect")
    }
    if (!password) {
        errors.push("please type your password")
    } else if (password.length < 6) {
        errors.push("password must be at least 6 chars")
    }

    if (errors.length > 0) {
        return res.status(400).json({ msg: errors })
    }

    next()
}

export const validLogin = async (req: Request, res: Response, next: NextFunction) => {

    const { name, account, password } = req.body
    const errors = []
    if (!account) {
        errors.push("please type your email")
    } else if (!validPhone && !validateEmail) {
        errors.push("your email or your phone is incorect")
    }
    if (!password) {
        errors.push("please type your password")
    } else if (password.length < 6) {
        errors.push("password must be at least 6 chars")
    }

    if (errors.length > 0) {
        return res.status(400).json({ msg: errors })
    }

    next()
}

export const validPhone = (phone: string): boolean => {
    const re = /^[+]/g
    return re.test(phone)
}

export const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}