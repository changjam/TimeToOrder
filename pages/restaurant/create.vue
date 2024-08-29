<template>
    <div>
      <h1>Restaurant List</h1>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <ul>
          <li v-for="restaurant in restaurants" :key="restaurant._id">
            {{ restaurant.name }} - ${{ restaurant.phone }} - ${{ restaurant.address }}
            <button @click="editRestaurant(restaurant)">Edit</button>
            <button @click="deleteRestaurant(restaurant._id)">Delete</button>
            <button @click="showAddMenuModal(restaurant._id)">Add Menu Item</button>
            <button @click="fetchMenus(restaurant._id)">Show Menus</button>
          </li>
        </ul>
        <hr>
        <h2>{{ isEditing ? 'Edit' : 'Add' }} Restaurant</h2>
        <form @submit.prevent="isEditing ? updateRestaurant() : addRestaurant()">
          <input v-model="restaurantForm.name" placeholder="Restaurant Name" required />
          <input v-model="restaurantForm.phone" placeholder="Restaurant Phone" required />
          <input v-model="restaurantForm.address" placeholder="Restaurant Address" required />
          <textarea v-model="restaurantForm.description" placeholder="Restaurant Description"></textarea>
          <button type="submit">{{ isEditing ? 'Update' : 'Add' }} Restaurant</button>
        </form>
  
        <div v-if="showMenuModal" class="modal-overlay">
          <div class="modal-content">
            <h2>Add Menu Item</h2>
            <form @submit.prevent="addMenu">
              <input v-model="menuForm.name" placeholder="Menu Item Name" required />
              <input v-model="menuForm.price" type="number" placeholder="Price" required />
              <textarea v-model="menuForm.description" placeholder="Description"></textarea>
              <button type="submit">Add Menu Item</button>
              <button @click="hideAddMenuModal">Cancel</button>
            </form>
          </div>
        </div>
  
        <!-- Menu List -->
        <div v-if="menus.length">
          <h2>Menus</h2>
          <ul>
            <li v-for="menu in menus" :key="menu._id">
              {{ menu.restaurant.name }} : {{ menu.name }} - ${{ menu.price }} - {{ menu.description }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue';
    import { useFetch } from '#app';
  
    const { data } = await useFetch('/api/restaurants/get');
    const restaurants = ref(data.value?.data || []);
    const loading = ref(false);
    const isEditing = ref(false);
    const restaurantForm = ref({ name: '', phone: '', address: '', description: '' });
    const editingRestaurantId = ref(null);
    const showMenuModal = ref(false);
    const currentRestaurantId = ref(null);
    const menuForm = ref({ name: '', price: 0, description: '' });
    const menus = ref([]);
  
    const fetchRestaurants = async () => {
      loading.value = true;
      const { data } = await useFetch('/api/restaurants/get');
      restaurants.value = data.value?.data || [];
      loading.value = false;
    };
  
    const addRestaurant = async () => {
      await useFetch('/api/restaurants/post', {
        method: 'POST',
        body: restaurantForm.value,
      });
      resetForm();
      await fetchRestaurants();
    };
  
    const editRestaurant = (restaurant) => {
      isEditing.value = true;
      editingRestaurantId.value = restaurant._id;
      restaurantForm.value = { ...restaurant };
    };
  
    const updateRestaurant = async () => {
      await useFetch(`/api/restaurants/${editingRestaurantId.value}/put`, {
        method: 'PUT',
        body: restaurantForm.value,
      });
      resetForm();
      await fetchRestaurants();
    };
  
    const deleteRestaurant = async (id) => {
      await useFetch(`/api/restaurants/${id}/delete`, { method: 'DELETE' });
      await fetchRestaurants();
    };
  
    const showAddMenuModal = (restaurantId) => {
      currentRestaurantId.value = restaurantId;
      showMenuModal.value = true;
    };
  
    const hideAddMenuModal = () => {
      showMenuModal.value = false;
      menuForm.value = { name: '', price: 0, description: '' };
    };
  
    const addMenu = async () => {
      await useFetch('/api/menus/post', {
        method: 'POST',
        body: { ...menuForm.value, restaurant: currentRestaurantId.value },
      });
      hideAddMenuModal();
      await fetchRestaurants();
    };
  
    const fetchMenus = async (restaurantId) => {
      const { data } = await useFetch(`/api/menus/get?restaurant_id=${restaurantId}`);
      console.log(data);
      menus.value = data.value?.data || [];
    };
  
    const resetForm = () => {
      restaurantForm.value = { name: '', phone: '', address: '', description: '' };
      isEditing.value = false;
      editingRestaurantId.value = null;
    };
  </script>
    
  <style scoped>
    h1, h2 {
      margin-bottom: 1rem;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
    }
    button {
      margin-left: 1rem;
    }
    form {
      margin-top: 1rem;
    }
    input, textarea {
      display: block;
      margin-bottom: 1rem;
      padding: 0.5rem;
      width: 100%;
      max-width: 300px;
    }
  </style>
  