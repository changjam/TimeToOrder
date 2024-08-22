// import Restaurant from '@/server/models/Restaurants';

// export default defineEventHandler(async (event) => {
//   const body = await readBody(event);
//   const restaurant = new Restaurant(body);

//   try {
//     await restaurant.save();
//     return { success: true, message: 'Restaurant added successfully' };
//   } catch (error) {
//     return { success: false, message: 'Failed to add restaurant', error };
//   }
// });


import Restaurant from '@/server/models/Restaurants';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const restaurant = new Restaurant(body);

  try {
    const savedRestaurant = await restaurant.save();

    // 返回包含餐廳 ID 和其他信息的對象
    return {
      success: true,
      message: 'Restaurant added successfully',
      data: savedRestaurant // 返回保存的餐廳對象
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to add restaurant',
      error
    };
  }
});
