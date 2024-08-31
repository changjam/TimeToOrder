<script setup>
import { ref } from 'vue'
import { getUserData, updateUser } from '@/utils/users/userHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import { useRouter } from 'vue-router'

const router = useRouter()
const user_id = ref('')
const user_info = ref(null)
const nickName = ref('')
const image_b64 = ref('')
const origin_status = reactive({'nickName': nickName.value, 'image_b64': image_b64.value})

const isChanged = computed(() => {
  if (origin_status.nickName !== nickName.value || origin_status.image_b64 !== image_b64.value){
    return true;
  }else{
    return false;
  }
});

onMounted(async () => {
  const data = await verify_credential()
  if (!data) 
    router.push('/login');
  user_id.value = data.user_id;

  if (!user_id.value)
    return;
  const response = await getUserData(`user_id=${user_id.value}`);
  user_info.value = response.data;

  nickName.value = user_info.value.nickName || '尚未設置暱稱';
  origin_status.nickName = nickName.value;

  image_b64.value = user_info.value.customImage || user_info.value.image;
  origin_status.image_b64 = image_b64.value;
})

function handleImageUpload(event) {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = async () => {image_b64.value = reader.result}
  reader.readAsDataURL(file)
}

function check_nickName_format() {
  if (nickName.value.length > 15) {
    alert('暱稱不能超過15個字元')
    return false;
  } else if (nickName.value.length <= 0) {
    alert('暱稱不能為空')
    return false;
  }
  return true;
}

async function updateUserInfo() {
  const updates = {}
  console.log
  if (nickName.value !== origin_status.nickName) {
    if (check_nickName_format())
      updates.nickName = nickName.value
    else
      location.reload()
  }
  if (image_b64.value && image_b64.value !== origin_status.image_b64) updates.customImage = image_b64.value

  if (Object.keys(updates).length)
    await updateUser(user_id.value, updates);

  location.reload();
}
</script>

<template>
  <div class="profile-container">
    <h1 class="title">個人資料頁面</h1>
    <div v-if="user_info" class="profile-card">
      <div class="image-container">
        <img :src="image_b64" alt="User Image" class="profile-image" />
        <div class="overlay">
          <label class="change-image-text">
            更改圖片
            <input type="file" @change="handleImageUpload" accept="image/*" />
          </label>
        </div>
      </div>
      <div class="profile-info">
        <div class="profile-field">
          <h3 class="key">姓名：</h3>
          <div class="value">{{ user_info.name }}</div>
        </div>
        <div class="profile-field">
          <h3 class="key">電子郵件：</h3>
          <div class="value">{{ user_info.email }}</div>
        </div>
        <div class="profile-field">
          <h3 class="key">加入時間：</h3>
          <div class="value">{{ new Date(user_info.createdAt).toLocaleString() }}</div>
        </div>
        <div class="profile-field">
          <h3 class="key">暱稱：</h3>
          <input class="value nickName-input" v-model="nickName" maxlength="15"></input>
        </div>
      </div>
      <div class="save-button-container" v-if="isChanged">
        <button class="save_button" @click="updateUserInfo">儲存狀態</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.profile-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
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
  font-size: 1.5em;
  font-weight: bold;
}
.change-image-text input[type="file"] {
  display: none;
}

.profile-info {
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
  font-size: 1.1em;
  color: #555;
}
.profile-info .profile-field {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.profile-field .key{
  text-align:left;
  font-weight: 900;
  color: #333;
}
.profile-field .value{
  text-align: right;
  color: #555;
}
.profile-info input {
  border: none;
  margin-left: 10px;
  padding: 8px;
  border-radius: 5px;
  flex-grow: 1;
  font-size: 1em;
}
.profile-info input:hover {
  background-color: #ccc
}



.profile-card .save-button-container{
  width: 100%;
}
.profile-card .save_button{
  width: 100%;
  line-height: 40px;
  font-size: 20px;
  font-weight: 500;
  border-radius: 5px;
  color: white;
  background-color: #007bff;
}
.profile-card .save_button:hover{
  background-color: #0056b3;
  cursor: pointer;
  transition: all 0.2s;
}
</style>
