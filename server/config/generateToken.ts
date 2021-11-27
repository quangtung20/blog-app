import jwt from "jsonwebtoken"

const generateActiveToken = (payload: object) => {
    return jwt.sign(payload, `${process.env.ACTIVE_TOKEN_SECRET}`, { expiresIn: '10h' })
}

const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, { expiresIn: '10h' })
}

const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, { expiresIn: '30d' })
}

export const token = {
    generateActiveToken,
    generateAccessToken,
    generateRefreshToken,
}
