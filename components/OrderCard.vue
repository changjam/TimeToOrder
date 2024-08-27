<script setup>
const router = useRouter()
</script>

<template>
    <div id="orderCard" @click="router.push({path:'/order'})">
        <h1>開始點單</h1>
        <img src="~/assets/images/order.svg" alt="">
    </div>
</template>

<style>
#orderCard {
    position: relative;
    overflow: hidden;
    z-index: 0;
    border: 3px solid var(--gold);
    border-radius: 20px;
    background-color: rgb(45, 58, 92);

    filter: grayscale(80%);
    transition: filter 0.5s ease;
}

#orderCard::before {
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

#orderCard:hover{
    filter: grayscale(0);
    cursor: pointer;
}

#orderCard img {
    z-index: 1;
    position: absolute;
    bottom: 2rem;
    width: 80%;
    
    user-select: none;

    filter: grayscale(95%);
    transition: filter ease 0.5s;
}

#orderCard:hover img {
    filter: grayscale(0%);        
    animation: bounce 2s ease;
}

#orderCard h1{
    font-size: 3rem;
    color: var(--black);
    opacity: 0.3;
    position: absolute;
    top: 100px;

    user-select: none;
}

#orderCard:hover h1{
    opacity: 1;
    animation: fade-in-left 1s ease;
}

/* animation */
@keyframes fade-in-left {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounce {
    0% { transform:translateY(0%); }
    10% { transform:translateY(-30%); }
    20% { transform:translateY(0%) ; }
    25% { transform:translateY(-7%); }
    27% { transform:translateY(0%) ; }
    29% { transform:translateY(-3%); }
    30% { transform:translateY(0);}
}
</style>