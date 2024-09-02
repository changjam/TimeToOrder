import Group from '@/server/models/Groups';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const groupId = body._id;

  try {
    // 將 groupId 轉換為 ObjectId，然後根據 _id 刪除
    const group = await Group.findByIdAndDelete(groupId);
    return { success: true, data: group };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Failed to delete Group', error };
  }
});
