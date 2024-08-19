import { OAuth2Client } from 'google-auth-library'




export default defineEventHandler(async (event) => {
    console.log('server verify')
    const body = await readBody(event)
    const oauth2Client = new OAuth2Client()
    const ticket = await oauth2Client.verifyIdToken({idToken: body.credential})
    const payload = ticket.getPayload()

    if (!payload) 
        throw createError({statusCode: 400, statusMessage: 'Invalid token'})
    return { payload }
})