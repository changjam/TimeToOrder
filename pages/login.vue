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
    addUserSession({
      'user_id': user_info.user_id, 
      'name': user_info.name, 
      'email': user_info.email,
      'actions': "Login"
    })

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

<template>
  <div class="container">
    <h1 >快登入，別餓著自己！</h1>
    <ClientOnly>
      <GoogleLogin class="sign_in_btn_wrapper" :callback="login"/>
    </ClientOnly>
  </div>
</template>

<style scoped>
  .container{
    width: 100%;
    height: 60%;
    display: flex;
    flex-direction: column;
    gap: 30px;
    justify-content: center;
    align-items: center;
  }
</style>