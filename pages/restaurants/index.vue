<script setup>
  import { ref } from 'vue';
  import { getRestaurant } from '@/utils/restaurants/restaurantHandler';
  import { useRouter } from '#app';

  const router = useRouter();

  const restaurants = await getRestaurant();

  const loading = ref(false);
</script>

<template>
  <div class="container">
    <h1 class="title">Restaurant List</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else class="restaurant-list">
      <div v-for="restaurant in restaurants" :key="restaurant._id" class="restaurant-card">
        <img :src="restaurant.image" alt="Restaurant Image" class="restaurant-image" />
        <div class="restaurant-info">
          <h2 class="restaurant-name">{{ restaurant.name }}</h2>
          <p class="restaurant-details">Phone: {{ restaurant.phone }}</p>
          <p class="restaurant-details">Address: {{ restaurant.address }}</p>
          <button @click="router.push(`/restaurants/${restaurant._id}`)" class="fetch-menus-button">Show Menus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
  color: #555;
}

.restaurant-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.restaurant-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.restaurant-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.restaurant-info {
  padding: 1rem;
  flex: 1;
}

.restaurant-name {
  font-size: 1.5rem;
  margin: 0;
}

.restaurant-details {
  margin: 0.5rem 0;
}

.fetch-menus-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.fetch-menus-button:hover {
  background-color: #0056b3;
}

.menus-list {
  margin-top: 1rem;
}

.menu-item {
  margin-bottom: 0.5rem;
}

.menu-item strong {
  display: block;
}

.no-menus {
  margin-top: 1rem;
  color: #ff0000;
}

</style>
