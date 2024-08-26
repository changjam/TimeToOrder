<template>
	<div class="login-wrapper">
		<div class="login-card">
			<img src="~/assets/images/plate.svg" alt="">
			<div class="login-content">
				<h2>登入並開始使用</h2>
				<ClientOnly>
					<GoogleLogin :callback="login" />
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFetch } from '#app';


const router = useRouter();
const credential_test = ref('')

onMounted(async () => {
	const login_credential = localStorage.getItem('login_credential')
	const response = await verify_credential(login_credential)
	if (!response)
		return;
	router.push('/');
})

const login = async (response) => {
	// credential => JWT(JSON Web Token)

	const { credential } = response

	const data = await verify_credential(credential)
	if (!data)
		return;
	localStorage.setItem('login_credential', credential)

	router.push('/');
}

const verify_credential = async (credential) => {
	const response = await useFetch('/api/auth/auth-verify', {
		method: 'POST',
		body: { credential }
	})

	console.log(response)

	// 註冊
	const user_info = response.data.value
	try {
		await useFetch('/api/users/post', {
			method: 'POST',
			body: {
				user_id: user_info.payload.sub,
				name: user_info.payload.name,
				email: user_info.payload.email,
				picture: user_info.payload.picture
			},
		});
	} catch (error) {
		console.log("Already registered or Other Error")
	}

	if (response.status.value !== 'success')
		return;
	return response.data.value
}

</script>

<style>
.login-wrapper {
	width: 80%;
	height: 80%;

	margin-inline: auto;
	display: flex;

	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.login-card {
	height: 300px;
	width: 300px;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.login-card img {
	position: absolute;
	z-index: -1;
}

.login-card .login-content{
	text-align: center;
}
</style>