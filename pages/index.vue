<template>
  <h1>TimeToOrder</h1>
  <p v-if="isAuthenticated">Hello, {{ userInfo.name }}!</p>
  <button v-else="isAuthenticated" @click="login">登入</button>
</template>
  
<script setup>
  import { useRouter } from 'vue-router'
  import { useState } from '#app'

  const router = useRouter()
  function login() {
    router.push('/login')
  }

  const userInfo = useState('userInfo')
  const isAuthenticated = useState('isAuthenticated')
  
</script>