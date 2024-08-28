<script setup>
import { useCookie } from '#app'
import { getUserData } from '@/utils/users/userHandler'
import { getOrders } from '@/utils/order/orderHandler'

const _orders = ref(null)
let endtime = new Date(Date.now());
timeFormating(endtime)

onMounted(async() => {
    const user_id = useCookie('user_id').value;
    const user_info = await getUserData(`_id=${user_id}`);
    const joinedGroups = user_info.data.joinedGroups;
    console.log(joinedGroups[0])

    /////////////////// info 是可以給前端用的資訊
    for (const group of joinedGroups){
        const info = await getOrders(group);
        console.log(info.data[0])
    }
})

function timeFormating(time) {
    const _ISOString = time.toISOString()
    const timeString = _ISOString.substr(11, 8)
    const dateString = _ISOString.substr(5, 5)
    
    return [timeString, dateString]
}


const getUserOrder = () => {
    // 根據使用者ID找到可以訂購的訂單
}
</script>

<template>
    <div v-if="_orders" class="order-wrapper">
        <div class="order-list">

            <div class="order-container">
                <section class="main">
                    <h1>皋月現代日本料理</h1>
                    <span class="master">訂購人:葉晉瑋</span>
                </section>
                <section class="info">
                    <span>價位$100~$200</span>
                    <span>截止時間 {{ timeFormating(endtime)[0]  }} </span>
                </section>
            </div>


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