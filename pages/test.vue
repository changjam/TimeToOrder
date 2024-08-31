<script setup>
import { ref, computed } from 'vue';

const member_input = ref('');
const users = ref([
    { id: 1, name: 'Kousa', email: 'yehkaisa@gmail.com' },
    { id: 2, name: 'Jam', email: 'JamChang@gmail.com' },
    { id: 3, name: 'Sam', email: 'Sam@gmail.com' },
]);

const members = ref(new Set())

const showSuggestions = ref(false);
const filteredUsers = computed(() => {
    if (member_input.value) {
        const searchQuery = member_input.value.toLowerCase()
        return users.value.filter(user =>
            user.name.toLowerCase().includes(searchQuery)
        );
    }
    return [];
});
// const filteredUsers = computed(() => {
//   const lastWord = input.value.split(' ').pop();
//   if (lastWord.startsWith('@')) {
//     const searchQuery = lastWord.substring(1).toLowerCase();
//     return users.value.filter(user =>
//       user.name.toLowerCase().includes(searchQuery)
//     );
//   }
//   return [];
// });

const onInput = () => {
    showSuggestions.value = member_input.value;
};

const selectUser = (user) => {
    members.value.add(user);
    member_input.value = '';
    showSuggestions.value = false;
};

const removeMember = (member) => {
    members.value.delete(member)
}
</script>
<template>
    <div>
        <div v-for="member in members" class="member" :key="member.id">{{ member.name }}

            <button @click="removeMember(member)">delete</button>
        </div>
        <input type="text" v-model="member_input" @input="onInput" placeholder="輸入成員...">
        <div v-if="showSuggestions">
            <ul>
                <li v-for="user in filteredUsers" :key="user.id" @click="selectUser(user)">
                    <img src="~/assets/images/1.jpg" alt="">
                    {{ user.name }}
                </li>
            </ul>
        </div>
    </div>
</template>
<style scoped>
textarea {
    width: 100%;
    height: 100px;
}

ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ddd;
    max-height: 150px;
    overflow-y: auto;
}

li {
    padding: 8px;
    cursor: pointer;
}

li:hover {
    background-color: #f0f0f0;
}
</style>