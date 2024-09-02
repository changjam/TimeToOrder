<template>
	<div class="index-wrapper" v-if="user_info">
		<div class="user-info-wrapper">
			<img id="user-avatar" :src="user_info.customImage || user_info.image"  alt="user-image">				
			<h1> 歡迎 <span class="name">{{ user_info.nickName || user_info.name }}</span> 上餐廳，親愛精誠</h1>
		</div>

		<nav class="features">
			<OrderCard />
			<CreateOrderCard/>
			<RestaurantCard />

			<nav class="sub-features">
				<div @click="router.push({path:'groups'})">
					<p>查看群組</p>
				</div>
				<div>
					<p>歷史訂單</p>
				</div>
				<div @click="router.push({path:'profile'})">
					<p>個人設定</p>
				</div>
				<div @click="logout">
					<p>登出</p>
				</div>
			</nav>
		</nav>
	</div>

</template>

<script setup>
import { verify_credential } from '@/utils/auth/verifyHandler'
import { logout } from '@/utils/auth/logoutHandler'
import { getUserData } from '@/utils/users/userHandler'

const router = useRouter();
const user_info = ref(null)
const user_id = ref('')

onMounted(async () => {
  const data = await verify_credential()
  if (!data) 
    router.push('/login');
  user_id.value = data.user_id;

  if (!user_id.value)
    return;
  const response = await getUserData(`user_id=${user_id.value}`);
  user_info.value = response.data;
})
</script>

<style>
.index-wrapper {
	width: 90%;
	height: 100%;
	margin-inline: auto;
	padding-top: 1rem;
}

.index-wrapper h1 {
	font-size: 1.5rem;
	text-align: center;
}

.features {
	display: grid;
	grid-template-columns: repeat(auto-fit, 300px);
	grid-auto-rows: 400px;
	justify-content: center;
	gap: 1rem;
	height: 75%;
	margin-top: 1rem;
}

.features>div{
	display: flex;
	justify-content: center;
	align-items: center;
}


.sub-features>div {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 20px;
	background: rgb(45, 58, 92);
	color: white;
	border: 3px solid var(--gold);
	filter: grayscale(80%);
	transition: filter 0.5s ease;
}

.sub-features {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 1rem;
}

.sub-features>div:hover {
	cursor: pointer;
	filter: grayscale(0);
}

.sub-features div p {
	font-size: 1.5rem;
}

.user-info-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
}

.user-info-wrapper .name {
	font-size: 30px;
}

#user-avatar {
	border-radius: 50%;
	margin-right: 10px;
	height: 5rem;
	width: 5rem;
	object-fit: cover;
}
</style>