<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUserData } from '@/utils/users/userHandler'
import { addRestaurant, updateRestaurant } from '@/utils/restaurants/restaurantHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import InputField from '~/components/InputField.vue'
import MenuArea from '~/components/MenuArea.vue'

const restaurant = ref({
    name: '',
    phone: '',
    address: '',
    types: [''],
    image: '',
})
const restaurantId = ref()

const menuArea = ref(null)
const triggerSaveMenu = () => {
    console.log("觸發")
    if (menuArea.value) {
        menuArea.value.saveMenu(); // 通过 ref 调用子组件的方法
    }
}
// 標準流程
const user_info = ref(null)
const router = useRouter();
onMounted(async () => {
    const data = await verify_credential()
    if (!data)
        router.push('/login');

    user_info.value = await getUserData(`user_id=${data.user_id}`)
    user_info.value = user_info.value.data

})

// 餐廳更改狀態
const origin_status = ref({ name: '', phone: '', address: '', types: [''], image: '', })
const isChanged = computed(() => {
    if (origin_status.value.name !== restaurant.value.name) {
        console.log('name')
        return true;
    }
    if (origin_status.value.phone !== restaurant.value.phone) {
        console.log('phone')
        return true;
    }
    if (origin_status.value.address !== restaurant.value.address) {
        console.log('address')
        return true;
    }
    if (origin_status.value.image !== restaurant.value.image) {
        console.log('image')
        return true;
    }
    if (origin_status.value.types !== restaurant.value.types) {
        console.log('types')
        return true;
    }
    return false;
});

const createRestaurant = async () => {
    try {
        const addedRestaurant = await addRestaurant({ ...restaurant.value, types: restaurant.value.types, creator: user_info.value.user_id })
        restaurantId.value = addedRestaurant._id
        origin_status.value = { ...restaurant.value }
    } catch (error) {
        console.error(error)
        alert("新增餐廳時出錯，請稍後再試")
    }
}
const cleanRestaurant = () => {
    restaurant.value = {
        name: '',
        phone: '',
        address: '',
        types: [''],
        image: ''
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
const saveRestaurant = async () => {
    const updates = { ...restaurant.value }
    await updateRestaurant(restaurantId.value, updates)
    origin_status.value = { ...restaurant.value }
}


</script>

<template>
    <div class="restaurant-create-container">
        <!-- 餐廳資訊 -->
        <div class="info-area">
            <div class="restaurantImg">
                <label for="uploadImage" title="上傳照片">
                    <img v-if="restaurant.image" :src="restaurant.image">
                    <img v-else src="~assets/images/upload.png">
                </label>
                <input type="file" id="uploadImage" @change="handleFileChange" accept="image/png, image/jpeg" hidden />
            </div>
            <div class="input-field-container">
                <InputField :name="'店家名稱'" :id="'restaurantName'" v-model="restaurant.name" />
                <InputField :name="'店家地址'" :id="'restaurantAddress'" v-model="restaurant.address" />
                <InputField :name="'店家電話'" :id="'restaurantTel'" v-model="restaurant.phone" />
                <span v-for="(type, index) in restaurant.types">
                    <InputField :name="'類型' + index" :id="'tpyes' + index" v-model="restaurant.types[index]" />
                    <button class="delete-button" @click="removeType(index)">
                        <img src="~/assets/images/delete.png" alt="">
                    </button>
                </span>
            </div>

            <nav id="toolbar">
                <button class="confirm" @click="addType">新增類型</button>
            </nav>
        </div>
        <!-- 菜單資訊 -->
        <MenuArea v-if="restaurantId" :restaurant_id="restaurantId" ref="menuArea" />

        <!-- 工具列 -->
        <nav id="toolbar">
            <button class="warning" @click="cleanRestaurant">
                清　　空
            </button>
            <button v-if="restaurantId" :class="{ confirm: isChanged }" @click="saveRestaurant" :disabled="!isChanged">
                儲存餐廳
            </button>
            <button v-else class="confirm" @click="createRestaurant">
                建立餐廳
            </button>
            <button v-if="restaurantId" class="confirm" @click="triggerSaveMenu">
                儲存菜單
            </button>
        </nav>
    </div>
</template>


<style>
.restaurant-create-container {
    padding: 1rem;
    margin: auto;
    width: 90%;
    max-width: 1300px;
    height: 90%;
    overflow-y: auto;
    background: #fefefe;
    border-radius: 12px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

    position: relative;
    --toolbar-height: 30px;
    --image-height: 200px;

    display: grid;
    grid-template-columns: 30% 70%;
}

.restaurant-create-container .info-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
    position: relative;
    height: 90%;
}

.restaurant-create-container .info-area .input-field-container {
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    gap: 1rem;
    width: 100%;
    height: 50%;
    max-height: 50%;
    overflow-y: auto;
    box-sizing: border-box;
    position: relative;
}


label[for='uploadImage'] {
    cursor: pointer;
}

.restaurant-create-container .info-area .restaurantImg {
    height: var(--image-height);
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.restaurant-create-container .info-area .restaurantImg img {
    max-width: 100%;
    max-height: var(--image-height);
}

.restaurant-create-container #toolbar {
    position: absolute;
    height: var(--toolbar-height);
    bottom: 0.5rem;
    left: 0;
    width: 100%;

    display: flex;
    justify-content: center;
    gap: 1rem;
}

.restaurant-create-container #toolbar button {
    padding-inline: 0.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1.5rem;
}

button.confirm {
    color: #fff;
    background-color: #007bff;
}

button.warning {
    color: #fff;
    background-color: #bd2c24;
}

.input-field-container>span {
    display: flex;
    width: 100%;
    gap: 0.25rem;
}

.delete-button {
    min-width: 2.5rem;
    height: 2.5rem;
    background: #fefefe;
}

.delete-button img {
    height: 2.5rem;
}
</style>
