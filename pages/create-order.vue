<script setup>
import { getRestaurant } from '@/utils/restaurants/restaurantHandler';
import { getGroupData } from '@/utils/groups/groupHandler';
import { getUserData } from '@/utils/users/userHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'

const today = new Date().toISOString().substr(0, 10) + "T00:00:00"
const restaurant_select = ref()
const group_select = ref()
const endTime_select = ref()
const router = useRouter()


const restaurant_change = (event) => {
    if (event.target.value != "create-restaurant")
        return
    router.push({ path: '/restaurant/create' })
}

const group_change = (event) => {
    if (event.target.value != "create-group")
        return
    router.push({ path: '/create-group' })
}

const user_id = ref('')
const restaurants = ref([]);
const groupDataList = ref([]);

// get Group and Restaurants
async function fetchData() {
    try {
        const data = await getRestaurant();
        restaurants.value = data;

        const user_info = await getUserData(`user_id=${user_id.value}`);
        const joinedGroups = user_info.data.joinedGroups;

        for (const group of joinedGroups) {
            const groupdata = await getGroupData(`_id=${group}`);
            groupDataList.value.push(groupdata.data);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


onMounted(async () => {
    const data = await verify_credential()
    if (!data)
        router.push('/login')

    user_id.value = data.user_id;
    fetchData();
})


const CreateOrder = async() => {
    const _restaurant = restaurant_select.value.value;
    const _group = group_select.value.value;
    const _endTime = endTime_select.value.value
    if (_restaurant == "none") {
        window.alert("請選擇餐廳")
        return
    }
    if (_group == "none") {
        window.alert("請選擇群組")
        return
    }

    const orderData = {
      order_name: orderName.value,
      creator_id: user_id.value,
      restaurant_id: selectedRestaurantId.value,
      group_id: selectedGroupId.value,
      notes: notes.value,
    };

    try {
      await addOrder(orderData);
      console.log("orderData:",orderData)
      alert('訂單創建成功!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('訂單創建失敗.');
    }

}


</script>

<template>
    <div class="create-order-wrapper">
        <div class="create-order-container">
            <nav>
                <label for="restaurant-select">選擇餐廳:</label>
                <select name="restaurant" id="restaurant-select" ref="restaurant_select" @change="restaurant_change">
                    <option value="none">--請選擇餐廳--</option>
                    <option v-for="restaurant in restaurants" :value="restaurant._id" :key="restaurant._id">{{restaurant.name}}</option>
                    <option value="create-restaurant">--建立新餐廳--</option>
                </select>

                <label for="group-select">群組:</label>
                <select name="group" id="group-select" ref="group_select" @change="group_change">
                    <option value="none">--請選擇群組--</option>                    
                    <option v-for="group in groupDataList" :value="group._id" :key="group._id">{{group.name}}</option>
                    <option value="create-group">--建立新群組--</option>
                </select>


                <label for="endTime-select">期限:</label>
                <input ref="endTime_select" type="datetime-local" id="endTime-select" :value="today"
                    :min="today" />
                <button @click="CreateOrder">建立</button>
            </nav>

            <main>
                <img src="~/assets/images/1.jpg" alt="" srcset="">
                <section>
                    <div class="restaurant-review">
                        餐廳:Restaurant.name
                        餐廳地址:Restaurant.address
                        餐廳電話:Restaurant.
                    </div>
                    <div class="group-review">
                        群組:group.name
                        群組成員:group.members
                    </div>
                    <div class="endtime-review">
                        截止期限:{{ endTime_select }}
                    </div>
                </section>
            </main>
        </div>
    </div>
</template>

<style>
.create-order-wrapper {
    padding-top: 1rem;
    margin-inline: auto;
    width: 90%;
    height: 80%;
    position: relative;
}

.create-order-container {
    background-color: white;
    border: solid 2px var(--black);
    border-radius: 20px;

    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.create-order-wrapper nav {
    padding: 1rem;
    height: 10%;
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-inline: 1rem;
    border-bottom: 1px solid var(--black)
}

.create-order-wrapper main {
    padding-inline: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.create-order-wrapper main section {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
}

.create-order-wrapper main section>div {
    border-bottom: 1px solid var(--black);
}
</style>