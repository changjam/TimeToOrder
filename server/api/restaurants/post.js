import Restaurant from '@/server/models/Restaurants';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const restaurant = new Restaurant(body);

  try {
    await restaurant.save();
    return { success: true, message: 'Restaurant added successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to add restaurant', error };
  }
});
