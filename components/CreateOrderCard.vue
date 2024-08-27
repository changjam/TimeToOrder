<script setup>
const router = useRouter();
</script>

<template>
    <div id="createOrderCard" @click="router.push({path:'/create_order'})">
        <h1>建立訂單</h1>
        <img src="~/assets/images/create-order.svg" alt="">
    </div>
</template>

<style>
#createOrderCard {
    position: relative;
    overflow: hidden;
    z-index: 0;
    border: 3px solid var(--gold);
    border-radius: 20px;
    background-color: rgb(45, 58, 92);

    filter: grayscale(80%);
    transition: filter 0.5s ease;
}

#createOrderCard::before {
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

#createOrderCard:hover {
    filter: grayscale(0);
    cursor: pointer;
}

#createOrderCard img {
    z-index: 1;
    position: absolute;
    bottom: 2rem;
    left: 30%;
    height: 50%;

    user-select: none;

    filter: grayscale(95%);
    transform: rotateZ(-90deg);
    transform-origin: 130px 180px ;
    transition: filter ease 0.5s, transform ease 0.8s;
}

#createOrderCard:hover img {
    filter: grayscale(0%);
    transform: rotateZ(0deg);
    /* animation: bounce 2s ease; */
}

#createOrderCard h1 {
    font-size: 3rem;
    color: var(--black);
    opacity: 0.3;
    position: absolute;
    top: 100px;

    user-select: none;
}

#createOrderCard:hover h1 {
    opacity: 1;
    animation: fade-in-left 1s ease;
}
</style>