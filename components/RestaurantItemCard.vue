<script setup>
import { getMenus } from '@/utils/menus/menuHandler';
import { getPriceRange } from '@/utils/dishesHandler';
import noImage from '@/assets/images/noImage.png';
const price = ref({ min: '', max: '' })
const props = defineProps(['restaurant'])
const restaurant = props.restaurant
const menu = ref([])

const router = useRouter();
const openUrl = (link) => {
    router.push({ path: `/restaurants/${link}` })
}

onMounted(async () => {    
    menu.value = await getMenus(`restaurant=${props.restaurant._id}`)
    menu.value = menu.value.data    

    if (menu.value.length > 0) {        
        const [minPrice, maxPrice] = getPriceRange(menu.value)
        price.value.min = minPrice
        price.value.max = maxPrice
    }
})

</script>

<template>
    <div class="menu-card">
        <div class="image-container" @click="openUrl(restaurant._id)">
            <img :src="restaurant.image || noImage" alt="餐廳圖片" class="restaurant-picture">
        </div>
        <div class="restaurant-info">
            <h2>{{ restaurant.name }}</h2>
            <p>電話:{{ restaurant.phone }}</p>
            <p v-if="price.max && price.min">價格:{{ `$${price.min} ~ $${price.max} ` }}</p>
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
    background: var(--rice)
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
    display: flex;
    align-items :center;
    width: fit-content;
    background-color: var(--gold);
    padding-inline: 1rem;
    border-radius: 12px;
}
</style>