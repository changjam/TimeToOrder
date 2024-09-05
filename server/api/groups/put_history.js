import Group from '@/server/models/Groups';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { groupId, orderId } = body;

    try {
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { $push: { historicalOrderIds: orderId } },
            { new: true }
        );

        return {
            success: true,
            data: updatedGroup,
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to update historical order IDs',
        };
    }
});
