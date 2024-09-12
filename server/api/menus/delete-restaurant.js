import Menu from '@/server/models/Menus';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const {restaurant} = body;

    Dish.deleteMany({ restaurant: restaurant }, function(err) {
        if (err) {
            console.log("Error deleting dishes:", err);
        } else {
            console.log("Dishes deleted successfully.");
        }
    });
})
