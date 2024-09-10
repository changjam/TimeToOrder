export async function addOrder(data) {
    const { error } = await $fetch('/api/orders/post', {
      method: 'POST',
      body: data
    });
  
    if (error) {
      throw new Error(error);
    }
  }


export async function getOrders(info) {
  try {
    const { data, error } = await useFetch(`/api/orders/get?${info}`, {
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

export async function updateOrder(orderId, orders, userId) {
  try {
      const response = await fetch('/api/orders/put_order', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId, orderData: orders, userId }),
      });

      const result = await response.json();
      return result;
  } catch (error) {
      console.error('更新或新增訂單時出錯:', error);
      return { success: false, error };
  }
}

export async function deleteSingleOrder(orderId, userId) {
  try {
      const response = await fetch('/api/orders/delete_single_order', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId, userId }),
      });

      const result = await response.json();
      return result;
  } catch (error) {
      console.error('刪除特定訂單失敗:', error);
      return { success: false, error };
  }
}


export async function updateStatus(data) {
  try {
      const response = await fetch('/api/orders/put', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
  } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error };
  }
}

export async function check_status(order) {
  const now = new Date().toISOString();
  const { _id, status, order_open_time, order_lock_time } = order;
  if (status === 'Finished' || status === 'Canceled')
    return;

  if (now < order_open_time || now >= order_lock_time){
      if (status === 'Available')
          await updateStatus({orderId: _id , Status: 'Locked'})
  }
  else {
      if (status === 'Locked')
          await updateStatus({orderId: _id , Status: 'Available'})
  }
  return order;
}