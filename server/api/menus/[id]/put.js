import Menu from '@/server/models/Menus';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = event.context.params;

  try {
    const menu = await Menu.findByIdAndUpdate(id, body, { new: true });
    if (!menu) {
      return { success: false, message: 'Menu not found' };
    }
    return { success: true, message: 'Menu updated successfully', data: menu };
  } catch (error) {
    return { success: false, message: 'Failed to update menu', error };
  }
});
