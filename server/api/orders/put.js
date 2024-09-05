import Order from '@/server/models/Orders';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { orderId, Status } = body;
    
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { status: Status } },
            { new: true }
        );

        return {
            success: true,
            data: updatedOrder,
        };
    } catch (error) {
        return {
            success: false,
            error: error,
        };
    }
});
