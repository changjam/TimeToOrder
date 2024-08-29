<script setup>
import { getPriceRange } from '@/utils/dishesHandler'
const props = defineProps(['items'])
const restaurant = props.items
console.log(restaurant)

const router = useRouter();
const openUrl = (link) => {
    router.push({ path: `/menus2/${link}` })
}

</script>

<template>
    <!-- :title="restaurant.link" @click="openUrl(restaurant.id)" -->
    <div class="menu-card">
        <div class="image-container" @click="openUrl(restaurant._id)">
            <img :src="`${restaurant.image}`" alt="餐廳圖片" class="restaurant-picture">
            <!-- <img src="~assets/images/1.jpg" alt="餐廳圖片" class="restaurant-picture"> -->
        </div>
        <div class="restaurant-info">
            <h2>{{ restaurant.name }}</h2>
            <p>電話:{{ restaurant.phone }}</p>
            <!-- <p>價格:{{ `$${minPrice}~$${maxPrice}` }}</p> -->
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