import { useFetch } from '#app';

export async function addRestaurant(data) {
  const { data: responseData, error } = await useFetch('/api/restaurants/post', {
    method: 'POST',
    body: data
  });

  if (error.value) {
    throw new Error('Failed to add restaurant');
  }

  if (responseData.value.success) {
    return responseData.value.data;
  } else {
    throw new Error(responseData.value.message);
  }
}


export async function getRestaurant() {
  try{
    const data = await useFetch('/api/restaurants/get');
    return data.data.value.data;    
  }catch(error){
    console.log(error);
  }

}
