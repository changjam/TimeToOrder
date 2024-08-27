import jwt from 'jsonwebtoken'




const runtimeConfig = useRuntimeConfig()

export default defineEventHandler((event) => {
  const jwtToken = getCookie(event, 'access_token')
  try {
    const userInfo = jwt.verify(jwtToken, runtimeConfig.jwtSignSecret)
    return userInfo
  } catch (e) {
    throw createError({statusCode: 401, statusMessage: 'Unauthorized'})
  }
})