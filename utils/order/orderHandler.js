export async function addOrder(data) {
    const { error } = await $fetch('/api/orders/post', {
      method: 'POST',
      body: data
    });
  
    if (error) {
      console.error(error);
      throw new Error('Failed to add orders');
    }
  }


export async function getOrders(groupId) {
  try {
    const { data, error } = await useFetch(`/api/orders/get?group_id=${groupId}`, {
      method: 'GET',
    });

    if (error.value) {
      throw new Error('Failed to fetch menus');
    }

    return data.value;
  } catch (error) {
    console.error('Failed to fetch menus:', error);
    throw error;
  }
}