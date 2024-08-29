<script setup>
import { useCookie } from '#app'
import { getUserData } from '@/utils/users/userHandler'
import { getOrders } from '@/utils/order/orderHandler'
import { getMenus } from '@/utils/menus/menuHandler';

const order = ref([])
const creator = ref(null)
const priceRange = ref(null)

onMounted(async() => {
    const user_id = useCookie('user_id').value;
    const user_info = await getUserData(`_id=${user_id}`);
    const joinedGroups = user_info.data.joinedGroups;

    /////////////////// info 是可以給前端用的資訊
    for (const group of joinedGroups){
        const info = await getOrders(group);
        if (info.data[0]){
            order.value.push(info.data[0])
        }
    }
})

function timeFormating(time) {
    const date = new Date(time);
    const timeString = date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateString = date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
    
    return `${dateString} ${timeString}`;
}


async function getCreatorName(id){
    const user_info = await getUserData(`_id=${id}`);
    creator.value = user_info.data.name
    return creator.value
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
    priceRange.value = `$${minPrice}~$${maxPrice}`
    } catch(error){
        console.log(error)
    }
  };

</script>

<template>
    <div v-if="order" class="order-wrapper">
        <div class="order-list">
            <div class="order-container" v-for="item in order" :key="item._id" @click="$router.push(`restaurants/${item.restaurant_id._id}`)">
                <section class="main">
                    <h1>{{ item.order_name }}</h1>
                    <span class="master" v-if="getCreatorName(item.creator_id)">創建人:{{ creator }}</span>
                </section>
                <section class="info">
                    <span v-if="getPriceRange(item.restaurant_id._id)">價格: {{ priceRange }}</span>
                    <span>截止時間: {{ timeFormating(item.order_lock_time) }}</span>
                </section>
            </div>
        <h1 class="error-msg">新增其他訂單</h1>
        <nav class="features">
            <CreateOrderCard />
        </nav>

        </div>
    </div>

    <div v-else class="order-wrapper">
        <h1 class="error-msg">看起來沒有訂單可以點，你可以</h1>
        <nav class="features">
            <CreateOrderCard />
        </nav>
    </div>


</template>

<style>
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    grid-auto-rows: 400px;
    justify-content: center;
    gap: 1rem;
    height: 75%;
    margin-top: 1rem;
}

.order-wrapper {
    padding: 50px 0;
    width: 80%;
    margin-inline: auto;
}

.error-msg {
    text-align: center;
}

.order-list {
    width: 100%;
    grid-auto-rows: 200px;
}

.order-container {
    background: var(--dark-blue);
    border: 3px solid var(--black);
    padding: 1rem;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    z-index: 0;
}

.order-container::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 400px;
    border-radius: 50%;

    top: -175px;
    left: -100px;
    background: white;
    z-index: -1;
}

.order-container .main {
    display: flex;
    align-items: end;
    gap: 1rem
}

.order-container .master {
    color: rgb(150, 150, 150);
}

.order-container .main h1 {
    font-size: 2rem;
}

.order-container .info {
    width: 70%;
    padding-left: 2rem;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    line-height: 2rem;
}

.order-container span {
    font-size: 1.2rem;
}
</style>