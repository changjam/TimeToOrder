<script setup>
  import { ref } from 'vue';
  import { getRestaurant } from '@/utils/restaurants/restaurantHandler';
  import { getGroupData } from '@/utils/groups/groupHandler';
  import { useCookie } from '#app';
  import { getUserData } from '@/utils/users/userHandler'
  import { addOrder } from '@/utils/order/orderHandler';

  const user_id = useCookie('user_id').value;

  const restaurants = ref([]);
  const selectedRestaurantId = ref(null);
  const selectedRestaurantName = ref('');
  const showRestaurantList = ref(false);
  const groupDataList = ref([]);
  const selectedGroupId = ref(null);
  const selectedGroupName = ref('');
  const showGroupList = ref(false);
  const orderName = ref('');
  const notes = ref('');

  async function fetchData() {
    try {
      const data = await getRestaurant();
      restaurants.value = data;

      const user_info = await getUserData(`_id=${user_id}`);
      const joinedGroups = user_info.data.joinedGroups;

      for (const group of joinedGroups) {
        const groupdata = await getGroupData(`_id=${group}`);
        groupDataList.value.push(groupdata.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  fetchData();

  function toggleRestaurantList() {
    showRestaurantList.value = !showRestaurantList.value;
  }

  function selectRestaurant(id, name) {
    selectedRestaurantId.value = id;
    selectedRestaurantName.value = name;
    showRestaurantList.value = false;
  }

  function toggleGroupList() {
    showGroupList.value = !showGroupList.value;
  }

  function selectGroup(id, name) {
    selectedGroupId.value = id;
    selectedGroupName.value = name;
    showGroupList.value = false;
  }

  async function submitOrder() {
    if (!selectedRestaurantId.value || !selectedGroupId.value || !orderName.value) {
      alert('資料尚未齊全');
      return;
    }

    const orderData = {
      order_name: orderName.value,
      creator_id: user_id,
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
  <div class="container">
    <h1>建立訂單</h1>

    <div class="form-group">
      <label for="orderName">訂單名稱:</label>
      <input v-model="orderName" id="orderName" type="text" placeholder="輸入訂單名稱" class="input-field" autocomplete="off" />
    </div>

    <button @click="toggleRestaurantList" class="toggle-button">選擇餐廳</button>
    <div v-if="showRestaurantList" class="restaurant-list">
      <div v-for="restaurant in restaurants" :key="restaurant._id" class="restaurant-card">
        <input 
          type="radio" 
          :id="restaurant._id" 
          @change="selectRestaurant(restaurant._id, restaurant.name)"
          :checked="selectedRestaurantId === restaurant._id"
          class="restaurant-radio"
          autocomplete="off"
        />
        <label :for="restaurant._id" class="restaurant-info">
          <img :src="restaurant.image" alt="Restaurant Image" class="restaurant-image"/>
          <h2>{{ restaurant.name }}</h2>
          <p><strong>電話:</strong> {{ restaurant.phone }}</p>
          <p><strong>地址:</strong> {{ restaurant.address }}</p>
        </label>
      </div>
    </div>
    <div v-if="selectedRestaurantId" class="selected-restaurant">
      <p>選擇的餐廳: {{ selectedRestaurantName }}</p>
    </div>

    <button @click="toggleGroupList" class="toggle-button">選擇群組</button>
    <div v-if="showGroupList" class="group-list">
      <div v-for="group in groupDataList" :key="group._id" class="group-card">
        <input 
          type="radio" 
          :id="group._id" 
          @change="selectGroup(group._id, group.name)"
          :checked="selectedGroupId === group._id"
          class="group-radio"
          autocomplete="off"
        />
        <label :for="group._id" class="group-info">
          <h2>{{ group.name }}</h2>
        </label>
      </div>
    </div>
    <div v-if="selectedGroupId" class="selected-group">
      <p>選擇的群組: {{ selectedGroupName }}</p>
    </div>

    <div class="form-group">
      <label for="notes">備註:</label>
      <textarea v-model="notes" id="notes" placeholder="輸入備註 (可選)" class="input-field"></textarea>
    </div>

    <button v-if="selectedRestaurantId && selectedGroupId" @click="submitOrder" class="submit-button">提交訂單</button>
  </div>
</template>


<style scoped>
  .container {
    padding: 20px;
    max-width: 900px;
    margin: auto;
    font-family: 'Arial', sans-serif;
    background-color: #f7f7f7;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #444;
    font-size: 2rem;
    font-weight: bold;
  }

  .toggle-button {
    display: block;
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s;
  }

  .toggle-button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  .group-list, .restaurant-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    max-height: 60vh;
    padding-right: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .group-card, .restaurant-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 15px;
    background: #fafafa;
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .group-card:hover, .restaurant-card:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  .group-radio, .restaurant-radio {
    position: absolute;
    top: 15px;
    left: 15px;
    transform: scale(1.2);
  }

  .group-info, .restaurant-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .restaurant-image {
    width: 140px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
    border: 2px solid #ddd;
  }

  h2 {
    margin: 10px 0;
    font-size: 1.5rem;
    color: #333;
  }

  p {
    margin: 5px 0;
    font-size: 1.1rem;
    color: #555;
  }

  strong {
    font-weight: bold;
  }

  .selected-group, .selected-restaurant {
    margin-top: 25px;
    text-align: center;
    font-size: 1.2rem;
    color: #007bff;
    font-weight: bold;
  }

  .submit-button {
    display: block;
    width: 100%;
    padding: 12px;
    margin-top: 30px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s;
  }

  .submit-button:hover {
    background-color: #218838;
    transform: translateY(-2px);
  }

  .form-group {
    margin-bottom: 20px;
  }

  .input-field {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    color: #333;
    background-color: #fff;
    transition: border-color 0.3s ease;
  }

  .input-field:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
</style>
