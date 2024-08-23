<template>
  <h1>TimeToOrder</h1>
  <div v-if="userInfo.sub">
    <p>Hello, {{ userInfo.name }}!</p><br>
    <button @click="logout">登出</button>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { addUserSession } from '@/utils/userSessionHandler'
  import { useState } from '#app';
  import mongoose from 'mongoose';
  
  const router = useRouter();

  const userInfo = reactive({sub: ''})

  onMounted(async () => {
    const login_credential = localStorage.getItem('login_credential')
    const response = await verify_credential(login_credential)
    if (!response)
      router.push('/login')
    Object.assign(userInfo, response.payload)
  })

  const logout = () => {
    const userId = new mongoose.Types.ObjectId(useState('user_id').value);
    const userName = useState('name').value;
    addUserSession({'user_id':userId,'name': userName,'actions': "Logout"})

    useState('user_id').value = null;
    useState('name').value;


    localStorage.setItem('login_credential', '')
    Object.assign(userInfo, {})
    router.push('/login')
  }
  
  const verify_credential = async (credential) => {
    const response = await useFetch('/api/auth/auth-verify', {
      method: 'POST',
      body: {credential}
    })
    if (response.status.value != 'success')
      return;
    return response.data.value
  }
</script>
