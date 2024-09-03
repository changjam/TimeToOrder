<script setup>
import { ref } from 'vue'
import { getUserData } from '@/utils/users/userHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'

const user_info = ref(null)
const user_id = ref('')

onMounted(async () => {
    const data = await verify_credential()
    if (!data)
        router.push('/login');

    user_id.value = data.user_id;
    const response = await getUserData(`user_id=${user_id.value}`);
    user_info.value = response.data;
    console.log(user_info.value)
    console.log(user_id.value)
})
</script>

<template>
    <h1>Order History</h1>
</template>