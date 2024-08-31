<template>

  <div class="login-wrapper">

    <ClientOnly>
      <button ref="login_button" class="google-login" @click="handleGoogleAccessTokenLogin">
        <img src="~/assets/images/plate_white.svg" alt="" id="plate">
        <img ref="login_google" src="~/assets/images/google.svg" alt="" id="google">
      </button>
      <!-- <GoogleLogin :callback="login"></GoogleLogin> -->
    </ClientOnly>
    <h2>快登入，別餓著自己！</h2>
  </div>

</template>

<script setup>
import { onMounted } from 'vue'
import { useFetch } from '#app';
import { addUserSession } from '@/utils/user_session/userSessionHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import { getUserData } from '@/utils/users/userHandler'

const router = useRouter();
const login_button = ref()
const login_google = ref()
const user_data = ref()


import { googleTokenLogin } from 'vue3-google-login'

const handleGoogleAccessTokenLogin = async () => {
  const { access_token } = await googleTokenLogin({ clientId: process.env.GOOGLE_CLIENT_ID });

  if (!access_token) {
    return
  }

  const { data } = await useFetch('/api/auth/google-auth-token', {
    method: 'POST',
    body: { access_token }
  })
  const user_info = data.value.jwtTokenPayload
  if (!user_info) return;
  const response = await getUserData(`user_id=${user_info.user_id}`)

  user_data.value = response.data
  
  // if (user_data.value.customImage){
  //   login_button.value.classList.add("login-animate")
  //   login_google.value.classList.add("round-border")
  //   login_google.value.src = user_data.value.customImage
  // }
  // if (user_data.value.image){
  //   login_button.value.classList.add("login-animate")
  //   login_google.value.classList.add("round-border")
  //   login_google.value.src = user_data.value.image
  // }
  
  login_button.value.classList.add("login-animate")
  login_google.value.classList.add("round-border")
  // login_google.value.src = user_data.value.image

  // Wait for 2 seconds before proceeding
  await new Promise(resolve => setTimeout(resolve, 2000));

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
  } catch (error) {
    console.log("Already registered or Other Error")
  }
  router.push('/');
}

onMounted(async () => {
  const data = await verify_credential()
  const user_info = await getUserData(`user_id=${data.user_id}`)
  const user_id_cookie = useCookie('user_id')
  user_id_cookie.value = user_info.data._id
  user_id_cookie.option = {
    maxAge: 24 * 60 * 60,
    path: '/',
  }
  if (!data) return;
  router.push('/');
})

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

.google-login {

  border-radius: 50%;

  display: flex;
  justify-content: center;
  position: relative;
}

.google-login:hover {
  cursor: pointer;
}

.google-login #plate {
  width: 200px;
  transform-style: preserve-3d;
}

.google-login #google {
  width: 50px;
  max-width: 100%;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.google-login.login-animate {
  animation: plate-animation 2s ease;
}

.login-card .login-content {
  width: 100%;
  text-align: center;
}

.round-border {
  border-radius: 50%;
}

@keyframes plate-animation {
  10% {
    transform: rotateX(30deg);
  }

  40% {
    transform: rotateX(160deg);
  }

  80% {
    transform: rotateX(720deg);
  }

  100% {
    transform: translateY(-450px);
  }
}

.login-card .login-content .login-title {
  margin-bottom: 10px;
}
</style>