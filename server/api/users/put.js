import User from '@/server/models/Users';
import { parse } from 'url';

export default defineEventHandler(async (event) => {
  const { query } = parse(event.node.req.url, true);
  
  const { _id, group } = query;

  try {
    const user = await User.findOneAndUpdate(
      { _id },
      { $addToSet: { joinedGroups: group } }, 
      { new: true }
    );

    return { success: true, data: user };
  } catch (error) {
    return { success: false, message: 'Failed to update user', error };
  }
});
