import { config } from 'dotenv'

export default defineNuxtConfig({
  ssr: true,
  modules: [],
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID
    },
    googleClientSecret: process.env.GOOGLE_SECRET_KEY
  },
  compatibilityDate: '2024-08-14'
})