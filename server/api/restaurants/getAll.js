import Restaurant from '@/server/models/Restaurants';

export default defineEventHandler(async (event) => {
  try {
    const restaurants = await Restaurant.find();
    return { success: true, data: restaurants };
  } catch (error) {
    return { success: false, message: 'Failed to fetch restaurants', error };
  }
});