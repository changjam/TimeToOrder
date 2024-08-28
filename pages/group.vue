<script setup>
import { ref } from 'vue'
import { useCookie } from '#app'
import { getUserData , updateUserGroup } from '@/utils/users/userHandler'
import { addGroup , getGroupData } from '@/utils/groups/groupHandler'

const user_id = useCookie('user_id')
const groupName = ref('')
const emails = ref([''])
const groupDataList = ref([])
const showCreateGroupForm = ref(false)

const addEmail = () => {
  emails.value.push('')
}

const user_info = await getUserData(`_id=${user_id.value}`)
const joinedGroups = user_info.data.joinedGroups

for (const group of joinedGroups) {
  const groupdata = await getGroupData(`_id=${group}`)
  groupDataList.value.push(groupdata.data)
}


showCreateGroupForm.value = groupDataList.value.length === 0

const createGroup = async () => {
  const members = []
  
  members.push({
    id: user_id.value,
    permission_level: 'admin'
  })
  
  for (const email of emails.value) {
    const user_info = await getUserData(`email=${email}`)
    if (user_info && user_info.data._id !== user_id.value) {
      members.push({
        id: user_info.data._id,
        permission_level: 'member'
      })
    }
  }

  const groupData = {
    name: groupName.value,
    creator: user_id.value,
    members
  }

  try {
    const addedGroup = await addGroup(groupData)
    for (const member of groupData.members) {
      await updateUserGroup(member.id, addedGroup._id)
    }
  
    groupName.value = ''
    emails.value = ['']
    alert("新增群組成功")
    showCreateGroupForm.value = false
    groupDataList.value.push(addedGroup)
  } catch (error) {
    alert("新增群組失敗")
  }
}
</script>

<template>
  <div class="group-container">
    <h1>群組管理</h1>

    <div v-if="showCreateGroupForm">
      <div class="form-group">
        <label for="groupName">群組名稱:</label>
        <input v-model="groupName" id="groupName" type="text" placeholder="輸入群組名稱" class="input-field" />
      </div>

      <div v-for="(email, index) in emails" :key="index" class="form-group">
        <label :for="'email' + index">成員信箱 {{ index + 1 }}:</label>
        <input v-model="emails[index]" :id="'email' + index" type="email" placeholder="輸入成員信箱" class="input-field" />
      </div>

      <button @click="addEmail" class="add-button">新增其他成員</button>
      <button @click="createGroup" class="submit-button">送出</button>
      <button @click="showCreateGroupForm = false" class="cancel-button">取消</button>
    </div>


    <div v-else>
      <div class="group-list">
        <h2>已加入群組</h2>
        <div v-for="group in groupDataList" :key="group._id" class="group-item">
          <h3>{{ group.name }}</h3>
          <p>創建時間: {{ new Date(group.created_at).toLocaleString() }}</p>
        </div>
      </div>

      <button @click="showCreateGroupForm = true" class="add-button">新增群組</button>
    </div>
  </div>
</template>


<style scoped>
  .group-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }

  .input-field {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .add-button, .submit-button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }

  .add-button {
    background-color: #28a745;
  }

  .add-button:hover, .submit-button:hover {
    background-color: #0056b3;
  }

  .submit-button:hover {
    background-color: #218838;
  }

  .cancel-button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #dc3545;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }

  .cancel-button:hover {
    background-color: #c82333;
  }

  .group-list {
    margin-top: 30px;
  }

  .group-item {
    background-color: #e9ecef;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 15px;
  }

  .group-item h3 {
    margin: 0 0 5px 0;
    color: #343a40;
  }

  .group-item p, .group-item ul {
    margin: 5px 0;
    color: #495057;
  }

  .group-item ul {
    padding-left: 20px;
  }
</style>
