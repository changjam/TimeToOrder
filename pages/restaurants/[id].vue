<script setup>
import { ref, onMounted } from 'vue';
import { getMenus, classifyDishes } from '@/utils/menus/menuHandler';
import { useRoute, useRouter } from '#app';

const route = useRoute();
const router = useRouter();

const _id = route.fullPath.match(/\/restaurants\/(.+)/)[1];
const menu_data = ref(null);
const classifiedMenu = ref({});
const classifiedDishes = ref(null)
var categories = ref(null);
var order_info = ref(null)


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
  classifiedMenu.value = await fetchMenus(_id);
  order_info.value = menu_data.value.data
  order_info.value.forEach(obj => {
    obj.mount = NaN;
    obj.note = "";
  });
});

const goBack = () => {
  router.push('/restaurants');
};

const resultWrapper = ref(null);

const test = (dish) => {
  const volumeElement = document.getElementById(`volume-${dish.name}`);
  const remarkElement = document.getElementById(`remark-${dish.name}`);

  const volume = volumeElement ? volumeElement.value : 0;
  const remark = remarkElement ? remarkElement.value : '';

  if (volume == 0){
    alert('數量必須大於0');
    return
  }
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
          <button class="order-btn">確認訂購</button>
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