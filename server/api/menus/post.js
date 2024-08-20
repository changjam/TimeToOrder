import Menu from '@/server/models/Menus';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const menu = new Menu(body);

  try {
    await menu.save();
    return { success: true, message: 'Menu added successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to add menu', error };
  }
});
