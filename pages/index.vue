<template>
  <h1>TimeToOrder</h1>
  <button @click="login">登入</button>
</template>
  
<script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  function login() {
    router.push('/login')
  }
</script>