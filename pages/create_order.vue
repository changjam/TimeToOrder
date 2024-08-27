<script setup>
import { ref } from 'vue';
import { getRestaurant } from '@/utils/restaurants/restaurantHandler';

const restaurants = ref([]);
const selectedRestaurantId = ref(null);
const selectedRestaurantName = ref('');
const showRestaurantList = ref(false);

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

function selectRestaurant(id, name) {
  selectedRestaurantId.value = id;
  selectedRestaurantName.value = name;
  showRestaurantList.value = false;
}
</script>

<template>
  <div class="container">
    <h1>建立訂單</h1>
    <button @click="toggleRestaurantList" class="toggle-button">選擇餐廳</button>
    <div v-if="showRestaurantList" class="restaurant-list">
      <div v-for="restaurant in restaurants" :key="restaurant._id" class="restaurant-card">
        <input 
          type="radio" 
          :id="restaurant._id" 
          @change="selectRestaurant(restaurant._id, restaurant.name)"
          :checked="selectedRestaurantId === restaurant._id"
          class="restaurant-radio"
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
    
    <button v-if="selectedRestaurantId" @click="submitOrder" class="submit-button">提交訂單</button>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 900px;
  margin: auto;
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.toggle-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-button:hover {
  background-color: #0056b3;
}

.restaurant-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  max-height: 70vh;
  padding-right: 10px; /* Add space for scrollbar */
}

.restaurant-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  transition: transform 0.3s ease;
}

.restaurant-card:hover {
  transform: scale(1.02);
}

.restaurant-radio {
  position: absolute;
  top: 15px;
  left: 15px;
}

.restaurant-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.restaurant-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

h2 {
  margin: 10px 0;
  font-size: 1.4rem;
  color: #333;
}

p {
  margin: 5px 0;
  font-size: 1rem;
  color: #666;
}

strong {
  font-weight: bold;
}

.selected-restaurant {
  margin-top: 20px;
  text-align: center;
  font-size: 1.1rem;
  color: #007bff;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #218838;
}
</style>
