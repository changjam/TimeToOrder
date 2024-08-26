import Menu from '@/server/models/Menus';

export default defineEventHandler(async (event) => {
  try {
    const menu_id = event._path.match(/_id=([^&]*)/)[1]
    const menu = await Menu.find({restaurant : menu_id}).populate('restaurant');
    if (menu) {
      return { success: true, data: menu };
    } else {
      return { success: false, message: 'Menu not found' };
    }
  } catch (error) {
    return { success: false, message: 'Failed to fetch menu', error };
  }
});
