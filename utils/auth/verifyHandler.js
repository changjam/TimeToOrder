export async function verify_credential() {
  const response = await useFetch('/api/auth/auth-verify', {
    method: 'POST'
  })
  if (response.status.value != 'success')
    return;
  return response.data.value
}