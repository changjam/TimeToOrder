import User from '@/server/models/Users';


export default defineEventHandler(async (event) => { 
  try {
    const users = await User.find({});
    return { success: true, data: users };
  } catch (error) {
    return { success: false, message: 'Failed to fetch all user', error };
  }
});