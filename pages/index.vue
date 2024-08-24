<template>
  <h1>TimeToOrder</h1>
  <div v-if="userInfo.name">
    <p>Hello, {{ userInfo.name }}!</p><br>
    <button @click="logout(userInfo)">登出</button>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { verify_credential } from '@/utils/auth/verifyHandler'
  import { logout } from '@/utils/auth/logoutHandler'
  
  const router = useRouter();
  const userInfo = reactive({name: ''})

  onMounted(async () => {
    const data = await verify_credential()
    if (!data)
      router.push('/login')
    Object.assign(userInfo, data)
  })
</script>
