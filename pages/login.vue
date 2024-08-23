<template>
  <h1>TimeToOrder Login</h1>
  <ClientOnly>
    <GoogleLogin :callback="login" />
  </ClientOnly>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useFetch } from '#app';
  import { addUserSession } from '@/utils/userSessionHandler'
  import { getUserData } from '~/utils/userHandler';
  import mongoose from 'mongoose';
  import { useState } from '#app';

  const router = useRouter();
  const credential_test = ref('')

  onMounted(async () => {
    const login_credential = localStorage.getItem('login_credential')
    const response = await verify_credential(login_credential)
    if (!response)
      return;
    router.push('/');
  })

  const login = async (response) => {
    // credential => JWT(JSON Web Token)
    const { credential } = response
    

    const data = await verify_credential(credential)
    if (!data)
      return;
    localStorage.setItem('login_credential', credential)

    // get user data
    const UserData = await getUserData({"user_id": data.payload.sub})
    var user_id = new mongoose.Types.ObjectId(UserData.data._id)
    var name = UserData.data.name

    const userIdState = useState('user_id', () => UserData.data._id);
    const userNameState = useState('name', () => name);

    // add user login session
    addUserSession({'user_id': user_id,'name': name,'actions': "Login"})

    router.push('/');
  }
  
  const verify_credential = async (credential) => {
    const response = await useFetch('/api/auth/auth-verify', {
      method: 'POST',
      body: {credential}
    })
    
    // 註冊
    const user_info = response.data.value
    try {
      await useFetch('/api/users/post', {
      method: 'POST',
      body: {
        user_id:user_info.payload.sub, 
        name:user_info.payload.name, 
        email:user_info.payload.email,
        image:user_info.payload.picture
      },
    });
    }catch(error){
      console.log("Already registered or Other Error")
    }

    if (response.status.value !== 'success')
      return;
    return response.data.value
  }

</script>
