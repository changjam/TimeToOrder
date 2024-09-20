import User from "@/server/models/Users";
import { parse } from "url";

export default defineEventHandler(async (event) => {
  const { query } = parse(event.node.req.url, true);
  try {
    const {group_id} = query
    const users = await User.find({
      joinedGroups: group_id
    });

    return { success: true, data: users };
  } catch (error) {
    return { success: false, message: "Failed to get users", error };
  }
});
