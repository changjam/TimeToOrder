import { useFetch } from '#app';

export async function addRestaurant(data) {
  const { data: responseData, error } = await useFetch('/api/restaurants/post', {
    method: 'POST',
    body: data
  });

  if (error.value) {
    throw new Error(error.value.message);
  }

  if (responseData.value.success) {
    return responseData.value.data;
  } else {
    throw new Error(responseData.value.message);
  }
}


export async function getAllRestaurant() {
  try{
    const data = await useFetch('/api/restaurants/getAll');
    return data.data.value.data;    
  }catch(error){
    console.log(error);
  }
}

export async function getRestaurant(restaurantID) {
  try{
    const response = await $fetch(`/api/restaurants/get?_id=${restaurantID}`, {
      method: 'GET',
  });    
    return response;
  }catch(error){
    console.log(error);
  }
}

export async function getCreatorRestaurant(user_id) {
  try{
    const response = await $fetch(`/api/restaurants/gets?creator=${user_id}`, {
      method: 'GET',
  });    
    return response;
  }catch(error){
    throw new Error(`Failed to get User:${user_id} owned Restaurant`);
  }
}

export async function updateRestaurant(id, updateFields) {
  try {
    const response = await $fetch(`/api/restaurants/${id}/put`, {
      method: 'PUT',
      body: {        
        ...updateFields,
      },
    });
    return response;
  } catch (error) {
    throw new Error('Failed to update Restaurant');
  }
}