<script setup>
import { getMenuByImage } from '@/utils/ocr/ocrHandler'
import { getMenus, addMenu } from '@/utils/menus/menuHandler'
// 全域變數
const props = defineProps(['restaurant_id'])
const MenuArea = {
    curentItems: 0,
    currentTypes: 0
}
// DragAndDrop
const startDrag = (event, item) => {
    event.dataTransfer.setData('itemID', item.id)
}
const onDrop = (event, type) => {
    const itemID = event.dataTransfer.getData('itemID');
    const item = items.value.find((item) => item.id == itemID);
    item.typeId = type.id;
};
// 按鈕功能
const addNewitem = (type_id) => {
    items.value.push({
        id: MenuArea.curentItems,
        name: "餐點名稱",
        typeId: type_id,
        price: '0',
        image: ''
    })
    MenuArea.curentItems += 1;
}
const removeItem = (_item) => {
    const _index = items.value.indexOf(_item);
    if (_index > -1) {
        items.value.splice(_index, 1);
    }
}
const addNewType = () => {
    types.value.push({
        id: MenuArea.currentTypes,
        name: "類別名稱",
        description: "類別描述"
    })
    MenuArea.currentTypes += 1;
}
const removeType = (type) => {
    //移除type
    const tpye_index = types.value.indexOf(type);
    if (tpye_index > -1) {
        types.value.splice(tpye_index, 1);
    }
    // 移除type的餐點
    const typeItems = items.value.filter(item => item.typeId == type.id)
    typeItems.forEach(_item => {
        const _index = items.value.indexOf(_item);
        if (_index > -1) {
            items.value.splice(_index, 1);
        }
    })

}

// 菜單內容
const items = ref([])
const types = ref([])
const menuItems = ref([])
const formatMenuItem = () => {
    return new Promise((resolve) => {
        const formattedItems = items.value.map(item => {
            const _itemType = types.value.find(type => type.id === item.typeId)
            const _menuItem = {
                name: item.name,
                price: Number(item.price.replace(/[^\d.]/g, '')),
                category: item.typeIndex == -1 ? '' : _itemType.name,
                cate_description: item.typeIndex == -1 ? '' : _itemType.description,
            }
            return _menuItem;
        })
        items.value = []
        types.value = []
        resolve(formattedItems)
    })
}
// 照片添加
const addbyimage = async (event) => {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onloadend = async () => {
            const base64Image = reader.result
            const filename = file.name
            const result = await getMenuByImage(filename, base64Image)
            console.log(result)
            const importMemuList = result.result.result
            importMemuList.map(dish => {
                dish.id = MenuArea.curentItems
                dish.typeIndex = -1
                MenuArea.curentItems += 1
                return dish
            })
            items.value.push(...importMemuList)
        }
        reader.readAsDataURL(file)
    }
}

const updateMenu = (_dish) => {
    let _index = types.value.findIndex(type => type.name === _dish.category)

    if (_index < 0) {
        types.value.push({
            id: MenuArea.currentTypes,
            name: _dish.category,
            description: _dish.cate_description
        })
        MenuArea.currentTypes += 1
    }
    const item_type = types.value.find(type => type.name === _dish.category)

    items.value.push({
        id: _dish._id,
        name: _dish.name,
        price: `${_dish.price}`,
        typeId: item_type.id,
    })
    console.log(items.value)
}
// 儲存菜單
const saveMenu = async () => {
    menuItems.value = await formatMenuItem()
    for (const menuItem of menuItems.value) {
        if (menuItem.name.trim() !== '') { // 確保菜單名稱不為空
            const menuData = {
                restaurant: props.restaurant_id,
                ...menuItem
            };
            const addedMenu = await addMenu(menuData);
            console.log(addedMenu)
            updateMenu(addedMenu)
        }
    }
}
defineExpose({saveMenu});

</script>

<template>
    <div class="menu-area">
        <nav class="menu-function">
            <span style="text-align: center;">菜單</span>
            <button class="confirm" @click="addNewitem(-1)">新增菜色</button>
            <button class="confirm" @click="addNewType">新增類別</button>
            <label class="confirm" for="addByImage">使用圖片匯入</label>
            <input type="file" @change="addbyimage" id="addByImage" autocomplete="off" hidden />
            <button class="confirm" @click="saveMenu">儲存菜單</button>
        </nav>
        <!-- 建立的類別 -->
        <div class="category-container" v-for="(type) in types">
            <section class="caption">
                <input id="category" type="text" name="" v-model="type.name">
                <input id="description" type="text" name="" v-model="type.description">
                <button @click="addNewitem(type.id)"><img src="~/assets/images/plus.svg" alt="" srcset=""></button>
                <button @click="removeType(type)"><img src="~/assets/images/circle-x.svg" alt="" srcset=""></button>
            </section>
            <!-- Drop Area -->
            <div class="category-dishes" @drop="onDrop($event, type)" @dragover.prevent @dragenter.prevent>
                <!-- Drop Items -->
                <div id="dish" class="dish" draggable="true" @dragstart="startDrag($event, item)"
                    v-for="item in items.filter(item => item.typeId == type.id)">
                    <span class="grab"> <img src="~/assets/images/dots-vertical-rounded.svg" alt=""></span>
                    <span class="name"><input type="text" v-model="item.name"></span>
                    <span class="price"><input type="text" v-model="item.price"></span>
                    <span class="addImage"><img src="~/assets/images/plus.svg" alt="" srcset=""></span>
                    <span class="functions" draggable="false" @click="removeItem(item)">
                        <img src="~/assets/images/circle-x.svg" alt="" srcset="" draggable="false">
                    </span>
                </div>

            </div>
        </div>
        <!-- 其他類別 -->
        <div class="category-container">
            <section class="caption">
                <h2 style="text-align: center;width: 100%;">無類別</h2>
                <button @click="addNewitem(-1)"><img src="~/assets/images/plus.svg" alt="" srcset=""></button>
            </section>
            <!-- Drop Area -->
            <div class="category-dishes" @drop="onDrop($event, { id: -1 })" @dragover.prevent @dragenter.prevent>
                <!-- Drop Items -->
                <div id="dish" class="dish" draggable="true" @dragstart="startDrag($event, item)"
                    v-for="item in items.filter(item => item.typeId == -1)">
                    <span class="grab" draggable="false">
                        <img src="~/assets/images/dots-vertical-rounded.svg" alt="" draggable="false">
                    </span>
                    <span class="name" draggable="false">
                        <input type="text" v-model="item.name" draggable="false">
                    </span>
                    <span class="price" draggable="false">
                        <input type="text" v-model="item.price" draggable="false">
                    </span>
                    <span class="addImage" draggable="false">
                        <img src="~/assets/images/plus.svg" alt="" srcset="" draggable="false">
                    </span>
                    <span class="functions" draggable="false" @click="removeItem(item)">
                        <img src="~/assets/images/circle-x.svg" alt="" srcset="" draggable="false">
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.restaurant-create-container .menu-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
    padding-inline: 1rem;
    position: relative;
    height: 90%;
}

.restaurant-create-container .menu-area .menu-function {
    display: flex;
    gap: 1rem;
    margin-inline: auto;
    font-size: 1.5rem;
}

.restaurant-create-container .menu-area .menu-function>* {
    padding-inline: 0.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1.5rem;
}

.category-container {
    --caption-height: 40px;
    --category-name-width: 100px;
    --dish-height: 1.5rem;
    --dish-border-thick: 2px;
}

.category-container>.caption {
    display: flex;
    align-items: center;
    background: rgb(225, 225, 225);
    padding: 4px;
    height: var(--caption-height);

    border-radius: 30px;
}

.category-container>.caption>input {
    background: transparent;
    outline: 0;
    border: 0;
    border-radius: 26px;
    font-size: 1.2rem;
    height: 30px;
    flex-basis: var(--category-name-width);
    padding-inline: 0.5rem;
}

.category-container>.caption>button {
    flex-basis: 2rem;
    cursor: pointer;
    display: flex;
    background: rgb(225, 225, 225);
}

.category-container>.caption input#description {
    flex-grow: 1;
}

.category-container>.caption input:focus {
    background: white;
}

.category-dishes {
    display: flex;
    flex-direction: column;
    min-height: calc(var(--dish-height) + var(--dish-border-thick));
    padding: 0 0.5rem 0.5rem 0.5rem;
    margin-inline: 1rem;
}

.category-dishes:hover {
    border-radius: 0 0 8px 8px;
    background: lightblue;
}

.category-dishes .dish {
    background: rgb(198, 198, 198);
    padding-inline: 0.5rem;
    display: flex;
    align-items: center;
    -webkit-user-drag: element;
}

.category-dishes .dish .grab,
.category-dishes .dish .addImage,
.category-dishes .dish .functions {
    display: flex;
    flex-basis: 2rem;
}

.category-dishes .dish .grab {
    cursor: grab;
}

.category-dishes .dish .addImage,
.category-dishes .dish .functions {
    cursor: pointer;
    position: relative;
}

.category-dishes .dish .price {
    flex-basis: 10rem;
}

.category-dishes .dish .name {
    flex-basis: 10rem;
    flex-grow: 1;
}

.category-dishes .dish input {
    background: transparent;
    outline: 0;
    border: 0;
    width: 100%;
    padding-inline: 0.5rem
}

.category-dishes .dish input:focus {
    background: white;
}
</style>