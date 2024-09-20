import Menu from '@/server/models/Menus';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  try {
    const menu = await Menu.findByIdAndDelete(id);
    if (!menu) {
      return { success: false, message: 'Menu not found' };
    }
    return { success: true, message: 'Menu deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to delete menu', error };
  }
});
