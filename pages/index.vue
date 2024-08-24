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

<template>
  <div class="container">
    <h1 class="title">示範區</h1>
    <div class="user-info-container" v-if="userInfo.name">
      <div class="user-info" v-for="(value, key) in userInfo" :key="key">
        {{ key }}:  {{ value }}
      </div>
    </div>
    <button @click="logout(userInfo)">登出</button>
  </div>
</template>

<style scoped>
  .container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .user-info-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 50%;
    height: 50%;
  }
</style>