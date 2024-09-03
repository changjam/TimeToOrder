<script setup>
import { ref } from 'vue'
import { getUserData , updateUser , updateUserGroupID , getAllUsers , removeJoinedGroup} from '@/utils/users/userHandler'
import { addGroup , getGroupData , deleteGroupData , updateGroupMember , updateSingleMember } from '@/utils/groups/groupHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import { date_output_format } from '@/utils/date/timeHandler'


const router = useRouter();
const route = useRoute();
const groupDataList = ref([])
const group_info = ref(null)
const user_role = ref(null)
const user_info = ref(null)
const members_info = ref([])
const memberEmail = ref('')

onMounted(async () => {
  const data = await verify_credential()
  if (!data) 
    router.push('/login');
  const uid = data.user_id;
  const gid = route.path.split("/").slice(-1)[0];
  const group_data = await getGroupData(`_id=${gid}`);
  group_info.value = group_data.data[0];

  user_info.value = group_info.value.members.filter(member_obj => member_obj.id == uid)[0]
  if (!user_info.value)
    router.push('/groups')

  group_info.value.members.forEach(async (member_obj, idx) => {
    const member_data = await getUserData(`user_id=${member_obj.id}`);
    members_info.value.push({...member_data.data, permission_level: member_obj.permission_level, joinAt: member_obj.joinAt})
  });

  const order = ['admin', 'order_manager', 'member'];
  members_info.value.sort((a, b) => order.indexOf(b.status) - order.indexOf(a.status));

})

async function deleteGroup(group_id){
  const userConfirmed = confirm('確定刪除?');

  if (!userConfirmed){
    return;
  }

  try {
      await deleteGroupData({ _id: group_id });
      await updateUserGroupID({ joinedGroups: group_id })
      alert('成功刪除');
      location.reload();
  } catch (error) {
      console.error('Error deleting group:', error);
      alert('刪除失敗');
  } 
}

async function addMember(email,group_members,group_id){
  const users = await getAllUsers()

  let user_id = null
  for (const user of users.data){
    if (user.email === email){
      user_id = user.user_id
    }
  }
  
  if (user_id){
    for (const group_member of group_members){
      if (group_member.email === email){
        alert('該使用者已存在於群組中')
        return
      }
    }   
    await updateGroupMember({groupId: group_id , memberData: {id: user_id, permission_level: 'member'}})
    await updateUser(user_id, { joinedGroups: group_id })
    alert("成功新增")
    location.reload();   
  }else{
    alert('找不到該使用者')
  }
}

async function deleteMember(email,members,group_id){
  const users = await getAllUsers()
  let userID = null
  let able_delete = false
  let admin_email = null
  for (const member of members){
    if (member.permission_level === 'admin'){
      admin_email = member.email
    }
  } 

  if (email === admin_email){
    alert('無法刪除管理員')
    return
  }

  for (const user of users.data){
    if (user.email === email){
      userID = user.user_id 
    }
  }
  if (userID){
    for (const member of members){
      if (member.email === email){
        able_delete = true
      }
    }
    if (!able_delete){
      alert('該使用者不在群組中')
      return
    }
    try{
      await updateSingleMember({groupId: group_id, memberId: userID })
      await removeJoinedGroup({groupId: group_id, userId: userID })
      location.reload();
      alert("成功刪除")
      return
    }catch(error){
      console.log(error)
    }
  }else{
    alert("刪除失敗")
    return
  }
}

</script>

<template>
  <div class="group-container-wrapper" v-if="group_info">
    <div class="group-container">
      <div class="group-list">
        <div class="tab-title">
          <input type="text" :value="group_info.name" :disabled="user_info.permission_level !== 'admin'">
          <button class="remove-button button-style" v-if="user_info.permission_level == 'admin'" @click="deleteGroup(group_info._id)">刪除群組</button>
        </div>
        <div 
          v-for="(member, idx) in members_info" :key="idx" 
          class="group-item" 
          :class="{mySelf: member.user_id == user_info.id}"
        >
          <div class="img-container">
            <img :src="member.customImage || member.image" alt="">
          </div>
          <div class="member-info-container">
            <div class="header">
              <h2 class="header-name">{{ member.nickName || member.name }}</h2>
              <p 
                class="header-role" 
                :class="member.permission_level"
              >
                {{ member.permission_level }}
              </p>
            </div>
            <p>{{ member.email }}</p>
            <p>加入時間: {{ date_output_format(member.joinAt) }}</p>
          </div>
        </div>
      </div>
      <div 
        class="member-manage-container"
        v-if="user_info.permission_level == 'admin'"
      >
        <input type="email" placeholder="輸入成員信箱" class="input-field" v-model="memberEmail"/>
        <div class="horizontal-container">
          <button @click="addMember(memberEmail,members_info,group_info._id)" class="add-button button-style">新增成員</button>
          <button @click="deleteMember(memberEmail,members_info,group_info._id)" class="remove-button button-style">刪除成員</button>
        </div>
      </div>
      <button v-if="user_info.permission_level == 'admin'" @click="" class="submit-button button-style">發起訂單</button>
    </div>
  </div>
</template>

<style scoped>

.mySelf{background-color: #fffdcc !important;}
.admin{background-color: rgb(239, 176, 176);}
.order_manager{background-color: rgb(250, 198, 255);}
.member{background-color: rgb(191, 249, 242);}
.add-button {background-color: #28a745;}
.add-button:hover {background-color: #218838;}
.remove-button {background-color: #dc3545;}
.remove-button:hover {background-color: #c82333;}
.submit-button {background-color: #007bff;}
.submit-button:hover {background-color: #0056b3;}

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

.tab-title{
  padding-bottom: 20px;
  display: flex;
}

.tab-title input{
  width: 100%;
  border: none;
  font-size: 28px;
  padding: 4px;
  font-weight: 700;
  color: black;
}

.input-field {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.horizontal-container{
  display: flex;
  justify-content: space-between;
  gap: 6px;
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

.group-item {
  display: flex;
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
}
.group-item .img-container{
  width: 100px;
  height: 100px;
  margin-right: 10px;
}
.group-item .img-container img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.group-item .member-info-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.member-info-container .header{
  display: flex;
  align-items: center;
  justify-content: center;

}
/* .header .header-name{
} */
.header .header-role{
  margin-left: 8px;
  width: 60px;
  line-height: 20px;
  text-align: center;
  border-radius: 15px;
}
.header .header-role{
  cursor: pointer;
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