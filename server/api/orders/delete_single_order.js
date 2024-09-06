import Order from '@/server/models/Orders';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { orderId, userId } = body;

    try {
        const order = await Order.findOne({ _id: new mongoose.Types.ObjectId(orderId) });

        if (!order) {
            return {
                success: false,
                error: 'Order not found',
            };
        }

        const existingOrderIndex = order.orders.findIndex(o => o.user_id === userId);

        if (existingOrderIndex === -1) {
            return {
                success: false,
                error: 'Order not found',
            };
        }

        order.orders.splice(existingOrderIndex, 1);
        const updatedOrder = await order.save();

        return {
            success: true,
            data: updatedOrder,
        };
    } catch (error) {
        return {
            success: false,
            error: '刪除特定訂單失敗',
        };
    }
});
