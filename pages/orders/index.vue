<script setup>
import { getUserData } from '@/utils/users/userHandler'
import { getOrders, updateStatus, check_status } from '@/utils/order/orderHandler'
import { getMenus } from '@/utils/menus/menuHandler';
import { verify_credential } from '@/utils/auth/verifyHandler'
import { useRouter } from '#app';
import { updateGroupOrder } from '@/utils/groups/groupHandler';
import { full_time_format } from '@/utils/date/timeHandler'

const orders = ref([])
const user_id = ref('')
const router = useRouter();


onMounted(async() => {
    const data = await verify_credential()
    if (!data) 
        router.push('/login');
    user_id.value = data.user_id
    const user_info = await getUserData(`user_id=${user_id.value}`);
    const joinedGroups = user_info.data.joinedGroups;
    
    let local_orders = [];
    for (const group of joinedGroups){
        const info = await getOrders(`group_id=${group}`);
        for (const d of info.data){
            local_orders.push({
                ...d,
                priceRange: await getPriceRange(d.restaurant_id._id)
            })
        }
    }

    orders.value = await get_valid_order(local_orders).then((res)=>{
        return res.sort((a, b) => {
            if (a.status >= b.status)
                return 1
            else
                return -1
        })
    });
})

async function get_valid_order(order_list){
    const valid_orders = [];

    for (const order of order_list) {
        const _response = await check_status(order);
        if (_response)
            valid_orders.push(_response);
    }
    return valid_orders;
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

        if (minPrice === Infinity && maxPrice === -Infinity){
            return '未知'
        }else{
            return `$${minPrice}~$${maxPrice}`
        }
    } catch(error){
        console.log(error)
    }
};

const toOrder = async (order) => {
    router.push(`/orders/${order._id}`);
}

const change_order_status = async (order_id, group_id, status) => {
    const userConfirmed = confirm('確定結束訂單?');

    if (!userConfirmed)
        return;

    try{
        await updateStatus({orderId: order_id , Status: status})
        await updateGroupOrder({ groupId: group_id, orderId: order_id });
    }catch(error){
        console.log(error)
        alert("關閉失敗")
    }
    
    location.reload()
}

</script>

<template>
    <div v-if="orders" class="order-wrapper">
        <h1 class="error-msg">新增其他訂單</h1>
        <nav class="features">
            <CreateOrderCard />
        </nav>
        <div class="order-list">
            <div 
                class="order-container"
                :class="order.status"
                v-for="order in orders" :key="order._id" 
                @click="toOrder(order)"
            >
                <section class="main">
                    <h1 class="order_name">{{ order.order_name }}</h1>
                    <span class="master creator">創建人:{{ order.creator_name }}</span>
                    <span class="master status">訂單狀態:{{ order.status }}</span>
                    <button class="order_status_btn finished" v-if="order.creator_id === user_id" @click.stop="change_order_status(order._id, order.group_id, 'Finished')">結束訂單</button>
                    <button class="order_status_btn canceled" v-if="order.creator_id === user_id" @click.stop="change_order_status(order._id, order.group_id, 'Canceled')">取消訂單</button>
                </section>
                <section class="info">
                    <span>價格區間: {{ order.priceRange }}</span>
                    <span>點餐時間: {{ full_time_format(order.order_open_time) }} - {{ full_time_format(order.order_lock_time) }}</span>
                </section>
            </div>
        </div>
    </div>

</template>

<style scoped>
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    grid-auto-rows: 400px;
    justify-content: center;
    gap: 1rem;
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
    margin: 20px 0;
}
.order-container:hover{
    cursor: pointer;
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

.order-container .main .order_status_btn{
    width: 150px;
    height: auto;
    border-radius: 20px;
    font-size: 24px;
}
.order-container .main .order_status_btn:hover{
    cursor: pointer;
}
.finished{background: #b1fcf6;}
.finished:hover{background: #88c2bd;}
.canceled{background: #ffa5a5;}
.canceled:hover{background: #d48989;}

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

.Locked{
    border: 3px solid #924848;
}
</style>