import Menu from '@/server/models/Menus';
import { parse } from 'url';

export default defineEventHandler(async (event) => {
  const { query } = parse(event.node.req.url, true)

  try {
    const menu = await Menu.find(query);
    return { success: true, data: menu };
  } catch (error) {
    return { success: false, message: 'Failed to fetch menu', error };
  }
});
