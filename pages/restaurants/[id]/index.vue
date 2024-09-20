<script setup>
import { getMenus} from '@/utils/menus/menuHandler';
import { getRestaurant } from '@/utils/restaurants/restaurantHandler';
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
const restaurant = ref(null)
const user_info = ref('')

onMounted(async () => {
	const data = await verify_credential()
	if (!data)
		router.push('/login');
	user_info.value = await getUserData(`user_id=${data.user_id}`)
	user_info.value = user_info.value.data
	// restaurant
	restaurant.value = await getRestaurant(restaurant_id)
	restaurant.value = restaurant.value.data
	console.log(restaurant.value)
	// menu
	menu.value = await getMenus(`restaurant=${restaurant_id}`);
	menu.value = menu.value.data
	console.log(menu.value)

	menu.value.forEach(_dish => {
		updateMenuList(_dish)
	});

});
// 菜單更新
const items = ref([])
const types = ref([])
const updateMenuList = (_dish) => {
	let _index = types.value.findIndex(type => type.name === _dish.category)

	if (_index < 0) {
		types.value.push({
			id: global.typeIndex,
			name: _dish.category,
			description: _dish.cate_description
		})
		global.typeIndex += 1
	}
	const item_type = types.value.find(type => type.name === _dish.category)

	items.value.push({
		id: _dish._id,
		name: _dish.name,
		price: `${_dish.price}`,
		typeId: item_type.id,
		image: _dish.image
	})
}

const currentPage = ref(1)
const nextPage = () => {
	if (currentPage.value < types.value.length)
		currentPage.value += 1
}
const previousPage = () => {
	if (currentPage.value > 1)
		currentPage.value -= 1
}
</script>


<template>
	<div id="restaurant-viewer">
		<section class="restaurant" v-if="restaurant">
			<div class="edit" @click="router.push({path:`/restaurants/${restaurant_id}/edit`})">
				編輯
			</div>
			<div class="image">
				<img :src="restaurant.image || noImage" alt="">
			</div>
			<div class="info">
				<span class="name">{{ restaurant.name }}</span>
				<span>電話:{{ restaurant.phone }}</span>
				<span>地址:{{ restaurant.address }}</span>
				<div class="types">
					類型:
					<span class="type" v-for="type in restaurant.types">
						{{ type }}
					</span>
				</div>
			</div>
		</section>
		<section class="menu">
			<div class="mark" v-if="types.length">
				<span id="category">{{ types[currentPage-1].name }}</span>
				<span id="description">{{ types[currentPage-1].description }}</span>
			</div>

			<menu v-if="items.length">
				<li v-for="item in items.filter(item => item.typeId == types[currentPage-1].id)">
					<span>{{ item.name }}</span>
					<span>${{ item.price }}</span>
				</li>

			</menu>
			<div class="page-changer">
				<span @click="previousPage"><img src="~assets/images/left-arrow.svg" alt=""></span>
				<p>{{ currentPage }}/{{ types.length }}</p>
				<span @click="nextPage"><img src="~assets/images/right-arrow.svg" alt=""></span>
			</div>
		</section>
	</div>
</template>


<style>
#restaurant-viewer {
	width: 90%;
	max-width: 1300px;
	height: 90%;

	margin: 0 auto;

	background: #fefefe;
	border-radius: 12px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

	position: relative;
	display: flex;


	--restaurant-width: 450px;
	--image-height: 300px;
	/* --bookmark-color:rgb(10, 21, 67); */
	--bookmark-color: rgb(10, 21, 67);
	--bookmark-width: 350px;
	--bookmark-height: 80px;
}

#restaurant-viewer .restaurant {
	display: flex;
	flex-direction: column;
	align-items: center;

	background: var(--black);
	border-radius: 12px;
	padding: 1rem;
	position: relative;
	z-index: 5;

	width: var(--restaurant-width);
}
#restaurant-viewer .restaurant .edit{
	position: absolute;
	cursor: pointer;
	top: 1rem;
	right: 1.5rem;
	color: white;
	background: var(--gold);
	padding-inline: 1rem;
	border-radius: 12px;
}

#restaurant-viewer .restaurant .image {
	max-height: var(--image-height);
	max-width: var(--image-height);
	padding: 1rem;
	border: 5px var(--gold) solid;
	border-radius: 100%;
	background: #fefefe;
	box-shadow: inset -5px -5px 10px 0px rgba(255, 255, 255, 0.5), inset 5px 5px 10px 0px rgba(0, 0, 0, 0.3);
	overflow: hidden;
}

#restaurant-viewer .restaurant .image img {
	aspect-ratio: 1/1;
	width: 100%;
	object-fit: scale-down;
	border-radius: inherit;
	transform-origin: center center;
	transition: all ease-in-out 0.3s;
	user-select: none;
}

#restaurant-viewer .restaurant .info {
	width: 100%;

	display: flex;
	justify-content: center;
	flex-direction: column;
}

#restaurant-viewer .restaurant .info>span {
	font-size: 1.2rem;
	line-height: 3rem;
	color: var(--gold);
}

#restaurant-viewer .restaurant .info .name {
	font-size: 1.5rem;
}

#restaurant-viewer .restaurant .info .types {
	position: absolute;
	bottom: 1rem;
	width: 100%;
	color: var(--gold);

	max-width: 90%;
	overflow-x: auto;
	white-space: nowrap;
	display: flex;
	gap: 0.5rem;
}

#restaurant-viewer .restaurant .info .types .type {
	color: white;
	background: var(--gold);
	padding-inline: 0.5rem;
	border-radius: 12px;
}

#restaurant-viewer .menu {
	border: 5px solid var(--gold);
	border-radius: 12px;
	width: calc(100% - var(--restaurant-width) + 20px);
	margin-left: -20px;
	position: relative;
	z-index: 0;
	overflow: hidden;
}

#restaurant-viewer .menu .mark {
	background: var(--bookmark-color);
	width: var(--bookmark-width);
	height: var(--bookmark-height);
	position: absolute;
	right: -10px;
	top: 10px;
	padding: 0.5rem 0 0.5rem 50px;
	color: var(--gold);
}

#restaurant-viewer .menu .mark::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 0;
	height: 0;
	border-top: calc(var(--bookmark-height) / 2) solid transparent;
	border-bottom: calc(var(--bookmark-height) / 2) solid transparent;

	border-left: calc(var(--bookmark-height) / 2) solid rgb(255, 255, 255);
}

#restaurant-viewer .menu .mark::after {
	content: '';
	position: absolute;
	top: 0;
	right: calc(var(--bookmark-height) / -2);
	width: 0;
	height: 0;
	border-top: calc(var(--bookmark-height) / 2) solid transparent;
	border-bottom: calc(var(--bookmark-height) / 2) solid transparent;
	border-left: calc(var(--bookmark-height) / 2) solid var(--bookmark-color)
}

#restaurant-viewer .menu .mark .content {
	padding: 0.5rem;
}

#restaurant-viewer .menu .mark #category {
	display: block;
	font-size: 1.8rem;
}

#restaurant-viewer .menu .mark #description {
	display: block;
	font-size: 1.2rem;
	text-indent: 2rem;
}

#restaurant-viewer .menu menu {
	margin-top: calc(var(--bookmark-height) + 5rem);
	padding: 0 1rem 0 3rem;
	width: 100%;
	max-height: 70%;
	overflow-y: auto;
}

#restaurant-viewer .menu menu li {
	font-size: 1.5rem;
	margin-top: 1rem;
	display: flex;
	justify-content: space-between;
	position: relative;
}

#restaurant-viewer .menu menu li::before {
	content: '◦';
	position: absolute;
	left: -1.5rem;
}
#restaurant-viewer .menu .page-changer{
	position:absolute;
	bottom: 1rem;
	left: 45%;
	display: flex;
	align-items: center;
	gap:1rem;
}
#restaurant-viewer .menu .page-changer span{
	display: flex;
	cursor: pointer;
}
</style>