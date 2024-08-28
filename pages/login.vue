<template>
	<div class="login-wrapper">
		<div class="login-card">
			<img src="~/assets/images/plate.svg" alt="">
			<div class="login-content">
				<h2 class="login-title">快登入，別餓著自己！</h2>
				<ClientOnly>
					<GoogleLogin :callback="login" />
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useFetch } from '#app';
  import { addUserSession } from '@/utils/user_session/userSessionHandler'
  import { verify_credential } from '@/utils/auth/verifyHandler'
  import { getUserData } from '@/utils/users/userHandler'
  import { useCookie } from '#app'

  const router = useRouter();

  onMounted(async () => {
    const data = await verify_credential()
    const user_info = await getUserData(`user_id=${data.user_id}`)
    const user_id_cookie = useCookie('user_id')
    user_id_cookie.value = user_info.data._id
    user_id_cookie.option = {
      maxAge: 24*60*60,
      path: '/',
    }
    if (!data) return;
    router.push('/');
  })

  const login = async (response) => {
    // credential => JWT(JSON Web Token)
    const { credential } = response
    
    const { data } = await useFetch('/api/auth/google', {
      method: 'POST',
      body: {credential}
    })
    const user_info = data.value.jwtTokenPayload
    console.log(user_info)
    if (!user_info) return;

    // add user login session
    addUserSession({
      'user_id': user_info.user_id, 
      'name': user_info.name, 
      'email': user_info.email,
      'actions': "Login"
    })

    // register
    try {
      await useFetch('/api/users/post', {
        method: 'POST',
        body: user_info,
      });
    }catch(error){
      console.log("Already registered or Other Error")
    }
    router.push('/');
  }
</script>

<style scoped>
.login-wrapper {
	width: 100%;
	height: 100%;

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
  width: 100%;
	text-align: center;
}

.login-card .login-content .login-title{
  margin-bottom: 10px;
}
</style>