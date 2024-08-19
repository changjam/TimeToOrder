<template>
  <h1>TimeToOrder Login</h1>
  <ClientOnly>
    <GoogleLogin :callback="login" />
  </ClientOnly>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

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

    router.push('/');
  }
  
  const verify_credential = async (credential) => {
    const response = await useFetch('/api/auth/auth-verify', {
      method: 'POST',
      body: {credential}
    })
    if (response.status.value !== 'success')
      return;
    return response.data.value
  }

</script>
