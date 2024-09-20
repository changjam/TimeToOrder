<script setup>
const props = defineProps({
    showNum: {
        type: Number,
        default: 5
    },
    members: {
        type: Array,
    }
})

const member_showing = props.members.slice(0, props.showNum)
const not_showingNum = props.members.length - props.showNum
</script>

<template>
    <div class="avatar-circles-container">
        <img v-for="member in member_showing" :key="member.user_id" :src="member.customImage || member.image"
            :title="member.nickName || member.name">
        <span class="otherAvatar" v-if="not_showingNum > 0">
            +{{ not_showingNum }}
        </span>
    </div>

</template>

<style>
.avatar-circles-container {
    display: flex;
    z-index: auto;    
}
.avatar-circles-container> *:not(:last-child){
    margin-right: -1rem;
}

.avatar-circles-container img {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid white;
}
.avatar-circles-container .otherAvatar {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #495057;
    border-radius: 50%;
    border: 2px solid white;
    color: white;
}
</style>