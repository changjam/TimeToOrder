import Restaurant from '@/server/models/Restaurants';
import { parse } from 'url';

export default defineEventHandler(async (event) => {
    const { query } = parse(event.node.req.url, true)

  try {
    const Restaurants = await Restaurant.findOne(query);
    return { success: true, data: Restaurants };
  } catch (error) {
    return { success: false, message: 'Failed to fetch restaurants', error };
  }
});