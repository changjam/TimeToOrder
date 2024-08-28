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


export async function updateUserGroup(_id, group) {
    try {
      const response = await $fetch(`/api/users/put?_id=${_id}&group=${group}`, {
        method: 'PUT',
      });
      return response;
  
    } catch (error) {
      throw new Error('Failed to update User Group');
    }
  }
  