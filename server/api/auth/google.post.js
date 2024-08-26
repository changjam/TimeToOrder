import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'




const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const oauth2Client = new OAuth2Client()
  oauth2Client.setCredentials({ access_token: body.credential })

  const userInfo = await oauth2Client.verifyIdToken({idToken: body.credential})

  oauth2Client.revokeCredentials()

  if (!userInfo) 
    throw createError({statusCode: 400,statusMessage: 'Invalid token'})

  const jwtTokenPayload = {user_id: userInfo.payload.sub, name: userInfo.payload.name, email: userInfo.payload.email, image: userInfo.payload.picture}
  const maxAge = 60 * 60 * 24 * 7
  const expires = Math.floor(Date.now() / 1000) + maxAge
  const jwtToken = jwt.sign({exp: expires, ...jwtTokenPayload}, runtimeConfig.jwtSignSecret)

  setCookie(event, 'access_token', jwtToken, {httpOnly: true, maxAge, expires: new Date(expires * 1000), secure: process.env.NODE_ENV === 'production', path: '/'})
  return { jwtTokenPayload }
})