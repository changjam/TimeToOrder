<script setup>
import { ref } from 'vue'
import { getUserData, updateUser, getAllUserData } from '@/utils/users/userHandler'
import { addGroup } from '@/utils/groups/groupHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import { getGroupByUserID } from '@/utils/Common'

const groupName = ref('')
const member_input = ref('');
const members = ref(new Set())
const groupDataList = ref([])
const showCreateGroupForm = ref(false)
const user_info = ref('')
const allUser = ref('')



onMounted(async () => {
	const data = await verify_credential()
	if (!data) {
		router.push('/login')
	}
	user_info.value = await getUserData(`user_id=${data.user_id}`)
	user_info.value = user_info.value.data

	groupDataList.value = await getGroupByUserID(user_info.value)
	showCreateGroupForm.value = groupDataList.value.length === 0
	allUser.value = await getAllUserData()
	allUser.value = allUser.value.data
})


showCreateGroupForm.value = groupDataList.value.length === 0

const showSuggestions = ref(false);
// suggestion
const filteredUsers = computed(() => {
	if (member_input.value) {
		const searchQuery = member_input.value.toLowerCase()
		return allUser.value.filter(user => {
			const _email = user.email.split('@')[0];
			if (user.name.toLowerCase().includes(searchQuery))
				return user
			if (_email.toLowerCase().includes(searchQuery))
				return user
		});
	}
	return [];
});

const onInput = () => {
	showSuggestions.value = filteredUsers.value.length !== 0;
};

const selectUser = (user) => {
	members.value.add(user);
	member_input.value = '';
	showSuggestions.value = false;
};

const removeMember = (member) => {
	members.value.delete(member)
}

const createGroup = async () => {
	const _members = []

	_members.push({
		id: user_info.value.user_id,
		permission_level: 'admin'
	})

	for (const email of emails.value) {
		const _memberData = await getUserData(`email=${email}`)
		console.log(_memberData)
		if (!_memberData)
			console.log("沒有此成員的資料")
		if (_memberData && _memberData.data.user_id !== user_info.value.user_id) {
			_members.push({
				id: user_info.user_id,
				permission_level: 'member'
			})
		}
	}

	const groupData = {
		name: groupName.value,
		creator: user_info.value.user_id,
		_members
	}

	try {
		const addedGroup = await addGroup(groupData)
		for (const member of groupData._members) {
			await updateUser(member.id, { joinedGroups: addedGroup._id });
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
				<input v-model="groupName" id="groupName" type="text" placeholder="輸入群組名稱..." class="input-field" />
			</div>
			<div class="member-container">
				<section v-for="member in members" class="member" :key="member.id">
					<img :src="member.image" alt="">
					<span class="name">{{ member.name }}</span>
					<span class="email">{{ member.email }}</span>

					<button class="delete-btn" @click="removeMember(member)">delete</button>
				</section>
				<section class="member">
					<img src="~/assets/images/plate_black.svg" alt="">
					<span class="name">G8報幹長的測試人員53218310</span>
					<span class="email">tester53218310@gmail.com</span>
					<button class="delete-btn" @click="removeMember(member)">delete</button>
				</section>
				<section v-for="index in 10" class="member">
					<img src="~/assets/images/plate_black.svg" alt="">
					<span class="name">測試人員</span>
					<span class="email">tester@gmail.com</span>
					<button class="delete-btn" @click="removeMember(member)">delete</button>
				</section>


			</div>

			<input type="text" @input="onInput" class="member_input" v-model="member_input" placeholder="輸入成員...">
			<span id="suggetion-anchor">
				<section class="suggestion" v-if="showSuggestions">
					<ul>
						<li v-for="user in filteredUsers" :key="user.id" @click="selectUser(user)">
							<img :src="user.image" alt="">
							{{ user.name }} {{ user.email }}
						</li>
					</ul>
				</section>
			</span>
			<button @click="createGroup" class="submit-button">送出</button>
			<button @click="showCreateGroupForm = false" class="cancel-button">取消</button>
		</div>

		<div v-else>
        <div class="group-list">
          <h2 class="tab-title">群組列表</h2>
          <div v-for="(group, idx) in groupDataList" :key="idx" class="group-item">
            <h3>{{ group.name }}</h3>
            <p>創建人: {{ group.creator_name }}</p>
            <p>創建時間: {{ new Date(group.created_at).toLocaleString() }}</p>
          </div>
        </div>
        <button @click="showCreateGroupForm = true" class="add-button button-style">新增群組</button>
      </div>

	</div>
</template>


<style>
.group-container {
	max-width: 80%;
	margin: 0 auto;
	padding: 20px;
	background-color: #f9f9f9;
	border-radius: 8px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.group-container h1 {
	text-align: center;
}

.group-container label {
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

.member-container {
	width: 100%;
	max-height: 300px;
	overflow-y: auto;
}

.member-container section {
	width: 100%;
	display: grid;
	grid-template-columns: 2rem 20rem 20rem 5rem;
	align-items: center;
	justify-content: space-between;
	padding: 1rem;
}

.member-container section .email,
.member-container section .name {
	max-width: 15rem;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.member-container section .delete-btn {
	height: 100%;
}

.member-container section .delete-btn:hover {
	background: #007bff;
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
	display: flex;
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
}
.cancel-button,
.submit-button {
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

.submit-button:hover {
	background-color: #0056b3;
}
.cancel-button{
	background-color: #dc3545;
}
</style>
