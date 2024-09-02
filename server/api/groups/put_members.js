import Group from '@/server/models/Groups';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { groupId, memberId } = body;

    try {
        const updatedGroup = await Group.findOneAndUpdate(
            { _id: groupId, 'members.id': memberId },
            { $pull: { members: { id: memberId } } },
            { new: true }
        );

        return {
            success: true,
            data: updatedGroup,
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to remove member from group',
        };
    }
});
