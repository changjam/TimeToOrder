import User_session from '@/server/models/User_session';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user_session = new User_session(body);

  try {
    await user_session.save();
    return { success: true, message: 'user_session added successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to add user_session', error };
  }
});