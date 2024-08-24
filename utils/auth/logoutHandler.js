import { addUserSession } from '@/utils/user_session/userSessionHandler'

export async function logout (userInfo) {
  const router = useRouter();
  addUserSession({
    'user_id':userInfo.user_id, 
    'name': userInfo.name, 
    'email': userInfo.email, 
    'actions': "Logout"
  })


  const { data } = await useFetch('/api/auth/logout', {
    method: 'GET'
  })
  router.push('/login')
}