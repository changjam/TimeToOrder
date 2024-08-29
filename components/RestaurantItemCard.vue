<script setup>
import { getMenus } from '@/utils/menus/menuHandler';
const priceRange = ref(null)
const props = defineProps(['restaurants'])
const restaurant = props.restaurants
console.log(restaurant._id)
const router = useRouter();
const openUrl = (link) => {
    router.push({ path: `/restaurants/${link}` })
}

const getPriceRange = async (restaurantId) => {
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    try {
        const menu_data = await getMenus(`restaurant=${restaurantId}`);
        for ( const data of menu_data.data){
            const price = data.price;
            if (price < minPrice) minPrice = price;
            if (price > maxPrice) maxPrice = price;
        }
        if (minPrice!== Infinity && maxPrice!== -Infinity){
            priceRange.value = `$${minPrice}~$${maxPrice}` 
        }else{
            priceRange.value = "無資料"
        }
    } catch(error){
        console.log(error)
    }
  };

</script>

<template>
    <div class="menu-card">
        <div class="image-container" @click="openUrl(restaurant._id)">
            <img :src="`${restaurant.image}`" alt="餐廳圖片" class="restaurant-picture">
        </div>
        <div class="restaurant-info">
            <h2>{{ restaurant.name }}</h2>
            <p>電話:{{ restaurant.phone }}</p>
            <p v-if="getPriceRange(restaurant._id)">價格:{{ priceRange }}</p>
        </div>
        <div class="tag-container">
            <div v-for="type in restaurant.types">{{ type }}</div>
        </div>
    </div>
</template>

<style scoped>
.menu-card {
    justify-self: center;
    border: 3px solid var(--gold);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    margin: 1rem;

    position: relative;
    min-height: var(--menu-height);
    width: var(--menu-width);
}

.menu-card:hover {
    cursor: pointer;
}

.image-container {
    height: var(--image-height);
    overflow: hidden;
    width: 100%;
    border-radius: 5px;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: fill;
    border-radius: inherit;
    transform-origin: center center;
    transition: all ease-in-out 0.3s
}

.restaurant-info {
    padding-inline: 1rem;
}

.tag-container {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    gap: 1rem;
    padding: 1rem 1rem 1rem 1rem;

}

.tag-container div {
    display: block;
    width: fit-content;
    background-color: var(--gold);
    padding-inline: 1rem;
    border-radius: 12px;
}
</style>