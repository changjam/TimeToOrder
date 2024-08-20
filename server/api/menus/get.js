import Menu from '@/server/models/Menus';

export default defineEventHandler(async (event) => {
  try {
    const menus = await Menu.find().populate('restaurant');
    return { success: true, data: menus };
  } catch (error) {
    return { success: false, message: 'Failed to fetch menus', error };
  }
});