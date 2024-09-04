import Group from '@/server/models/Groups';

import { parse } from 'url';
export default defineEventHandler(async (event) => {
  const { query } = parse(event.node.req.url, true)

  try {
    const group = await Group.findOne(query);
    return { success: true, data: group };
  } catch (error) {
    return { success: false, message: 'Failed to fetch group', error };
  }
});