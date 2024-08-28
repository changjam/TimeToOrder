import Group from '@/server/models/Groups';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const group = new Group(body);

  try {
    await group.save();
    return { success: true, data: group };
  } catch (error) {
    return { success: false, message: 'Failed to add Group', error };
  }
});
