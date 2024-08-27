<script setup>
import { ref } from 'vue';
import { getRestaurant } from '@/utils/restaurants/restaurantHandler';

const restaurants = ref([]);
const selectedRestaurantId = ref(null); // 用来保存所选择的餐厅的_id
const showRestaurantList = ref(false); // 控制餐厅列表的显示

async function fetchData() {
  try {
    const data = await getRestaurant();
    restaurants.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
fetchData();

function toggleRestaurantList() {
  showRestaurantList.value = !showRestaurantList.value;
}

function selectRestaurant(id) {
  selectedRestaurantId.value = id;
  showRestaurantList.value = false; // 隐藏餐厅列表
}
</script>

<template>
  <div class="container">
    <h1>建立訂單</h1>
    <button @click="toggleRestaurantList">選擇餐廳</button>
    <div v-if="showRestaurantList" class="restaurant-list">
      <div v-for="restaurant in restaurants" :key="restaurant._id" class="restaurant-card">
        <input 
          type="checkbox" 
          :id="restaurant._id" 
          @change="selectRestaurant(restaurant._id)"
          :checked="selectedRestaurantId === restaurant._id"
        />
        <label :for="restaurant._id">
          <img :src="restaurant.image" alt="Restaurant Image" class="restaurant-image"/>
          <h2>{{ restaurant.name }}</h2>
          <p><strong>電話:</strong> {{ restaurant.phone }}</p>
          <p><strong>地址:</strong> {{ restaurant.address }}</p>
        </label>
      </div>
    </div>
    <div v-if="selectedRestaurantId">
      <p>選擇的餐廳 ID: {{ selectedRestaurantId }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 10px;
  max-width: 800px;
  margin: auto;
}

.restaurant-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: 70vh;
}

.restaurant-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.restaurant-image {
  width: 80%;
  height: auto;
  border-radius: 8px;
}

h2 {
  margin: 5px 0;
  font-size: 1.2rem;
}

p {
  margin: 3px 0;
  font-size: 0.9rem;
}

strong {
  font-weight: bold;
}
</style>
