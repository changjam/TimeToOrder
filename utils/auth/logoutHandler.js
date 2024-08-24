export async function logout (userInfo) {
  const router = useRouter();

  // const userId = new mongoose.Types.ObjectId(useState('user_id').value);
  // const userName = useState('name').value;
  addUserSession({'user_id':userInfo.user_id, 'name': userInfo.name, 'actions': "Logout"})

  // useState('user_id').value = null;
  // useState('name').value;

  const { data } = await useFetch('/api/auth/logout', {
    method: 'GET'
  })
  router.push('/login')
}