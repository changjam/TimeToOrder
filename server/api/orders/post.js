import Orders from '@/server/models/Orders';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const order = new Orders(body);

  try {
    await order.save();
    return { success: true, message: 'Orders added successfully' };
  } catch (error) {
    return { success: false, message: 'Failed to add Orders', error };
  }
});