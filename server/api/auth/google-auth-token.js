import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'


const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const oauth2Client = new OAuth2Client()
    oauth2Client.setCredentials({ access_token: body.access_token })

    const userInfo = await oauth2Client.request({ url: 'https://www.googleapis.com/oauth2/v3/userinfo' })
        .then((response) => response.data)
        .catch(() => null)

    if (!userInfo)
        throw createError({ statusCode: 400, statusMessage: 'Invalid token' })

    const jwtTokenPayload = { user_id: userInfo.sub, name: userInfo.name, email: userInfo.email, image: userInfo.picture }
    const maxAge = 60 * 60 * 24 * 7
    const expires = Math.floor(Date.now() / 1000) + maxAge
    const jwtToken = jwt.sign({ exp: expires, ...jwtTokenPayload }, runtimeConfig.jwtSignSecret)

    setCookie(event, 'access_token', jwtToken, { httpOnly: true, maxAge, expires: new Date(expires * 1000), secure: process.env.NODE_ENV === 'production', path: '/' })
    return { jwtTokenPayload }
})