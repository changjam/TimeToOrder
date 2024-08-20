import Restaurant from '@/server/models/Restaurants';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  try {
    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) {
      return { success: false, message: 'Restaurant not found' };
    }
    return { success: true, message: 'Restaurant deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to delete restaurant', error };
  }
});
