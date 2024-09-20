import User from '@/server/models/Users';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { userId, groupId } = body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { user_id: userId },
            { $pull: { joinedGroups: groupId } },
            { new: true }
        );

        return {
            success: true,
            data: updatedUser,
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to remove group from joinedGroups',
        };
    }
});
