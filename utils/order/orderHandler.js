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