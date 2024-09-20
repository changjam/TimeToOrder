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
import { googleTokenLogin } from 'vue3-google-login'
import { getUserData } from '@/utils/users/userHandler'


const router = useRouter();
const login_button = ref()
const login_google = ref()


onMounted(async () => {
  const data = await verify_credential()
  if (!data) return;
  router.push('/');
})


const handleGoogleAccessTokenLogin = async () => {
  const { access_token } = await googleTokenLogin({ clientId: process.env.GOOGLE_CLIENT_ID });

  if (!access_token) return;

  const { data } = await useFetch('/api/auth/google-auth-token', {
    method: 'POST',
    body: { access_token }
  })
  const user_info = data.value.jwtTokenPayload
  if (!user_info) return;
  const user_response = await getUserData(`user_id=${user_info.user_id}`)

  await save_to_DB(user_info, user_response);
  await login_animation(user_info, user_response);
  router.push('/');
}

async function login_animation(user_info, user_response){
  return new Promise((resolve, reject) => {
    login_button.value.classList.add("login-animate");
    login_google.value.classList.add("round-border");
    
    let login_image = user_info.image
    if (user_response.data)
      login_image = user_response.data.customImage || user_response.data.image
    login_google.value.src = login_image
    // Wait for 2 seconds before proceeding
    setTimeout(resolve, 2000);
  })
}

async function save_to_DB(user_info, user_response){
  try {
    // add user login session
    addUserSession({
      'user_id': user_info.user_id,
      'name': user_info.name,
      'email': user_info.email,
      'actions': "Login"
    });

    // register
    if (!user_response.data){
      await useFetch('/api/users/post', {
        method: 'POST',
        body: user_info,
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
  }
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
  height: 50px;
  width: 50px;
  object-fit: cover;
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