export async function verify_credential() {
  const response = await $fetch('/api/auth/auth-verify', {
    method: 'POST'
  })
  if (!response)
    return;
  return response
}