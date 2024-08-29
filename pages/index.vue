<template>
	<div class="index-wrapper" v-if="userInfo.name">
		<div class="user-info-wrapper">
			<img id="user-avatar" :src="userInfo.image" alt="">
			<h1>{{ userInfo.name }} 你好！</h1>
		</div>

		<nav class="features">
			<OrderCard />
			<CreateRestCard />
			<RestaurantCard />
			<!-- <FeatureCard :Feature="{id:'order' , name:'開始點單'}" FontSize="5.5em" :FontLine="6"/> -->
			<!-- <FeatureCard :Feature="{id:'create-order' , name:'建立訂單'}" FontSize="5.5em" :FontLine="6"/> -->
			<!-- <FeatureCard :Feature="{id:'restaurant' , name:'查看餐廳'}" FontSize="5.5em" :FontLine="6"/> -->

			<nav class="sub-features">
				<div>
					<p @click="router.push('/group')">查看群組</p>
				</div>
				<div>
					<p>歷史訂單</p>
				</div>
				<div>
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
import { onMounted } from 'vue'
import { verify_credential } from '@/utils/auth/verifyHandler'
import { logout } from '@/utils/auth/logoutHandler'
import { getUserData } from '@/utils/users/userHandler'
import { useCookie } from '#app'

const router = useRouter();
const userInfo = reactive({ name: '' })

onMounted(async () => {
	const data = await verify_credential()
	try{
		const user_info = await getUserData(`user_id=${data.user_id}`)
		const user_id_cookie = useCookie('user_id')
		user_id_cookie.value = user_info.data._id
		user_id_cookie.option = {
			maxAge: 24*60*60,
			path: '/',
		}	
	}catch(error){
		console.log("Does not Login")
	}
	

	if (!data)
		router.push('/login')
	Object.assign(userInfo, data)
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

.features>div,
.sub-features>div {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 20px;
	background: rgb(45, 58, 92);
	color: white;
	border: 3px solid var(--gold);
}

.sub-features {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	gap: 1rem;
}

.sub-features>div:hover {
	cursor: pointer;
}

.sub-features div p {
	font-size: 1.5rem;
}

.user-info-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
}

#user-avatar {
	border-radius: 50%;
	margin-right: 10px;
	height: 5rem;
}
</style>