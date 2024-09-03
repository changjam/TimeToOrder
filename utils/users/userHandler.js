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

export async function getAllUserData() {
  try {
      const response = await $fetch(`/api/users/getAllUsers`, {
          method: 'GET',
      });
      return response;

  } catch (error) {
      throw new Error('Failed to get All UserData');
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

export async function updateUserGroupID(data) {
  const { data: responseData, error } = await useFetch('/api/users/put_group', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });

  if (error.value) {
    console.log(error.value);
    return { success: false, error: error.value };
  }

  if (responseData.value.success) {
    return { success: true, data: responseData.value.data };
  }

  return { success: false, message: 'Update failed' };
}


export async function getAllUsers() {
  try {
    const response = await $fetch(`/api/users/getAll`, {
        method: 'GET',
    });
    return response;

  } catch (error) {
      throw new Error('Failed to get AllUserData');
  }  
}


export async function removeJoinedGroup(data) {
  try {
      const response = await fetch('/api/users/put_joinedGroups', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
  } catch (error) {
      console.error('Error removing group from joinedGroups:', error);
      return { success: false, error };
  }
}
