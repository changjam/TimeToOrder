<script setup>
import restaurantJson from '~/assets/jsons/restaurants.json'
const route = useRoute()
const restaurant = restaurantJson.data.find(data => data.id == route.params.id)

const resultWrapper = ref(null)


const test = (dish) => {
    const volume = document.getElementById(`volume-${dish.name}`);
    const remark = document.getElementById(`remark-${dish.name}`);
    console.log(volume, remark)

    const tr = document.createElement('tr')
    tr.innerHTML = `
        <th scope="row" class="cell">${dish.name}</th>
        <td class="price" class="cell">${dish.price}</td>
        <td align="right" class="cell">${volume.value}個</td>
        <td align="right" class="cell">${remark.value}</td>
    `
    resultWrapper.value.appendChild(tr)

    remark.value = ''
    volume.value = 0
}

</script>

<template>
    <div class="restaurant-wrapper">
        <div class="menu-wrapper">
            <h2>菜單</h2>
            <table>
                <thead>
                    <tr>
                        <th scope="col" class="name">餐點</th>
                        <th scope="col" class="price">價錢</th>
                        <th scope="col" class="num">數量</th>
                        <th scope="col" class="remark">備註</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody v-if="restaurant.categories">
                    <template v-for="cate in restaurant.categories " :key="cate.name">
                        <tr class="category">
                            <th colspan="1">{{ cate.name }}</th>
                            <th colspan="4">{{ cate.description }}</th>
                        </tr>
                        <tr v-for="dish in cate.dishes" :key="dish.name">
                            <th scope="row" class="name">{{ dish.name }}</th>
                            <td class="price">{{ dish.price }}</td>
                            <td align="right"><input type="number" :id="`volume-${dish.name}`" value='0' min="0"
                                    class="no-arrows"></td>
                            <td align="right"><input type="text" :id="`remark-${dish.name}`"></td>
                            <td><button @click="test(dish)">確認</button></td>
                        </tr>
                    </template>
                </tbody>
                <tbody v-else>
                    <tr v-for="dish in restaurant.dishes">
                        <th scope="row" class="name">{{ dish.name }}</th>
                        <td class="price">{{ dish.price }}</td>
                        <td align="right"><input type="number" :id="`volume-${dish.name}`" value='0' min="0"
                                class="no-arrows"></td>
                        <td><input type="text" :id="`remark-${dish.name}`"></td>
                        <td><button @click="test(dish)">確認</button></td>
                    </tr>
                </tbody>

            </table>
        </div>
        <div class="result-wrapper">
            <h2>訂購資訊</h2>
            <table>
                <thead>
                    <tr>
                        <th scope="col" class="name">餐點</th>
                        <th scope="col" class="price">價錢</th>
                        <th scope="col" class="num">數量</th>
                        <th scope="col" class="remark">備註</th>
                    </tr>
                </thead>
                <tbody ref="resultWrapper">
                    
                </tbody>

            </table>
        </div>
    </div>
</template>

<style>
.restaurant-wrapper {
    display: grid;
    grid-template-columns: 2fr 1fr;
    width: 80%;
    margin-inline: auto;
    padding-top: 1rem;
    gap: 1rem;
}

.restaurant-wrapper  h2{
    text-align: center;
    margin-bottom: 1rem;
}


.restaurant-wrapper table {
    border-collapse: collapse;
    border: 2px solid rgb(140 140 140);
    font-family: sans-serif;
    font-size: 1rem;
    letter-spacing: 1px;
    width: 100%;
}

.restaurant-wrapper th,
.restaurant-wrapper td {
    border: 1px solid rgb(160 160 160);
    padding: 0.5rem;
}

.restaurant-wrapper th>*,
.restaurant-wrapper td>* {
    width: 100%;
}

.menu-wrapper input[type="number"] {
    text-align: end;
    display: block;
    max-width: 5rem;
}

.menu-wrapper input[type="text"] {
    text-align: right;
}

.menu-wrapper .name {
    text-align: left;
}

.menu-wrapper .price,
.menu-wrapper .num {
    text-align: right;
}

.menu-wrapper .category{
    font-size: 1.2rem;
}

.result-wrapper {
    width: 100%;
}

button:hover {
    cursor: pointer;
}


</style>