<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addRestaurant } from '@/utils/restaurantHandler'
import { addMenu } from '@/utils/menuHandler'

const restaurant = ref({
  name: '',
  phone: '',
  address: '',
  types: [],
  image: ''
})

const menuItems = ref([
  { name: '紅燒牛肉麵', price: 95, category: '麵食', cate_description: '' },
  { name: '清燉牛肉麵', price: 105, category: '麵食', cate_description: '' },
  { name: '乾麵', price: 105, category: '麵食', cate_description: '' },
  { name: '招牌鍋貼', price: 6.3, category: '鍋貼', cate_description: '' },
  { name: '招牌鍋貼', price: 6.3, category: '鍋貼', cate_description: '' },
  { name: '招牌鍋貼', price: 6.3, category: '鍋貼', cate_description: '' }
])

const router = useRouter()

const handleSubmit = async () => {
  restaurant.value.types = restaurant.value.types.filter(type => type.trim() !== '')
  
  try {
    const addedRestaurant = await addRestaurant({ ...restaurant.value, types: restaurant.value.types });
    const restaurantId = addedRestaurant._id;

    for (const menuItem of menuItems.value) {
      const menuData = {
        restaurant: restaurantId,
        ...menuItem
      };
      await addMenu(menuData);
    }

    router.push('/menus');
  } catch (error) {
    alert("新增餐廳或菜單時出錯，請稍後再試");
  }
}

const addType = () => {
  restaurant.value.types.push('')
}

const removeType = (index) => {
  restaurant.value.types.splice(index, 1)
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      restaurant.value.image = reader.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <div>
    <h1>新增餐廳</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">餐廳名稱：</label>
        <input type="text" v-model="restaurant.name" id="name" required />
      </div>

      <div>
        <label for="phone">電話：</label>
        <input type="text" v-model="restaurant.phone" id="phone" required />
      </div>

      <div>
        <label for="address">地址：</label>
        <input type="text" v-model="restaurant.address" id="address" required />
      </div>

      <div>
        <label>類型：</label>
        <div v-for="(type, index) in restaurant.types" :key="index">
          <input type="text" v-model="restaurant.types[index]" placeholder="輸入類型" required />
          <button type="button" @click="addType">新增類型</button>&nbsp;&nbsp;
          <button type="button" @click="removeType(index)">移除</button>
        </div>
      </div>

      <div>
        <label for="image">餐廳圖片：</label>
        <input type="file" id="image" @change="handleFileChange" />
        <div v-if="restaurant.image">
          <img :src="restaurant.image" alt="Selected Image" style="max-width: 300px; max-height: 300px; margin-top: 10px;" required/>
        </div>
      </div>

      <button type="submit">提交</button>
    </form>
  </div>
</template>
