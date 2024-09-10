<script setup>
import { ref } from 'vue'
import { getUserData, updateUser, updateUserGroupID, getAllUsers, removeJoinedGroup } from '@/utils/users/userHandler'
import { getGroupData, deleteGroupData, updateGroupMember, updateSingleMember } from '@/utils/groups/groupHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import { date_output_format } from '@/utils/date/timeHandler'

const router = useRouter();
const route = useRoute();
const group_info = ref(null)
const user_info = ref(null)
const members_info = ref([])
const group_id = useState('group_id', () => '')
const showSuggestions = ref(false);
const allUser = ref('')
const member_input = ref(''); // mail

onMounted(async () => {
  const data = await verify_credential();
  if (!data) router.push('/login');
  
  const uid = data.user_id;
  const gid = route.path.split("/").slice(-1)[0];
  const group_data = await getGroupData(`_id=${gid}`);
  
  group_info.value = group_data.data;
  user_info.value = group_info.value.members.filter(member_obj => member_obj.id == uid)[0];

  if (!user_info.value) router.push('/groups');

  group_info.value.members.forEach(async (member_obj) => {
    const member_data = await getUserData(`user_id=${member_obj.id}`);
    members_info.value.push({...member_data.data, permission_level: member_obj.permission_level, joinAt: member_obj.joinAt});
  });

  const order = ['admin', 'order_manager', 'member'];
  members_info.value.sort((a, b) => order.indexOf(b.status) - order.indexOf(a.status));

  allUser.value = await getAllUsers()
	allUser.value = allUser.value.data
});

// CRUD
async function addMember(email, group_members, group_id) {
  let user_id = null;

  for (const user of allUser.value) {
    if (user.email === email) user_id = user.user_id;
  }
  
  if (user_id) {
    for (const group_member of group_members) {
      if (group_member.email === email) {
        alert('該使用者已存在於群組中');
        return;
      }
    }
    await updateGroupMember({ groupId: group_id, memberData: { id: user_id, permission_level: 'member' } });
    await updateUser(user_id, { joinedGroups: group_id });
    alert("成功新增");
    location.reload();
  } else {
    alert('找不到該使用者');
  }
}

async function deleteMember(email, members, group_id) {
  if (checkUserPermission() !== 1) {
    alert('沒有權限刪除成員');
    return;
  }

  let userID = null;
  let able_delete = false;
  let admin_email = null;

  for (const member of members) {
    if (member.permission_level === 'admin') admin_email = member.email;
  }

  if (email === admin_email) {
    alert('無法刪除管理員');
    return;
  }

  for (const user of allUser.value) {
    if (user.email === email) userID = user.user_id;
  }

  if (userID) {
    for (const member of members) {
      if (member.email === email) able_delete = true;
    }
    if (!able_delete) {
      alert('該使用者不在群組中');
      return;
    }

    try {
      await updateSingleMember({ groupId: group_id, memberId: userID });
      await removeJoinedGroup({ groupId: group_id, userId: userID });
      location.reload();
      alert("成功刪除");
    } catch (error) {
      console.log(error);
    }
  } else {
    alert("刪除失敗");
  }
}

async function deleteGroup(group_id) {
  if (checkUserPermission() !== 1) {
    alert('沒有權限刪除群組');
    return;
  }
  
  const userConfirmed = confirm('確定刪除?');
  if (!userConfirmed) return;

  try {
    await deleteGroupData({ _id: group_id });
    await updateUserGroupID({ joinedGroups: group_id });
    location.reload();
  } catch (error) {
    console.error('Error deleting group:', error);
    alert('刪除失敗');
  }
}

// Permission相關
function checkUserPermission() {
  if (user_info.value.permission_level === 'admin') {
    return 1;
  } else if (user_info.value.permission_level === 'order_manager') {
    return 2;
  } else {
    return 3;
  }
}

// Suggetion相關
const onInput = () => {
	showSuggestions.value = filteredUsers.value.length !== 0;
};

const filteredUsers = computed(() => {
	if (member_input.value) {
		const searchQuery = member_input.value.toLowerCase()
		return allUser.value.filter(user => {
			const _email = user.email.split('@')[0];
			if (user.name.toLowerCase().includes(searchQuery))
				return user
			if (user.nickName && user.nickName.toLowerCase().includes(searchQuery))
				return user
			if (_email.toLowerCase().includes(searchQuery))
				return user
		});
	}
	return [];
});

const addEmail = (email) => {
  member_input.value = email;
  showSuggestions.value = false;
}

// other
function initiate_order(groupID) {
  group_id.value = groupID;
  router.push('/orders/create-order');
}

</script>


<template>
  <div class="group-container-wrapper" v-if="group_info">
    <div class="group-container">
      <div class="group-list">
        <div class="tab-title">
          <input type="text" :value="group_info.name" :disabled="checkUserPermission() !== 1">
          <button class="remove-button button-style" v-if="checkUserPermission() === 1" @click="deleteGroup(group_info._id)">刪除群組</button>
        </div>
        
        <div v-for="(member, idx) in members_info" :key="idx" class="group-item" :class="{mySelf: member.user_id == user_info.id}">
          <div class="img-container">
            <img :src="member.customImage || member.image" alt="">
          </div>
          <div class="member-info-container">
            <div class="header">
              <h2 class="header-name">{{ member.nickName || member.name }}</h2>
              <p class="header-role" :class="member.permission_level">{{ member.permission_level }}</p>
            </div>
            <p>{{ member.email }}</p>
            <p>加入時間: {{ date_output_format(member.joinAt) }}</p>
          </div>
        </div>
      </div>

      <div class="member-manage-container" v-if="checkUserPermission() <= 2">
        <input type="text" @input="onInput" class="member_input" v-model="member_input" placeholder="輸入成員...">
        <span id="suggetion-anchor">
          <section class="suggestion" v-if="showSuggestions">
            <ul>
              <li v-for="user in filteredUsers" :key="user.id" @click="addEmail(user.email)">
                <img :src="user.customImage || user.image || defaultAvatar" alt="">
                <span class="name">{{ user.nickName || user.name }}</span>
                <span class="email">{{ user.email }}</span>
              </li>
            </ul>
          </section>
        </span>
        <div class="horizontal-container">
          <button @click="addMember(member_input, members_info, group_info._id)" class="add-button button-style">新增成員</button>
          <button @click="deleteMember(member_input, members_info, group_info._id)" class="remove-button button-style">刪除成員</button>
        </div>
      </div>

      <button v-if="checkUserPermission() <= 2" @click="initiate_order(group_info._id)" class="submit-button button-style">發起訂單</button>
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

.member_input {
	width: 100%;
	padding: 10px;
	font-size: 16px;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-sizing: border-box;
}

#suggetion-anchor {
	position: relative;
	display: block;
	width: 100%;
}

#suggetion-anchor .suggestion {
	position: absolute;
	background-color: #f9f9f9;
	border: 1px solid #ccc;
	border-top: 0;
	border-radius: 0 0 12px 12px;
	width: 100%;
	max-height: 300px;
	top: 0;
	left: 0;
	padding: 1rem;
}

#suggetion-anchor .suggestion li {
	display: grid;
	grid-template-columns: 3rem 10rem 17rem 10rem 5rem;
	align-items: center;	
	max-height: 2rem;
	list-style: none;
}

#suggetion-anchor .suggestion li:hover {
	background-color: #ccc;
}

.member-container section img,
#suggetion-anchor .suggestion img {
	height: 2rem;
	border-radius: 50%;
	aspect-ratio: 1/1;
	object-fit: cover;
}
</style>