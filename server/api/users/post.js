import User from '@/server/models/Users';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = new User(body);

  try {
    await user.save();
    return { success: true, message: 'User added successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to add User', error };
  }
});
