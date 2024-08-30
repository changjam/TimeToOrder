<script setup>
  import { getRestaurant } from '@/utils/restaurants/restaurantHandler';
  const restaurants = await getRestaurant();
  const router = useRouter()
</script>

<template>
    <div class="container">
      <h3>想吃甚麼?</h3>
      <div id="menus">
        <div class="create-restaurant" @click="router.push({path:'/restaurants/create'})">
            <h1>建立新菜單</h1>
        </div>
        <RestaurantItemCard v-for="restaurant in restaurants" :restaurants="restaurant" :key="restaurant._id"></RestaurantItemCard>
      </div>
    </div>
</template>

<style scoped>
  #menus {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(var(--menu-width), 1fr));
      grid-auto-rows: var(--menu-height);
      --menu-width: 245px;
      --menu-height: 350px;
      --image-height: 250px;

      gap: 1rem;
      margin: 0 auto;
      justify-content: center;

  }

  .container{
      width:80%;
      margin: auto;
  }
  .create-restaurant{
    justify-self: center;
    border: 3px solid var(--gold);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--rice);
    margin: 1rem;

    position: relative;
    min-height: var(--menu-height);
    width: var(--menu-width);
  }
  .create-restaurant:hover{
      cursor: pointer;
  }

  .create-restaurant h1{
      font-size:2rem ;
  }
</style>