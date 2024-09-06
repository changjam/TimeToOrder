<script setup>
import { ref, onMounted , onBeforeUnmount } from 'vue';
import { getMenus, classifyDishes } from '@/utils/menus/menuHandler';
import { useRoute, useRouter } from '#app';
import { getUserData } from '@/utils/users/userHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import { getOrders } from '@/utils/order/orderHandler'
import { updateOrder } from '~/utils/order/orderHandler';

const route = useRoute();
const router = useRouter();

const menu_data = ref(null);
const classifiedDishes = ref(null)
const order_id = ref('');
const user_info = ref('')
const categories = ref(null);
const userOrder = ref({});
const orderResult = ref({});

const goBack = () => {
  router.push('/orders');
};

onMounted(async () => {
  const data = await verify_credential()
  if (!data) 
    router.push('/login');

  const user_id = data.user_id
  user_info.value = await getUserData(`user_id=${user_id}`);
  order_id.value = route.fullPath.match(/\/orders\/(.+)/)[1];

  const order_data = await getOrders(`_id=${order_id.value}`);
  const restaurant_id = order_data.data[0].restaurant_id._id;
  
  await fetchMenus(restaurant_id);
  orderResult.value = order_data.data[0].orders.filter((order)=> order.user_id === user_id)[0];
});

const isChanged = computed(() => {
  for (const [key, dish] of Object.entries(userOrder.value)) {
    const { amount } = dish;
    if(amount)
      return true
  }
  return false;
});

const fetchMenus = async (restaurantId) => {
    try {
      menu_data.value = await getMenus(`restaurant=${restaurantId}`);
      classifiedDishes.value = classifyDishes(menu_data.value.data);
      categories.value = Object.keys(classifiedDishes.value);
      menu_data.value.data.forEach((dish)=>{
        const { _id, ...data } = dish;
        userOrder.value[_id] = {...data, amount: 0, remark: ""};
      })
    }catch(error) {
      console.error(error)
    }
};

const send_order = async () => {
  if (!isChanged)
    return;

  const orderDetails = {
    name: user_info.value.data.name,
    totalAmount: NaN,
    orderedItems: [],
    user_id: user_info.value.data.user_id,
    orderTime: new Date().toLocaleString()
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
    alert("訂單已送出")
    location.reload()
  }catch(error){
    console.log(error)
    alert("訂單送出失敗")
  }
}
</script>


<template>
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
                  <input class="input-field" type="text" v-model="userOrder[dish._id].remark">
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
        <h2 class="header-title">訂購資訊</h2>
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
          </tbody>
        </table>
      </div>
    </div>
  </template>
  

<style>
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

.restaurant-wrapper th,
.restaurant-wrapper td {
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

</style>