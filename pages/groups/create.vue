<script setup>
import { ref } from 'vue'
import { getUserData , updateUser } from '@/utils/users/userHandler'
import { addGroup , getGroupData } from '@/utils/groups/groupHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'


const router = useRouter();
const groupName = ref('')
const emails = ref([])
const groupDataList = ref([])
const user_info = ref(null)
const user_id = ref('')


onMounted(async () => {
  const data = await verify_credential()
  if (!data) 
    router.push('/login');

  user_id.value = data.user_id;
  const response = await getUserData(`user_id=${user_id.value}`);
  user_info.value = response.data;
  emails.value.push(user_info.value.email)
  const joinedGroups = user_info.value.joinedGroups

  if (joinedGroups.length == 0)
    return;

  // setting group data
  for (const group of joinedGroups) {
    const groupData = await getGroupData(`_id=${group}`)
    const user_response = await getUserData(`user_id=${groupData.data[0].creator}`);
    const creator_name = user_response.data.nickName || user_response.data.name
    groupDataList.value.push({...groupData.data[0], creator_name: creator_name})
  }
})

const addEmail = () => {
  if (new Set(emails.value).size !== emails.value.length)
    return alert('幹什麼！ 你哪一連的？ 不要輸入同樣的 email 聽不懂是不是拉？');
  emails.value.push('')
}
const removeEmail = () => {
  if (emails.value.length <= 1)
    return;
  emails.value.pop();
}

const createGroup = async () => {
  if (groupName.value === '')
    return alert('群組名稱不能為空');

  const members = []
  members.push({
    id: user_id.value,
    permission_level: 'admin'
  })
  
  emails.value = [...new Set(emails.value)]
  for (const email of emails.value) {
    if (!email){
      alert('成員 email 不得為空')
      return;
    }
    const user = await getUserData(`email=${email}`)
    if (user && user.data.user_id !== user_id.value) {
      members.push({
        id: user.data.user_id,
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
      await updateUser(member.id, { joinedGroups: addedGroup._id });
    }
  
    groupName.value = ''
    emails.value = ['']
    alert("新增群組成功")
    groupDataList.value.push(addedGroup)
    location.reload()
  } catch (error) {
    console.error('error: ', error)
    alert("新增群組失敗")
  }
}
</script>

<template>
  <div class="group-container-wrapper">
    <div class="group-container">
        <h2 class="tab-title">新增群組</h2>
        <div class="form-group">
          <label for="groupName">群組名稱:</label>
          <input v-model="groupName" id="groupName" type="text" placeholder="雄壯威武火力連" class="input-field" />
        </div>

        <div v-for="(email, index) in emails" :key="index" class="form-group">
          <label v-if="index == 0" :for="'email' + index">admin</label>
          <label v-else :for="'email' + index">member {{ index }}:</label>
          
          <input v-if="index == 0" :id="'email' + index" type="email" :value="email" class="input-field" disabled/>
          <input v-else v-model="emails[index]" :id="'email' + index" type="email" placeholder="輸入成員信箱" class="input-field" />
        </div>

        <div class="horizontal-container">
          <button @click="addEmail" class="add-button button-style">新增成員</button>
          <button @click="removeEmail" class="remove-button button-style">刪除成員</button>
        </div>
        <button @click="createGroup" class="submit-button button-style">送出</button>
        <button @click="router.push({path:'/groups'})" class="remove-button button-style">取消</button>
    </div>
  </div>
</template>


<style scoped>
  .group-container-wrapper{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center
  }

  .group-container {
    max-width: 500px;
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .group-container .horizontal-container{
    display: flex;
    justify-content: space-between;
    gap: 6px;
  }

  .tab-title{
    padding-bottom: 20px;
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

  .button-style {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }

  .add-button {background-color: #28a745;}
  .add-button:hover {background-color: #218838;}
  .remove-button {background-color: #dc3545;}
  .remove-button:hover {background-color: #c82333;}
  .submit-button {background-color: #007bff;}
  .submit-button:hover {background-color: #0056b3;}

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
