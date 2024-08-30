<script setup>
import { ref } from 'vue'
import { getUserData, updateUser } from '@/utils/users/userHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import { useRouter } from 'vue-router'

const router = useRouter()
const user_id = ref('')
const user_info = ref(null)
const newNickname = ref('')
const newCustomImage = ref('')
const editingNickname = ref(false)

async function getUserInfo() {
  const data = await verify_credential()
  if (!data) {
    router.push('/login')
  } else {
    return data.user_id
  }
}

user_id.value = await getUserInfo()

if (user_id.value) {
  const response = await getUserData(`user_id=${user_id.value}`)
  user_info.value = response.data
}

function handleImageUpload(event) {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    newCustomImage.value = reader.result
  }
  reader.readAsDataURL(file)
}

async function updateUserInfo() {
  const updates = {}
  if (newNickname.value.length > 15) {
    alert('暱稱不能超過15個字元')
    newNickname.value = user_info.value.nickname
    return
  } else if (newNickname.value.length <= 0) {
    alert('暱稱不能為空')
    newNickname.value = user_info.value.nickname
    return
  }
  if (newNickname.value) updates.nickname = newNickname.value
  if (newCustomImage.value) updates.customImage = newCustomImage.value

  if (Object.keys(updates).length) {
    await updateUser(user_id.value, updates)
    const response = await getUserData(`user_id=${user_id.value}`)
    user_info.value = response.data
    editingNickname.value = false
  }
}

function editNickname() {
  editingNickname.value = true
  newNickname.value = user_info.value.nickname
}
</script>

<template>
  <div class="profile-container">
    <h1 class="title">個人資料頁面</h1>
    <div v-if="user_info" class="profile-card">
      <div class="image-container">
        <img :src="newCustomImage || user_info.customImage || user_info.image" alt="User Image" class="profile-image" />
        <div class="overlay">
          <label class="change-image-text">
            更改圖片
            <input type="file" @change="handleImageUpload" accept="image/*" />
          </label>
        </div>
      </div>
      <div class="profile-info">
        <p><strong>姓名：</strong>{{ user_info.name }}</p>
        <p><strong>電子郵件：</strong>{{ user_info.email }}</p>
        <p>
          <strong>暱稱：</strong>
          <button @click="editingNickname ? updateUserInfo() : editNickname()">
            {{ editingNickname ? '變更' : '更改暱稱' }}
          </button>
          <span v-if="!editingNickname">{{ user_info.nickname || '尚未設置暱稱' }}</span>
          <input v-else v-model="newNickname" type="text" placeholder="輸入新暱稱" />
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f4f8;
  min-height: 100vh;
}

.title {
  font-size: 2.5em;
  margin-bottom: 30px;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.profile-card {
  background: #ffffff;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.image-container {
  position: relative;
  width: 140px;
  height: 140px;
  margin-bottom: 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #007bff;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-container:hover .profile-image {
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.image-container:hover .overlay {
  opacity: 1;
}

.change-image-text {
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
}

.change-image-text input[type="file"] {
  display: none;
}

.profile-info {
  margin-bottom: 20px;
  font-size: 1.1em;
  color: #555;
}

.profile-info p {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
}

.profile-info strong {
  color: #333;
}

.profile-info input {
  margin-left: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  flex-grow: 1;
  font-size: 1em;
}

.profile-info button {
  margin-left: 10px;
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  font-size: 1em;
}

.profile-info button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
</style>
