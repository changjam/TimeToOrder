import User from '@/server/models/User_session';

import { parse } from 'url';
export default defineEventHandler(async (event) => {
  const { query } = parse(event.node.req.url, true)
  const user_id = query.user_id
  try {
    const user = await User.findOne({user_id: user_id});
    return { success: true, data: user };
  } catch (error) {
    return { success: false, message: 'Failed to fetch User_session', error };
  }
});