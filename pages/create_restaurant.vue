<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { addRestaurant } from '@/utils/restaurants/restaurantHandler'
    import { getMenus , addMenu } from '@/utils/menus/menuHandler'
    import { getMenuByImage } from '@/utils/ocr/ocrHandler'

    const restaurant = ref({
    name: '',
    phone: '',
    address: '',
    types: [''],
    image: ''
    })

    const menuItems = ref([
    { name: '', price: 0, category: '', cate_description: '' },
    ])

    const currentMenuItemIndex = ref(0)

    const isAddingRestaurant = ref(true)
    const router = useRouter()

    const handleSubmit = async () => {
        if (isAddingRestaurant.value) {
            restaurant.value.types = restaurant.value.types.filter(type => type.trim() !== '')
            try {
            const addedRestaurant = await addRestaurant({ ...restaurant.value, types: restaurant.value.types })
            const restaurantId = addedRestaurant._id
            const Menu = await getMenus(restaurantId)
            restaurant.value._id = restaurantId
            if (Menu.data.length === 0) {
                isAddingRestaurant.value = false
            } else {
                // 如果有菜單資料，可能要跳轉或進行其他操作
                console.log("已經有菜單...")
            }
            } catch (error) {
            console.log(error)
            alert("新增餐廳時出錯，請稍後再試")
            }
        } else {
            try {
            // 新增多個菜單
            for (const menuItem of menuItems.value) {
                if (menuItem.name.trim() !== '') { // 確保菜單名稱不為空
                const menuData = {
                    restaurant: restaurant.value._id,
                    ...menuItem
                };
                await addMenu(menuData);
                }
            }
            alert("所有菜單已新增成功");
            setTimeout(router.push(`/restaurants/${restaurant.value._id}`), 1500)
            } catch (error) {
            console.log(error)
            alert("新增菜單時出錯，請稍後再試")
            }
        }
    }

    // 新增類型
    const addType = () => {
        restaurant.value.types.push('')
    }

    // 移除類型
    const removeType = (index) => {
        if (restaurant.value.types.length > 1) {
            restaurant.value.types.splice(index, 1)
        }
    }

    // 選擇菜單圖片
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

    // 下一道菜
    const nextMenuItem = () => {
        const currentItem = menuItems.value[currentMenuItemIndex.value]
        
        // 判斷當前菜色是否填寫完整
        if (currentItem.name.trim() === '' || currentItem.category.trim() === '') {
            alert('請填寫完整的餐點名稱和分類後再繼續')
            return
        }

        // 如果目前索引小於已有菜單的數量，則移至下一個菜餚
        if (currentMenuItemIndex.value < menuItems.value.length - 1) {
            currentMenuItemIndex.value++
        } else {
            // 否則新增一個新的菜品，並移動到該菜餚
            menuItems.value.push({ name: '', price: 0, category: '', cate_description: '' })
            currentMenuItemIndex.value++
        }
    }

    // 上一道菜
    const prevMenuItem = () => {
        if (currentMenuItemIndex.value > 0) {
            currentMenuItemIndex.value--
        }
    }

    const addbyimage = async (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = async () => {
                const base64Image = reader.result
                const filename = file.name
                const result = await getMenuByImage(filename, base64Image)
                console.log(result)
            }
            reader.readAsDataURL(file)
        } 
    }
</script>

<template>
  <div class="form-container">
    <h1 v-if="isAddingRestaurant">新增餐廳</h1>
    <h1 v-else>新增菜單</h1>
    <form @submit.prevent="handleSubmit" class="restaurant-form" v-if="isAddingRestaurant">
      <div class="form-group">
        <label for="name">餐廳名稱：</label>
        <input type="text" v-model="restaurant.name" id="name" class="form-input" required autocomplete="off"/>
      </div>

      <div class="form-group">
        <label for="phone">電話：</label>
        <input type="text" v-model="restaurant.phone" id="phone" class="form-input" required autocomplete="off"/>
      </div>

      <div class="form-group">
        <label for="address">地址：</label>
        <input type="text" v-model="restaurant.address" id="address" class="form-input" required autocomplete="off"/>
      </div>

      <div class="form-group">
        <label>類型：</label>
        <div v-for="(type, index) in restaurant.types" :key="index" class="type-group">
          <input type="text" v-model="restaurant.types[index]" placeholder="輸入類型" class="type-input" required autocomplete="off"/>
          <button type="button" @click="addType" class="btn-add">新增</button>
          <button type="button" @click="removeType(index)" class="btn-remove">移除</button>
        </div>
      </div>

      <div class="form-group">
        <label for="image">菜單圖片：</label>
        <input type="file" id="image" @change="handleFileChange" class="file-input" autocomplete="off"/>
        <div v-if="restaurant.image" class="image-preview">
          <img :src="restaurant.image" alt="Selected Image" class="preview-image" />
        </div>
      </div>

      <button type="submit" class="submit-btn">提交</button>
    </form>
    
    <form @submit.prevent="handleSubmit" class="menu-form" v-else>
    <div v-if="menuItems.length">
        <div class="form-group">
        <label for="addByImage">以菜單新增：</label>
        <input type="file" @change="addbyimage" id="addByImage" autocomplete="off"/>
        </div>
        <div class="menu-item-group">
        <div class="form-group">
            <label for="name">餐點：</label>
            <input type="text" v-model="menuItems[currentMenuItemIndex].name" id="name" class="form-input" required autocomplete="off"/>
        </div>

        <div class="form-group">
            <label for="price">價格：</label>
            <input type="float" v-model="menuItems[currentMenuItemIndex].price" id="price" class="form-input" required autocomplete="off"/>
        </div>

        <div class="form-group">
            <label for="category">分類：</label>
            <input type="text" v-model="menuItems[currentMenuItemIndex].category" id="category" class="form-input" required autocomplete="off"/>
        </div>

        <div class="form-group">
            <label for="cate_description">分類描述：</label>
            <input type="text" v-model="menuItems[currentMenuItemIndex].cate_description" id="cate_description" class="form-input" autocomplete="off"/>
        </div>
        </div>

        <button type="button" @click="prevMenuItem" class="btn-prev" :disabled="currentMenuItemIndex === 0">上一道菜</button>&nbsp;
        <button type="button" @click="nextMenuItem" class="btn-next">下一道菜</button>
    </div>
    <br>
    <button type="submit" class="submit-btn">提交菜單</button>
    </form>

  </div>
</template>


<style scoped>
    .form-container {
        max-width: 800px;
        margin: auto;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: #fff;
    }

    h1 {
        text-align: center;
        margin-bottom: 20px;
    }

    .restaurant-form {
        display: flex;
        flex-direction: column;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-input, .type-input, .file-input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .type-group {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .btn-add, .btn-remove {
        margin-left: 10px;
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
    }

    .btn-add {
        background-color: #28a745;
    }

    .btn-remove {
        background-color: #dc3545;
    }

    .file-input {
        margin-top: 10px;
    }

    .image-preview {
        margin-top: 10px;
    }

    .preview-image {
        max-width: 300px;
        max-height: 300px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .submit-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        color: #fff;
        background-color: #007bff;
        cursor: pointer;
        font-size: 16px;
    }

    .btn-prev, .btn-next {
        margin-top: 10px;
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
    }

    .btn-prev {
        background-color: #007bff;
    }

    .btn-next {
        background-color: #28a745;
    }
</style>
