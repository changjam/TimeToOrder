import User from '@/server/models/Users';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const groupId = body.joinedGroups;

    const result = await User.updateMany(
      { 'joinedGroups': groupId },
      { $pull: { joinedGroups: groupId } }
    );

    return { success: true, data: result };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Failed to update users', error };
  }
});
