<template>
  <h1>TimeToOrder</h1>
  <div v-if="isAuthenticated">
    <p>Hello, {{ userInfo.name }}!</p><br>
    <button @click="logout">登出</button>
  </div>
  <ClientOnly v-else>
    <GoogleLogin :callback="callback" />
  </ClientOnly>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  const isAuthenticated = ref(false)
  const userInfo = ref({ name: '', email: '' })

  onMounted(() => {
    const storedIsAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true'

    if (storedIsAuthenticated) {
      isAuthenticated.value = true
      userInfo.value.name = sessionStorage.getItem('user-name')
      userInfo.value.email = sessionStorage.getItem('user-email')
    }
  })

  const callback = (response) => {
    // credential => JWT(JSON Web Token)
    const { credential } = response;

    if (credential) {
      const data = JSON.parse(atob(credential.split('.')[1])); // atob => decode credential
      sessionStorage.setItem('user-name', data.name)
      sessionStorage.setItem('user-email', data.email)
      sessionStorage.setItem('user-id', data.sub)
      sessionStorage.setItem('isAuthenticated', 'true')

      userInfo.value.name = data.name
      userInfo.value.email = data.email
      isAuthenticated.value = true
    } else {
      alert('登入失敗')
      sessionStorage.setItem('isAuthenticated', 'false')
      isAuthenticated.value = false
    }
  }

  const logout = () => {
    sessionStorage.setItem('user-name', '')
    sessionStorage.setItem('user-email', '')
    sessionStorage.setItem('user-id', '')
    sessionStorage.setItem('isAuthenticated', 'false')
    isAuthenticated.value = false
  }
</script>
