import Group from '@/server/models/Groups';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { groupId, memberData } = body;

    try {
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { $push: { members: memberData } },
            { new: true }
        );

        return {
            success: true,
            data: updatedGroup,
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to update group members',
        };
    }
});
