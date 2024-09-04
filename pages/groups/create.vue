<script setup>
import { ref } from 'vue'
import { getUserData, updateUser, getAllUserData } from '@/utils/users/userHandler'
import { addGroup, getGroupData } from '@/utils/groups/groupHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import defaultAvatar from '~/assets/images/plate_black.svg'


const router = useRouter();
const groupName = ref('')
const members = ref(new Map())
const member_input = ref('');
const user_info = ref(null)
const allUser = ref('')
const showSuggestions = ref(false);


onMounted(async () => {
	const data = await verify_credential()
	if (!data)
		router.push('/login');

	user_info.value = await getUserData(`user_id=${data.user_id}`)
	user_info.value = user_info.value.data

	allUser.value = await getAllUserData()
	allUser.value = allUser.value.data

	let _group_creator = user_info.value
	_group_creator.permission_level = 'admin'
	_group_creator.readOnly = true;

	members.value.set(_group_creator.user_id, _group_creator)
})

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

const onInput = () => {
	showSuggestions.value = filteredUsers.value.length !== 0;
};

const addMember = (member) => {
	if(!members.value.has(member.user_id)){
		member.permission_level = 'member'
		members.value.set(member.user_id, member);
	}	
	member_input.value = '';
	showSuggestions.value = false;
};

const removeMember = (user_id) => {
	members.value.delete(user_id)
}

const changePermission = (user_id, permission_level) => {
	const _member = members.value.get(user_id)
	_member.permission_level = permission_level
	members.value.set(user_id, _member)
}

const createGroup = async () => {
	if (groupName.value === '')
		return alert('群組名稱不能為空');

	const _members = []

	members.value.forEach((member, user_id) => {
		_members.push({
			id: user_id,
			permission_level: member.permission_level
		})
	})

	const groupData = {
		name: groupName.value,
		creator: user_info.value.user_id,
		members: _members
	}	
	try {
		const addedGroup = await addGroup(groupData)
		for (const member of groupData.members) {
			await updateUser(member.id, { joinedGroups: addedGroup._id });
		}
		groupName.value = ''
		alert("新增群組成功")
		router.push({ path: '/groups' })
	} catch (error) {
		console.error('error: ', error)
		alert("新增群組失敗")
	}
}
</script>

<template>
	<div class="group-container">
		<h2 class="tab-title">新增群組</h2>
		<div class="form-group">
			<label for="groupName">群組名稱:</label>
			<input v-model="groupName" id="groupName" type="text" placeholder="輸入群組名稱..." class="input-field" />
		</div>
		<div class="member-container">
			<section v-for="[user_id, member] in members" class="member" :key="user_id">
				<img :src="member.customImage || member.image || defaultAvatar" alt="">
				<span class="name">{{ member.nickName || member.name }}</span>
				<span class="email">{{ member.email }}</span>

				<select v-if="!member.readOnly" name="permission_level" id="" :value="member.permission_level"
					@change="changePermission(user_id, $event.target.value)">
					<option value="admin">admin</option>
					<option value="order_manager">order_manager</option>
					<option value="member">member</option>
				</select>
				<span v-else class="permission">{{ member.permission_level }}</span>

				<button v-if="!member.readOnly" class="delete-btn" @click="removeMember(user_id)">delete</button>
			</section>
		</div>

		<input type="text" @input="onInput" class="member_input" v-model="member_input" placeholder="輸入成員...">
		<span id="suggetion-anchor">
			<section class="suggestion" v-if="showSuggestions">
				<ul>
					<li v-for="user in filteredUsers" :key="user.id" @click="addMember(user)">
						<img :src="user.customImage || user.image || defaultAvatar" alt="">
						<span class="name">{{ user.nickName || user.name }}</span>
						<span class="email">{{ user.email }}</span>
					</li>
				</ul>
			</section>
		</span>

		<button @click="createGroup" class="submit-button button-style">送出</button>
		<button @click="router.push({ path: '/groups' })" class="remove-button button-style">取消</button>
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
	grid-template-columns: 2rem 10rem 20rem 10rem 5rem;
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
	gap: 1rem;
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

.add-button {
	background-color: #28a745;
}

.add-button:hover {
	background-color: #218838;
}

.remove-button {
	background-color: #dc3545;
}

.remove-button:hover {
	background-color: #c82333;
}

.submit-button {
	background-color: #007bff;
}

.submit-button:hover {
	background-color: #0056b3;
}
</style>