<script setup>
import { ref, onMounted , onBeforeUnmount } from 'vue';
import { getMenus, classifyDishes } from '@/utils/menus/menuHandler';
import { useRoute, useRouter } from '#app';
import { getUserData } from '@/utils/users/userHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import { updateOrder } from '~/utils/order/orderHandler';

const route = useRoute();
const router = useRouter();

const _id = route.fullPath.match(/\/restaurants\/(.+)?/)[1];
const menu_data = ref(null);
const classifiedMenu = ref({});
const classifiedDishes = ref(null)
var categories = ref(null);
var order_info = ref(null); // 訂購資訊
const order_id = useState('order_id')
const user_info = ref('')

const fetchMenus = async (restaurantId) => {
    try {
      menu_data.value = await getMenus(`restaurant=${restaurantId}`);
      classifiedDishes.value = classifyDishes(menu_data.value.data);
      categories = Object.keys(classifiedDishes.value);
    }catch(error) {
      console.log(error)
    }
};

onMounted(async () => {
  const data = await verify_credential()
  const user_id = data.user_id
  user_info.value = await getUserData(`user_id=${user_id}`);
  classifiedMenu.value = await fetchMenus(_id);
  order_info.value = menu_data.value.data
  order_info.value.forEach(obj => {
    obj.mount = NaN;
    obj.note = "";
  });
});

// 後續處理...
onBeforeUnmount(() => {
  order_id.value = ''
})

const goBack = () => {
  router.push('/restaurants');
};

const resultWrapper = ref(null);

const test = (dish) => {
  const volumeElement = document.getElementById(`volume-${dish.name}`);
  const remarkElement = document.getElementById(`remark-${dish.name}`);

  const volume = volumeElement ? volumeElement.value : 0;
  const remark = remarkElement ? remarkElement.value : '';

  // 暫時刪除 直接用order_info判斷
  // if (volume == 0){
  //   alert('數量必須大於0');
  //   return
  // }
  const tr = document.createElement('tr');
  for ( const order of order_info.value ){
    if ( order._id == dish._id ){
      order.mount = volume;
      order.note = remark;
    }
  }
  
  if (resultWrapper.value) {
    resultWrapper.value.innerHTML = '';
    order_info.value
      .filter(order => order.mount > 0)
      .forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <th scope="row" class="cell">${order.name}</th>
          <td class="price" class="cell">${order.price}</td>
          <td align="right" class="cell">${order.mount}個</td>
          <td align="right" class="cell">${order.note}</td>
        `;
        resultWrapper.value.appendChild(tr);
      });
  }

  if (volumeElement) volumeElement.value = 0;
  if (remarkElement) remarkElement.value = '';
}

const ordering = async () => {
  const orders = order_info.value.filter(order => order.mount > 0);

  if (!orders.length){
    alert('請選擇餐點');
    return
  }

  if (!order_id.value){
    alert('請先至訂單頁面選擇訂單')
    router.push('/order')
    return
  }
  const orderDetails = {
    name: user_info.value.data.name,
    totalAmount: NaN,
    orderedItems: [],
    user_id: user_info.value.data.user_id,
    orderTime: new Date().toLocaleString()
  }

  let total = 0;
  for (const order of orders){
    total += order.mount * order.price;
    orderDetails.orderedItems.push({
      itemName: order.name,
      quantity: order.mount
    });
  }
  orderDetails.totalAmount = total;

  try{
    await updateOrder(order_id.value, orderDetails, user_info.value.data.user_id)
    alert("訂單已送出") 
  }catch(error){
    console.log(error)
    alert("訂單送出失敗")
  }
}

</script>


<template>
    <div class="restaurant-wrapper">
      <div class="menu-wrapper">
        <h2>菜單</h2>
        <table>
          <thead>
            <tr>
              <th scope="col" class="name">餐點</th>
              <th scope="col" class="price">價錢</th>
              <th scope="col" class="num">數量</th>
              <th scope="col" class="remark">備註</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody v-if="menu_data">
            <template v-for="category in categories" :key="category">
              <tr class="dish.category">
                <th colspan="1">{{ category }}</th>
                <th colspan="4"></th>
              </tr>
              <tr v-for="dish in classifiedDishes[category]" :key="dish.name">
                <th scope="row" class="name">{{ dish.name }}</th>
                <td class="price">{{ dish.price }}</td>
                <td align="right">
                  <input type="number" :id="`volume-${dish.name}`" value="0" min="0" class="no-arrows">
                </td>
                <td align="right">
                  <input type="text" :id="`remark-${dish.name}`">
                </td>
                <td>
                  <button @click="test(dish)">確認</button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="result-wrapper">
        <h2>訂購資訊</h2>
        <table>
          <thead>
            <tr>
              <th scope="col" class="name">餐點</th>
              <th scope="col" class="price">價錢</th>
              <th scope="col" class="num">數量</th>
              <th scope="col" class="remark">備註</th>
            </tr>
          </thead>
          <tbody ref="resultWrapper">
        
          </tbody>
          <button class="order-btn" @click="ordering">確認訂購</button>
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

.restaurant-wrapper  h2{
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

.restaurant-wrapper th>*,
.restaurant-wrapper td>* {
    width: 100%;
}

.menu-wrapper input[type="number"] {
    text-align: end;
    display: block;
    max-width: 5rem;
}

.menu-wrapper input[type="text"] {
    text-align: right;
}

.menu-wrapper .name {
    text-align: left;
}

.menu-wrapper .price,
.menu-wrapper .num {
    text-align: right;
}

.menu-wrapper .category{
    font-size: 1.2rem;
}

.result-wrapper {
    width: 100%;
}

button:hover {
    cursor: pointer;
}

.order-btn{
  font-size: 20px;
  text-align: right;
}

</style>