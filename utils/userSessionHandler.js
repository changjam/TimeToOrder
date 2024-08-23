export async function addUserSession(data) {
  const { error } = await $fetch('/api/user_session/post', {
    method: 'POST',
    body: data
  });

  if (error) {
    console.error(error);
    throw new Error('Failed to add UserSession');
  }
}