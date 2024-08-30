export async function getUserData(data) {
    try {
        const response = await $fetch(`/api/users/get?${data}`, {
            method: 'GET',
        });
        return response;

    } catch (error) {
        throw new Error('Failed to get UserData');
    }
}

export async function updateUser(id, updateFields) {
  try {
    const response = await $fetch(`/api/users/put`, {
      method: 'PUT',
      body: {
        user_id: id,
        ...updateFields,
      },
    });
    return response;
  } catch (error) {
    throw new Error('Failed to update User');
  }
}
