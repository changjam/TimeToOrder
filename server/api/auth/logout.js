export default defineEventHandler(async (event) => {
  setCookie(event, 'access_token', '', {httpOnly: true, maxAge: 0, expires: 0, secure: process.env.NODE_ENV === 'production', path: '/'})
  return { result: 'logout' }
})