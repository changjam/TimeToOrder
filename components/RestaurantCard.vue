<script setup>
    import { useRouter } from 'vue-router'
    const router = useRouter()
</script>

<template>
    <div id="restaurantCard" @click="router.push({path:'/restaurants'})">
        <h1>查看餐廳</h1>
        <img src="~/assets/images/restaurant.svg" alt="">
    </div>
</template>

<style>
#restaurantCard {
    position: relative;
    overflow: hidden;
    z-index: 0;
    border: 3px solid var(--gold);
    border-radius: 20px;
    background-color: rgb(45, 58, 92);

    filter: grayscale(80%);
    transition: filter 0.5s ease;
}

#restaurantCard::before {
    content: '';
    position: absolute;
    width: 220%;
    height: 130%;
    top: -50%;
    left: -100%;

    background-color: white;
    border-radius: 50%;
    z-index: -1;
}

#restaurantCard:hover {
    filter: grayscale(0);
    cursor: pointer;
}

#restaurantCard img {
    z-index: 1;
    position: absolute;
    bottom: 2rem;
    left: 10%;
    top: 135px;
    width: 80%;

    user-select: none;

    filter: grayscale(95%);
    transition: filter ease 0.5s, transform ease 0.8s;
}

#restaurantCard:hover img {
    filter: grayscale(0%);
    top: 80px;
    animation: restaurantImageAnimation 1s ease;
}

#restaurantCard h1 {
    font-size: 3rem;
    color: var(--black);
    opacity: 0.3;
    position: absolute;
    top: 100px;

    user-select: none;
}

#restaurantCard:hover h1 {
    opacity: 1;
    animation: restaurantTitleAnimation 1s ease;
    top: 250px;
}

@keyframes restaurantTitleAnimation {
    10% {
        top: 90px;
    }

    80% {
        top: 250px;
    }
}

@keyframes restaurantImageAnimation {
    10% {
        top: 135px;
    }
    50%{
        top: 0px;
    }
    100% {
        top: 80px;
    }
}
</style>