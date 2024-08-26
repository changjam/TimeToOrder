<script setup>
const router = useRouter()
</script>

<template>
    <header class="curved">
        <div class='title-container' @click="router.push({ path: '/' })">

            <img src="~/assets/images/logo.png" alt="Logo" id="logo" />
        </div>
        <nav class='navbar'>

        </nav>
    </header>
</template>

<style>
header.curved {
    box-sizing: border-box;

    position: absolute;
    top: 0;
    width: 100%;
    height: var(--header-height);

    padding-block: 12px;
    gap: 12px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    background: transparent;

    z-index: 100;
    
}

header.curved::before {
    box-sizing: border-box;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--light-gray);
    /* background: #9dbcff; */

    border-radius: 0 0 50% 50%/0 0 100% 100%;
    border-bottom: 2px solid var(--gold);
    transform: scaleX(1.5);
}

header.curved>* {
    position: relative;
    z-index: 101;
}

#logo {
    width: 70%;
    max-height: calc(var(--header-height) *0.8);
    top: 0;
    left: 0;
    user-select: none;
}

.title-container {
    display: flex;
    justify-content: center;
}

.title-container:hover {
    cursor: pointer;
}
</style>