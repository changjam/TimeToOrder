<template>
    <div class="error-wrapper">
        <h1>看起來你餓昏頭了，這邊沒有東西🤤</h1>
        <NuxtLink to="/" class="link">回首頁</NuxtLink>
    </div>
</template>

<script setup>
</script>

<style>
.error-wrapper {
    margin-inline: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    gap: 1rem;
}

.error-wrapper .link{
    color: var(--black);
    text-decoration: none;
    font-size: 2rem;
    background-color: #c9c9c9;
    border: 2px solid var(--black);
    border-radius: 4px;
    padding-inline: 1rem;
}

.error-wrapper .link:hover{
    background-color: rgba(201, 201, 201, 0.4);
}
</style>