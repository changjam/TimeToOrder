<script setup>
import { ref, onMounted , onBeforeUnmount } from 'vue';
import { getMenus, classifyDishes } from '@/utils/menus/menuHandler';
import { useRoute, useRouter } from '#app';
import { getUserData } from '@/utils/users/userHandler';
import { verify_credential } from '@/utils/auth/verifyHandler';
import { getOrders } from '@/utils/order/orderHandler';
import { updateOrder, deleteSingleOrder, check_status } from '@/utils/order/orderHandler';
import { getFormattedUTCTime, full_time_format } from '@/utils/date/timeHandler';

const route = useRoute();
const router = useRouter();

const menu_data = ref(null);
const classifiedDishes = ref(null);
const order_info = ref(null);
const order_id = ref('');
const user_info = ref('');
const total_amount = ref(0);
const categories = ref(null);
const userOrder = ref({});
const orderResult = ref({});

const goBack = () => {
  router.push('/orders');
};

onMounted(async () => {
  const data = await verify_credential()
  if (!data) 
    return router.push('/login');

  const user_id = data.user_id
  user_info.value = await getUserData(`user_id=${user_id}`);
  order_id.value = route.fullPath.match(/\/orders\/(.+)/)[1];

  order_info.value = await getOrders(`_id=${order_id.value}`).then((res)=> res.data[0]);
  const restaurant_id = order_info.value.restaurant_id._id;
  total_amount.value = get_total_amount();

  await fetchMenus(restaurant_id);
  orderResult.value = order_info.value.orders.filter((order)=> order.user_id === user_id)[0];
});

function check_order_status(){
  if (order_info.value.status !== 'Available'){
    return false; 
  }
  return true;
}

const isChanged = computed(() => {
  for (const [key, dish] of Object.entries(userOrder.value)) {
    const { amount } = dish;
    if(amount)
      return true
  }
  return false;
});

const get_total_amount = () => {
  let _total = 0;
  order_info.value.orders.forEach((each_order)=>{
    _total += each_order.totalAmount;
  })
  return _total;
} 

const fetchMenus = async (restaurantId) => {
    try {
      menu_data.value = await getMenus(`restaurant=${restaurantId}`).then((res)=> res.data);
      classifiedDishes.value = classifyDishes(menu_data.value);
      categories.value = Object.keys(classifiedDishes.value);
      menu_data.value.forEach((dish)=>{
        const { _id, ...data } = dish;
        userOrder.value[_id] = {...data, amount: 0, remark: ""};
      })
    }catch(error) {
      console.error(error)
    }
};

const send_order = async () => {
  const valid_order_status = check_order_status();
  if (!isChanged || !valid_order_status)
    return;

  const orderDetails = {
    name: user_info.value.data.nickName || user_info.value.data.name,
    totalAmount: NaN,
    orderedItems: [],
    user_id: user_info.value.data.user_id  
  }

  let total = 0;
  for (const [key, dish] of Object.entries(userOrder.value)){
    total += dish.amount * dish.price;
    if (dish.amount > 0){
      orderDetails.orderedItems.push({
        name: dish.name,
        price: dish.price,
        amount: dish.amount,
        remark: dish.remark
      });
    }
  }
  orderDetails.totalAmount = total;
  try{
    await updateOrder(order_id.value, orderDetails, user_info.value.data.user_id)
    location.reload()
  }catch(error){
    console.error(error)
    alert("訂單送出失敗")
  }
}

const clear_order = async () => {
  const valid_order_status = check_order_status();
  if (!valid_order_status)
    return;

  const userConfirmed = confirm('確定刪除?');
  if (!userConfirmed)
    return;
  
  try{
    await deleteSingleOrder(order_id.value, user_info.value.data.user_id)
    location.reload()
  }catch(error){
    console.error(error)
  }
}
</script>


<template>
  <div class="order-header" v-if="order_info">
    <div class="go_back_btn_container">
      <button class="go_back_btn" @click="goBack()"> back </button>
    </div>
    <div class="title-container">
      <h1 class="order-title">{{ order_info.order_name }} <span class="separator">｜</span> {{ order_info.restaurant_id.name }}</h1>
    </div>

    <div class="order-info">
      <div class="info-item">
        <h2 class="info-label">發起人:</h2>
        <span class="info-text">{{ order_info.creator_name }}</span>
      </div>
      <div class="info-item">
        <h2 class="info-label">訂餐時間:</h2>
        <span class="info-text">{{ full_time_format(order_info.order_open_time) }} - {{ full_time_format(order_info.order_lock_time) }}</span>
      </div>
    </div>
    <div class="order-status-container">
      <span class="status" :class="{'active': order_info.status === 'Available'}">Available</span>
      <span class="status" :class="{'active': order_info.status === 'Locked'}">Locked</span>
      <span class="status" :class="{'active': order_info.status === 'In_Progress'}">In Progress</span>
      <span class="status" :class="{'active': order_info.status === 'Finished'}">Finished</span>
      <span class="status" :class="{'active': order_info.status === 'Canceled'}">Canceled</span>
    </div>
  </div>

  <div class="restaurant-wrapper">
    <div class="menu-wrapper">
      <h2 class="header-title">菜單</h2>
      <table>
        <thead>
          <tr>
            <th scope="col" class="name"><h3>餐點</h3></th>
            <th scope="col" class="price"><h3>價錢</h3></th>
            <th scope="col" class="amount"><h3>數量</h3></th>
            <th scope="col" class="remark"><h3>備註</h3></th>
          </tr>
        </thead>
        <tbody v-if="menu_data">
          <template v-for="category, idx_1 in categories" :key="idx_1">
            <tr class="dish-category">
              <th colspan="4">
                <h3 class="text">{{ category }}</h3>
              </th>
            </tr>
            <tr class="dish-list" v-for="dish, idx_2 in classifiedDishes[category]" :key="idx_2">
              <td class="field name">
                <h3>
                  {{ dish.name }}
                </h3>
              </td>
              <td class="field price">
                <h3>
                  {{ dish.price }}
                </h3>
              </td>
              <td class="field amount">
                <input class="input-field" type="number" v-model="userOrder[dish._id].amount" min="0">
              </td>
              <td class="field remark">
                <input class="input-field" type="text" v-model="userOrder[dish._id].remark" maxlength="15">
              </td>
            </tr>
          </template>
          <tr class="send-btn-container" v-if="isChanged">
            <th colspan="4">
              <button class="send-btn" @click="send_order">送出</button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="result-wrapper">
      <h2 class="header-title">我的訂單</h2>
      <table>
        <thead>
          <tr>
            <th scope="col" class="name">餐點</th>
            <th scope="col" class="price">價錢</th>
            <th scope="col" class="amount">數量</th>
            <th scope="col" class="remark">備註</th>
          </tr>
        </thead>

        <tbody class="result-wrapper-body" v-if="orderResult">
          <template v-for="(item, index) in orderResult.orderedItems" :key="index">
            <tr>
              <td>
                <h3>
                  {{ item.name }}
                </h3>
              </td>
              <td>
                <h3>
                  {{ item.price }}
                </h3>
              </td>
              <td>
                <h3>
                  {{ item.amount }}
                </h3>
              </td>
              <td>
                <h3>
                  {{ item.remark }}
                </h3>
              </td>
            </tr>
          </template>
          <tr v-if="orderResult">
            <th colspan="1">
              <h3>
                總金額
              </h3>
            </th>
            <th colspan="3">
              <h3>
                {{ orderResult.totalAmount }}
              </h3>
            </th>
          </tr>
          <tr class="send-btn-container" v-if="orderResult">
            <th colspan="4">
              <button class="send-btn" @click="clear_order">刪除訂單</button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="total-order">
    <h1 class="title">訂購總覽</h1>

    <table 
      border="1" cellspacing="0" cellpadding="10"
      v-if="order_info"
    >
      <thead>
        <tr>
          <th>使用者名稱</th>
          <th>訂購內容</th>
          <th>總金額</th>
          <th>訂購時間</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(each_order, index) in order_info.orders" :key="index">
          <td>{{ each_order.name }}</td>
          <td>
            <span
              class="order_item"
              v-for="(order_item, index) in each_order.orderedItems" :key="index"
            >
              <span v-if="index !== 0">、</span>
              {{ order_item.name }} x {{ order_item.amount }} <span v-if="order_item.remark">({{ order_item.remark }})</span>
            </span>
          </td>
          <td>{{ each_order.totalAmount }} 元</td>
          <td>{{ full_time_format(each_order.orderTime) }}</td>
        </tr>
        <tr>
          <td colspan="1">
            <h3>Total</h3>
          </td>
          <td colspan="3">
            {{ total_amount }}
          </td>
        </tr>
      </tbody>
    </table>    
  </div>
</template>
  

<style scoped>
.order-header {
  position: relative;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  margin: 0 auto;
}

.order-header .go_back_btn_container{
  position: absolute;
  width: 70px;
  height: 30px;
  top: 0;
  left: 0;
}

.order-header .go_back_btn_container button{
  width: 100%;
  height: 100%;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  margin: 12px;
}
.order-header .go_back_btn_container button:hover{
  background-color: #333;
  color: #ddd;
}

.title-container {
  text-align: center;
  margin-bottom: 15px;
}

.order-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  display: inline-block;
}

.separator {
  color: #bbb;
  font-weight: normal;
}

.order-info {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  font-size: 1.2rem;
  font-weight: bold;
  color: #555;
  margin-right: 10px;
}

.info-text {
  font-size: 1.2rem;
  color: #333;
}

.restaurant-wrapper {
    display: grid;
    grid-template-columns: 2fr 1fr;
    width: 80%;
    margin-inline: auto;
    padding-top: 1rem;
    gap: 1rem;
}
.restaurant-wrapper  .header-title{
    text-align: center;
    margin-bottom: 1rem;
}
.restaurant-wrapper table {
    border-collapse: collapse;
    border: 2px solid rgb(140 140 140);
    font-family: sans-serif;
    font-size: 1rem;
    letter-spacing: 1px;
    width: 100%;
}

th, td {
    border: 1px solid rgb(160 160 160);
    padding: 0.5rem;
}

.menu-wrapper{
  font-weight: 700;
  text-align: center;
}
.menu-wrapper thead{
  text-align: center;
  font-weight: 900;
}
.menu-wrapper tbody .dish-category{
  background-color: #f4f4f4;
}
.menu-wrapper .category{
    font-size: 1.2rem;
}
.dish-list .field{
  padding: 0;
  height: 40px;
}
.dish-list .field.name{
  width: 40%;
}
.dish-list .field.price{
  width: 10%;
}
.dish-list .field.amount{
  width: 10%;
}
.dish-list .field.remark{
  width: 40%;
}
.dish-list .field .input-field{
  text-align: center;
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  font-size: 16px;
}

.send-btn-container{
  width: 100%;
  height: 30px;
}
.send-btn-container th{
  height: 30px;
  padding: 0;
}
.send-btn-container .send-btn{
  font-size: 18px;
  font-weight: 700;
  padding: 8px;
  background-color: #f4f4f4;
  width: 100%;
  height: 100%;
}
.send-btn-container .send-btn:hover{
  background-color: #eeeeee;
  cursor: pointer;
}

.result-wrapper {
    width: 100%;
    overflow: scroll;
}
.result-wrapper td{
}
.result-wrapper .result-wrapper-body{
  text-align: center;
}

button:hover {
  cursor: pointer;
}

.order-btn{
  font-size: 20px;
  text-align: right;
}

.total-order{
  width: 80%;
  margin: 20px auto;
  text-align: center;
  overflow: scroll;
}

.total-order table {
  margin-top: 10px;
  width: 100%;
}

.total-order table .order_item{
  overflow: scroll;
}

.total-order td {
  padding: 4px;
}

/* 狀態欄容器 */
.order-status-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.status {
  width: 150px;
  text-align: center;
  padding: 10px 0;
  margin: 0 10px;
  border-radius: 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #ddd;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.status.active {
  background-color: #333;
  color: #fff;
}

.status:hover{
  cursor: pointer;
}
</style>