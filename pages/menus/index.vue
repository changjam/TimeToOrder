<script setup>
import restaurantsJson from '~/assets/jsons/restaurants.json'
const restaurants =  restaurantsJson.data
console.log(restaurants)

</script>

<template>
    <div class="container">
      <h3>想吃甚麼?</h3>
      <div id="menus">
        <MenuCard v-for="restaurant in restaurants" :restaurant="restaurant" :key="restaurant.id"></MenuCard>
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
</style>