<template>
	<div class="index-wrapper" v-if="user.sub">
		<div class="user-info-wrapper">
			<img id="user-avatar" :src="user.picture" alt="">
			<h1>{{ user.name }} 你好!</h1>
		</div>

		<nav class="features">
			<OrderCard />
			<CreateOrderCard />
			<RestaurantCard />
			<!-- <FeatureCard :Feature="{id:'order' , name:'開始點單'}" FontSize="5.5em" :FontLine="6"/> -->
			<!-- <FeatureCard :Feature="{id:'create-order' , name:'建立訂單'}" FontSize="5.5em" :FontLine="6"/> -->
			<!-- <FeatureCard :Feature="{id:'restaurant' , name:'查看餐廳'}" FontSize="5.5em" :FontLine="6"/> -->

			<nav class="sub-features">
				<div>
					<p>查看群組</p>
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
import { useState } from '#app'

const router = useRouter();
// const userInfo = reactive({ sub: '' })
const user = useState('user', () => ({
	name: '',
	email: '',
	loggedIn: false,
	sub: '',
}));

onMounted(async () => {
	const login_credential = localStorage.getItem('login_credential')
	const response = await verify_credential(login_credential)
	if (!response)
		router.push('/login')
	Object.assign(user.value, response.payload)
	console.log(user.value)

})

const logout = () => {
	localStorage.setItem('login_credential', '')
	Object.assign(user.value, {})
	router.push('/login')
}

const verify_credential = async (credential) => {
	const response = await useFetch('/api/auth/auth-verify', {
		method: 'POST',
		body: { credential }
	})
	if (response.status.value != 'success')
		return;
	return response.data.value
}
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

.user-info-wrapper{	
	display: flex;
	align-items: center;
	justify-content: center;
}

#user-avatar {
	border-radius: 50%;
	height: 5rem;
}

</style>