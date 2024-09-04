<script setup>
import { getUserData } from '@/utils/users/userHandler'
import { getOrders, updateStatus } from '@/utils/order/orderHandler'
import { getMenus } from '@/utils/menus/menuHandler';
import { verify_credential } from '@/utils/auth/verifyHandler'
import { useRouter } from '#app';

const order = ref([])
const user_id = ref('')
const router = useRouter();
const order_id = useState('order_id', () => '')

async function getUserInfo() {
  const data = await verify_credential()
  if (!data) {
    router.push('/login')
  } else {
    return data.user_id
  }
}
user_id.value = await getUserInfo()

onMounted(async() => {
    const data = await verify_credential()
    user_id.value = data.user_id
    const user_info = await getUserData(`user_id=${user_id.value}`);
    const joinedGroups = user_info.data.joinedGroups;

    /////////////////// info 是可以給前端用的資訊
    for (const group of joinedGroups){
        const info = await getOrders(group);
        for (const data of info.data){
            Object.assign(data, {creator: await getCreatorName(data.creator_id)})
            Object.assign(data, {priceRange: await getPriceRange(data.restaurant_id._id)})
            if (data){
                order.value.push(data)
            } 
        }    
    }
    console.log(order.value)
    monitorOrderStatus(order.value)
})

function timeFormating(time) {
    const date = new Date(time);
    const timeString = date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateString = date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
    
    return `${dateString} ${timeString}`;
}


async function getCreatorName(id){
    const user_info = await getUserData(`user_id=${id}`);
    return user_info.data.name
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

const toOrder = ( restaurant_id, orderID ) => {
    order_id.value = orderID;
    router.push(`restaurants/${restaurant_id}`);
}


const monitorOrderStatus = (activeOrders) => {
    const intervalId = setInterval(() => {
        const now = new Date().toISOString();

        activeOrders = activeOrders.filter(item => {
            const { order_open_time: openTime, order_lock_time: lockTime, hasOpened, hasClosed } = item;

            if (!hasOpened && now >= openTime && now < lockTime) {
                console.log(`開放 : ${item.order_name}`);
                item.hasOpened = true; // 標記為已開放

            } else if (!hasClosed && now >= lockTime) {
                console.log(`關閉 : ${item.order_name}`);
                item.hasClosed = true; // 標記為已關閉
                return false; // 移除已關閉的訂單
            }
            return true; // 保留尚未關閉的訂單
        });

        if (activeOrders.length === 0) {
            clearInterval(intervalId); // 停止檢查，因為所有訂單都已關閉
        }
    }, 1000);
};

const close_order = async (ID, status, group_id) => {
    console.log(group_id)
    if (status === "Finished"){
        alert("已為關閉狀態")
        return
    }

    try{
        await updateStatus({orderId: ID , Status: "Finished"})
        alert("成功關閉")
    }catch(error){
        console.log(error)
        alert("關閉失敗")
    }
    
    location.reload()
}

</script>

<template>
    <div v-if="order" class="order-wrapper">
        <div class="order-list">
            <div class="order-container" v-for="item in order" :key="item._id" @click="toOrder( item.restaurant_id._id, item._id )">
                <section class="main">
                    <h1>{{ item.order_name }}</h1>
                    <span class="master">創建人:{{ item.creator }}</span>
                    <span class="master">訂單狀態:{{ item.status }}</span>
                    <button v-if="item.creator_id === user_id" @click.stop="close_order(item._id, item.status, item.group_id)">結束訂單</button>

                </section>
                <section class="info">
                    <span>價格: {{ item.priceRange }}</span>
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