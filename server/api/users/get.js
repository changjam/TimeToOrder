import User from '@/server/models/Users';

import { parse } from 'url';
export default defineEventHandler(async (event) => {
  const { query } = parse(event.node.req.url, true)

  try {
    const user = await User.findOne(query);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, message: 'Failed to fetch user', error };
  }
});