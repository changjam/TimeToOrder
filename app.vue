<template>  
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>  
</template>

<script setup>
import '~/assets/css/index.css'
useHead({
  title:'Time to Order',
  meta:[
    {name:'description' , content:'order meal website'}
  ]
})
</script>