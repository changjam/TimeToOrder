<template>
  <h1>TimeToOrder Login</h1>
  <ClientOnly>
    <GoogleLogin :callback="login" />
  </ClientOnly>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useFetch } from '#app';
  import { addUserSession } from '@/utils/user_session/userSessionHandler'
  import { verify_credential } from '@/utils/auth/verifyHandler'

  const router = useRouter();

  onMounted(async () => {
    const data = await verify_credential()
    if (!data) return;
    router.push('/');
  })

  const login = async (response) => {
    // credential => JWT(JSON Web Token)
    const { credential } = response
    
    const { data } = await useFetch('/api/auth/google', {
      method: 'POST',
      body: {credential}
    })
    const user_info = data.value.jwtTokenPayload
    if (!user_info) return;

    // add user login session
    addUserSession({'user_id': user_info.user_id, 'name': user_info.name, 'actions': "Login"})

    // register
    try {
      await useFetch('/api/users/post', {
        method: 'POST',
        body: user_info,
      });
    }catch(error){
      console.log("Already registered or Other Error")
    }
    router.push('/');
  }
</script>
