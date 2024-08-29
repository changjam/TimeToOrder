<script setup>
import { ref, onMounted } from 'vue';
import { getMenus, classifyDishes } from '@/utils/menus/menuHandler';
import { useRoute, useRouter } from '#app';

const route = useRoute();
const router = useRouter();

const _id = route.fullPath.match(/\/restaurants\/(.+)/)[1];
const loading = ref(false);
const classifiedMenu = ref({});

const fetchMenus = async (restaurantId) => {
    loading.value = true;
    try {
      const menu_data = await getMenus(`restaurant=${restaurantId}`);
      return classifyDishes(menu_data.data);
    } finally {
      loading.value = false;
    }
};

onMounted(async () => {
  classifiedMenu.value = await fetchMenus(_id);
  console.log("classifiedMenu::", classifiedMenu.value);
});

const goBack = () => {
  router.push('/restaurants');
};
</script>

<template>
  <div class="restaurant-wrapper">
    <div v-if="loading" class="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <h1 class="restaurant-title">Restaurant Menu</h1>
      <div v-if="Object.keys(classifiedMenu).length">
        <div v-for="(dishes, category) in classifiedMenu" :key="category" class="menu-category">
          <h2 class="category-title">{{ category }}</h2>
          <table>
            <thead>
              <tr>
                <th>餐點</th>
                <th>價錢</th>
                <th>餐點描述</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dish in dishes" :key="dish._id">
                <td>{{ dish.name }}</td>
                <td>{{ dish.price }}</td>
                <td>{{ dish.cate_description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p v-if="!Object.keys(classifiedMenu).length">No menu items found.</p>
    </div>
    <button @click="goBack" class="back-button">返回餐廳</button>
  </div>
</template>

<style scoped>
.restaurant-wrapper {
  width: 80%;
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.restaurant-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.menu-category {
  margin-bottom: 2rem;
}

.category-title {
  font-size: 1.8rem;
  color: #007bff;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.8rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
  color: #333;
  font-weight: bold;
}

td {
  color: #666;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}

p {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
}

.back-button {
  display: block;
  margin: 2rem auto;
  padding: 0.8rem 1.5rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  text-align: center;
}

.back-button:hover {
  background-color: #218838;
}
</style>
