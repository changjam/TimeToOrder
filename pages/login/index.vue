<template>
    <input type="text" placeholder="Username" v-model="username"><br>
    <input type="password" placeholder="Password" v-model="password"><br>
    <button @click="login">Login</button><br>
    <button @click="handleGoogleLogin">
        <span>使用 Google 進行登入</span>
    </button>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { googleTokenLogin } from 'vue3-google-login'
  import { useState } from '#app'

  const router = useRouter()
  const userInfo = useState('userInfo', () => ({ name: '', email: '' }))
  const isAuthenticated = useState('isAuthenticated', () => false)

  function login() {
      pass
  }
  
  const runtimeConfig = useRuntimeConfig()
  const { googleClientId: GOOGLE_CLIENT_ID } = runtimeConfig.public
  
  
  const handleGoogleLogin = async () => {
    const accessToken = await googleTokenLogin({
      clientId: GOOGLE_CLIENT_ID
    }).then((response) => response?.access_token)
  
    if (!accessToken) {
      // 登入失敗
      return
    }
  
    const { data } = await useFetch('/api/auth/google-auth-token', {
      method: 'POST',
      body: {
        accessToken
      }
    })
  
    if (data.value) {
      userInfo.value.name = data.value.name
      userInfo.value.email = data.value.email
      isAuthenticated.value = true
      router.push('/')
    }
  }

</script>