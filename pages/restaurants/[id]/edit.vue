<script setup>
import { getMenus } from '@/utils/menus/menuHandler';
import { getRestaurant, updateRestaurant } from '@/utils/restaurants/restaurantHandler';
import { useRoute, useRouter } from '#app';
import { getUserData } from '@/utils/users/userHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import noImage from '@/assets/images/noImage.png';

const global = {
    typeIndex: 0,
}

const route = useRoute();
const router = useRouter();

const restaurant_id = route.params.id

const menu = ref(null);
const restaurant = ref({ name: '', phone: '', address: '', types: [''], image: '', })
const user_info = ref('')
const origin_restaurant = ref({ name: '', phone: '', address: '', types: [''], image: '', })
onMounted(async () => {
    const data = await verify_credential()
    if (!data)
        router.push('/login');
    user_info.value = await getUserData(`user_id=${data.user_id}`)
    user_info.value = user_info.value.data
    // restaurant
    restaurant.value = await getRestaurant(restaurant_id)
    restaurant.value = restaurant.value.data
    origin_restaurant.value = {...restaurant.value}
    // menu
    menu.value = await getMenus(`restaurant=${restaurant_id}`);
    menu.value = menu.value.data
});

const RestaurantisChanged = computed(() => {
    if (origin_restaurant.value.name !== restaurant.value.name) {                
        return true;
    }
    if (origin_restaurant.value.phone !== restaurant.value.phone) {
        return true;
    }
    if (origin_restaurant.value.address !== restaurant.value.address) {
        return true;
    }
    if (origin_restaurant.value.image !== restaurant.value.image) {
        return true;
    }
    if (origin_restaurant.value.types !== restaurant.value.types) {
        return true;
    }
    return false;
});


const saveRestaurant = async () => {
    const updates = { ...restaurant.value }
    await updateRestaurant(restaurant_id, updates)
    origin_restaurant.value = { ...restaurant.value }
}
const menuArea = ref(null)
const triggerSaveMenu = () => {
    if (menuArea.value) {
        menuArea.value.saveMenu(); // 通过 ref 调用子组件的方法
    }
}
</script>

<template>
    <div class="restaurant-create-container">
        <!-- 餐廳資訊 -->
        <div class="info-area" v-if="restaurant">
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
        <MenuArea v-if="restaurant_id && menu" :restaurant_id="restaurant_id" :menus="menu" ref="menuArea" />

        <!-- 工具列 -->
        <nav id="toolbar">
            <button v-if="restaurant_id" :class="{ confirm: RestaurantisChanged }" @click="saveRestaurant"
                :disabled="!RestaurantisChanged">
                儲存餐廳
            </button>
            <button class="confirm" @click="router.push({ path: '/restaurants' })">
                完成
            </button>
            <button v-if="restaurant_id" class="confirm" @click="triggerSaveMenu">
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

label.confirm,
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