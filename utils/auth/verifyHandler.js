export async function verify_credential() {
  let response = null;
  try{
    response = await $fetch('/api/auth/auth-verify', {
      method: 'POST'
    })
    return response;
  }catch{
    return;
  }
}