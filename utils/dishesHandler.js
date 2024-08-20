/**
 * 
 * @param {*} dishes 
 * @returns [Min Max]
 */
export function getPriceRange(dishes) {
    const prices = dishes.map(dish => dish.price)
    return [Math.min(...prices), Math.max(...prices)];
}