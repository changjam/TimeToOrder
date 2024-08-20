import Restaurant from '@/server/models/Restaurants';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = event.context.params;

  try {
    const restaurant = await Restaurant.findByIdAndUpdate(id, body, { new: true });
    if (!restaurant) {
      return { success: false, message: 'Restaurant not found' };
    }
    return { success: true, message: 'Restaurant updated successfully', data: restaurant };
  } catch (error) {
    return { success: false, message: 'Failed to update restaurant', error };
  }
});
