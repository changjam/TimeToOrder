import Order from '@/server/models/Orders';

import { parse } from 'url';
export default defineEventHandler(async (event) => {
  const { query } = parse(event.node.req.url, true)

  try {
    const order = await Order.find(query).populate('restaurant_id');
    return { success: true, data: order };
  } catch (error) {
    return { success: false, message: 'Failed to fetch order', error };
  }
});