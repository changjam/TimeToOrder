<script setup>
import { getCreatorRestaurant } from '@/utils/restaurants/restaurantHandler';
import { getUserData } from '@/utils/users/userHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import { addOrder } from '@/utils/order/orderHandler'
import { getGroupData } from '@/utils/groups/groupHandler'
import { getFormattedUTCTime, toLocalISOString, oneHourLater } from '@/utils/date/timeHandler'
import noImage from '@/assets/images/noImage.png';

const today = getFormattedUTCTime()
const restaurant_select = ref({ id: 0 })
const group_select = ref({ id: 0 })
const startTime_select = ref(toLocalISOString(new Date()))
const endTime_select = ref(oneHourLater(new Date()))
const orderName_input = ref('');
const notes_input = ref('');
const router = useRouter()
const groupDataList = ref([])
const State = {
    'restaurant': 1,
    'group': 2,
    'time': 3,
    'check': 4,
}
const currentState = ref(State.restaurant)

const selectRestaurant = (restaurant) => {
    restaurant_select.value = restaurant;
}

const selectGroup = (group) => {
    group_select.value = group;
}
const goBack = () => {
    if (currentState.value > State.restaurant)
        currentState.value -= 1;
}
const goNext = () => {
    if (currentState.value < State.check)
        currentState.value += 1;
}

const user_info = ref('')
const restaurants = ref([]);

onMounted(async () => {
    const data = await verify_credential()
    if (!data)
        router.push('/login')

    user_info.value = await getUserData(`user_id=${data.user_id}`)
    const joinedGroups = user_info.value.data.joinedGroups
    user_info.value = user_info.value.data
    for (const group of joinedGroups) {
        const groupData = await getGroupData(`_id=${group}`)
        const user_response = await getUserData(`user_id=${groupData.data.creator}`);
        const creator_name = user_response.data.nickName || user_response.data.name
        groupDataList.value.push({ ...groupData.data, creator_name: creator_name })
    }

    restaurants.value = await getCreatorRestaurant(user_info.value.user_id);
    restaurants.value = restaurants.value.data
    console.log(restaurants.value)
})

const CreateOrder = async () => {
    if (restaurant_select.value.name == undefined) {
        window.alert("請選擇餐廳")
        return
    }
    if (group_select.value.name == undefined) {
        window.alert("請選擇群組")
        return
    }
    if (orderName_input.value == '') {
        window.alert("請輸入訂單名稱")
        return
    }
    if (startTime_select.value == undefined) {
        window.alert("請選擇開始時間")
        return
    }
    if (endTime_select.value == undefined) {
        window.alert("請選擇截止時間")
        return
    }
    if (startTime_select.value >= endTime_select.value) {
        window.alert("開始時間必須小於截止時間")
        return
    }

    const orderData = {
        order_name: orderName_input.value,
        restaurant_id: restaurant_select.value._id,
        order_open_time: startTime_select.value,
        order_lock_time: endTime_select.value,
        creator_id: user_info.value.user_id,
        creator_name: user_info.value.nickName || user_info.value.name,
        group_id: group_select.value._id,
        notes: notes_input.value,
    };

    try {
        await addOrder(orderData);
        router.push('/orders')
    } catch (error) {
        console.error('Error creating order:', error);
        alert('訂單創建失敗.');
    }

}

</script>

<template>
    <div class="create-order-wrapper">
        <div class="create-order-container">
            <nav class="state-selector">
                <span @click="currentState = State.restaurant" :class="{ selected: currentState === 1 }">選擇餐廳</span>
                <span @click="currentState = State.group" :class="{ selected: currentState === 2 }">選擇群組</span>
                <span @click="currentState = State.time" :class="{ selected: currentState === 3 }">選擇時間</span>
                <span @click="currentState = State.check" :class="{ selected: currentState === 4 }">確認訂單</span>
            </nav>


            <main v-if="currentState == State.restaurant" class="restaurant-container">
                <div 
                    v-for="restaurant in restaurants" :key="restaurant._id" 
                    @click="selectRestaurant(restaurant)"
                    @dblclick="goNext"
                    :class="{ selected: restaurant_select._id === restaurant._id }"
                >
                    <img :src="restaurant.image||noImage" alt="Restaurant Image" class="restaurant-image" />
                    <div class="restaurant-info">
                        <h2>{{ restaurant.name }}</h2>
                        <p><strong>電話:</strong> {{ restaurant.phone }}</p>
                        <p><strong>地址:</strong> {{ restaurant.address }}</p>
                    </div>
                    <div class="restaurant-type">
                        <span class="type" v-for="type in restaurant.types">{{ type }}</span>
                    </div>
                </div>
            </main>

            <main v-if="currentState == State.group" class="group-container">
                <div 
                    v-for="group in groupDataList" :key="group._id" 
                    @click="selectGroup(group)"
                    @dblclick="goNext"
                    :class="{ selected: group_select._id === group._id }"
                >
                    <div class="restaurant-info">
                        <h2>{{ group.name }}</h2>
                        <p><strong>成員人數:</strong> {{ group.members.length }}</p>
                        <p><strong>建立時間:</strong> {{ new Date(group.createdAt).toLocaleString() }}</p>
                    </div>
                </div>
            </main>

            <main v-if="currentState == State.time" class="time-container">
                <label for="orderName">訂單名稱</label>
                <input type="text" v-model="orderName_input" id="orderName" placeholder="輸入訂單名稱...">

                <label for="start_at">開始時間</label>
                <input type="datetime-local" v-model="startTime_select" name="" id="start_at" :min="today" default="now">

                <label for="end_at">截止時間</label>
                <input type="datetime-local" v-model="endTime_select" id="end_at" :min="today">
                
                <label for="notes">備註</label>
                <input type="text" v-model="notes_input" id="notes" placeholder="輸入備註...">
            </main>

            <main v-if="currentState == State.check" class="check-container">
                <section class="restaurant">

                    <div v-if="restaurant_select.name">
                        <img :src="restaurant_select.image" alt="Restaurant Image" class="restaurant-image" />
                        <div class="restaurant-info">
                            <h2>{{ restaurant_select.name }}</h2>
                            <p><strong>電話:</strong> {{ restaurant_select.phone }}</p>
                            <p><strong>地址:</strong> {{ restaurant_select.address }}</p>
                        </div>
                    </div>
                </section>

                <section class="others">
                    <span v-if="restaurant_select.name !== undefined">餐廳名稱：{{ restaurant_select.name }}</span>
                    <span v-else class="warning">尚未選擇餐廳</span>

                    <span v-if="group_select.name">群組名稱：{{ group_select.name }}</span>
                    <span v-else class="warning">尚未選擇群組</span>

                    <span v-if="orderName_input != ''">訂單名稱：{{ orderName_input }}</span>
                    <span v-else class="warning">尚未輸入訂單名稱</span>

                    <span v-if="startTime_select">開放時間：{{ new Date(startTime_select).toLocaleString() }}</span>
                    <span v-else class="warning">未設定訂單開始時間</span>

                    <span v-if="endTime_select">截止時間：{{ new Date(endTime_select).toLocaleString() }}</span>
                    <span v-else class="warning">未設定訂單截止時間</span>

                    <span>訂單備註：{{ notes_input === '' ? '無' : notes_input }}</span>
                </section>
            </main>


            <button class="before-step" @click="goBack">上一步</button>
            <button class="next-step" v-if="currentState === State.check" @click="CreateOrder">建立訂單</button>
            <button class="next-step" v-else @click="goNext">下一步</button>
        </div>
    </div>
</template>

<style scoped>
.create-order-wrapper {
    padding-top: 1rem;
    margin-inline: auto;
    width: 90%;
    height: 90%;
    position: relative;
}

.create-order-container {
    background-color: white;
    border: solid 2px var(--black);
    border-radius: 20px;

    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 100%;
}

.create-order-wrapper .state-selector {
    padding: 1rem;
    height: 10%;
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid var(--black)
}

.create-order-wrapper .state-selector>span {
    color: var(--light-blue);
    font-size: 1.5rem;
}

.create-order-wrapper .state-selector>span.selected,
.create-order-wrapper .state-selector>span:hover {
    color: var(--dark-blue);
    cursor: pointer;
}


main.restaurant-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    grid-auto-rows: 400px;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    max-height: 80%;
    overflow-y: auto;
}

main.restaurant-container>div {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: var(--light-gray);
    padding: 1rem;
}

main.restaurant-container>div.selected {
    background: var(--light-blue);
}

main.restaurant-container>div:hover {
    background: var(--light-blue);
    cursor: pointer;
}

main.restaurant-container div .restaurant-image {
    height: 240px;
    object-fit: cover;
}

main.restaurant-container div .restaurant-info {
    height: 100px;
}

.restaurant-type {
    height: fit-content;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;

    display: flex;
    gap: 0.5rem;
}

.restaurant-type::-webkit-scrollbar-thumb {
    background-color: rgb(221, 221, 221);
}

.restaurant-type::-webkit-scrollbar-thumb:hover {
    background-color: rgb(182, 182, 182);
}

.restaurant-type .type {
    padding-inline: 0.5rem;
    background: rgb(221, 221, 221);
    border-radius: 8px;
    height: fit-content;
}

.before-step {
    font-size: 1.5rem;
    position: absolute;
    bottom: 1rem;
    left: 0;
    width: 50%;
}

.next-step {
    font-size: 1.5rem;
    position: absolute;
    bottom: 1rem;
    right: 0;
    width: 50%;
}

.before-step:hover,
.next-step:hover {
    cursor: pointer;
    background: var(--light-blue)
}

.group-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, 300px);
    grid-auto-rows: 120px;
    gap: 1rem;
    padding: 1rem;
    max-height: 80%;
    overflow-y: auto;
}

.group-container>div {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: var(--light-gray);
    padding: 1rem;
}

.group-container>div.selected,
.group-container>div:hover {
    background: var(--light-blue);
    cursor: pointer;
}

.time-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    margin-inline: auto;
    padding: 1rem;
    width: 50%;
    height: 80%;
    min-width: 400px;
}

.time-container>label {
    text-align: center;
    font-size: 1.5rem;
}

.time-container>input {
    text-align: center;
    width: 400px;
    font-size: 1.5rem;
    border-radius: 4px;
}

.check-container {
    display: grid;
    grid-template-columns: 50% 50%;
    padding: 1rem;
    width: 80%;
    height: 80%;
    margin-inline: auto;
    overflow-y: auto;
}

.check-container span {
    font-size: 1.5rem;
}

.check-container .warning {
    color: rgb(232, 55, 55);
}

.check-container section.restaurant {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.check-container section.restaurant>div {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

.check-container section.restaurant>div .restaurant-info {
    padding: 1rem;
}

.check-container section.restaurant img {
    height: 350px;
    width: 350px;
    object-fit: cover;
    margin: 1rem;
    border: 1px solid var(--light-gray)
}

.check-container section.others {
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--black);
    padding: 1rem;
    position: relative;
}

.check-container section.others button.submit {
    font-size: 1rem;
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    padding: 1rem;
}

.check-container section.others button.submit:hover {
    cursor: pointer;
    background: var(--light-blue)
}

@media screen and (max-width: 786px) {
  .check-container {
    display: flex;
    flex-direction: column;
  }
}
</style>