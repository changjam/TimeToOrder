import { useFetch } from "#app";

export async function addMenu(data) {
  const { data: responseData, error } = await useFetch("/api/menus/post", {
    method: "POST",
    body: data,
  });

  if (error.value) {
    throw new Error("Failed to add menu");
  }

  if (responseData.value.success) {
    return responseData.value.data;
  } else {
    throw new Error(responseData.value.message);
  }
}

export async function updateMenu(menuId, updateFields) {
  const { data: responseData, error } = await useFetch(
    `/api/menus/${menuId}/put`,
    {
      method: "PUT",
      body: {
        ...updateFields,
      },
    }
  );

  if (error.value) {
    throw new Error(`Failed to update menu ${menuId}`);
  }

  if (responseData.value.success) {
    return responseData.value.data;
  } else {
    throw new Error(responseData.value.message);
  }
}

export function classifyDishes(dishes) {
  const classified = {};

  dishes.forEach((dish) => {
    const { category, name, price, cate_description, _id, restaurant } = dish;

    if (!classified[category]) {
      classified[category] = [];
    }

    classified[category].push({
      _id,
      restaurant,
      name,
      price,
      cate_description,
    });
  });

  return classified;
}

export async function getMenus(data) {
  try {
    const response = await $fetch(`/api/menus/get?${data}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw new Error("Failed to get MenuData");
  }
}

export async function deleteMenus(data) {
  try {
    const response = await $fetch(`/api/menus/delete-restaurant?${data}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw new Error("Failed to get MenuData");
  }
}

export async function deleteMenu(menuId) {
  try {
    const response = await $fetch(`/api/menus/${menuId}/delete`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw new Error("Failed to delete MenuData");
  }
}
