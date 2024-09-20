import { config } from 'dotenv'

export default defineNuxtConfig({
  app:{
    head:{
      link:[
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
      ]
    }
  },
  ssr: false,
  modules: [],
  devtools: { enabled: false },
  nitro: {
    plugins: [
      '@/server/db_connect'
    ]
  },
  runtimeConfig: {
    jwtSignSecret: process.env.JWT_SIGN_SECRET,
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID
    },
    googleClientSecret: process.env.GOOGLE_SECRET_KEY
  },
  compatibilityDate:'2024-08-14',
})