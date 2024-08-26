import { useFetch } from '#app';

export async function addMenu(data) {
  const { error } = await useFetch('/api/menus/post', {
    method: 'POST',
    body: data
  });

  if (error.value) {
    throw new Error('Failed to add menu');
  }
}


export function classifyDishes(dishes) {
  const classified = {};

  dishes.forEach(dish => {
    const { category, name, price, cate_description } = dish;

    if (!classified[category]) {
      classified[category] = [];
    }

    classified[category].push({ name, price, cate_description });
  });

  return classified;
}