import User from '@/server/models/Users';

export default defineEventHandler(async (event) => {
  try {
    const user = await User.find();
    return { success: true, data: user };
  } catch (error) {
    return { success: false, message: 'Failed to fetch user', error };
  }
});