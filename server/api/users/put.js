import User from '@/server/models/Users';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { user_id, joinedGroups, ...otherFields } = body;

    const updateFields = {};

    if (joinedGroups) {
      updateFields.$addToSet = { joinedGroups };
    }

    if (Object.keys(otherFields).length > 0) {
      updateFields.$set = { ...otherFields };
    }

    const user = await User.findOneAndUpdate(
      { user_id },
      updateFields,
      { new: true }
    );

    return { success: true, data: user };
  } catch (error) {
    return { success: false, message: 'Failed to update user', error };
  }
});



