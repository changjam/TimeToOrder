<script setup>
import { ref, computed } from 'vue'
import { getUserData , getUsersDataInGroup } from '@/utils/users/userHandler'
import { getGroupData } from '@/utils/groups/groupHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import { date_output_format } from '@/utils/date/timeHandler'
import AvatarCircles from '~/components/AvatarCircles.vue'


const router = useRouter();
const groupDataList = ref([])
const user_info = ref(null)
const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = 3

const paginatedGroups = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return groupDataList.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(groupDataList.value.length / itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

onMounted(async () => {
  const data = await verify_credential()
  if (!data) 
    router.push('/login');

  const response = await getUserData(`user_id=${data.user_id}`);
  user_info.value = response.data;

  const joinedGroups = user_info.value.joinedGroups
  if (joinedGroups.length == 0)
    return;

  for (const group of joinedGroups) {
    const groupData = await getGroupData(`_id=${group}`)
    const groupMember_response = await getUsersDataInGroup(`group_id=${group}`)
    const groupMemberData = groupMember_response.data
    const user_response = await getUserData(`user_id=${groupData.data.creator}`);
    const creator_name = user_response.data.nickName || user_response.data.name
    groupDataList.value.push({ ...groupData.data, creator_name: creator_name, members: groupMemberData })
  }

  loading.value = false
})
</script>

<template>
<div class="group-container-wrapper">
  <div v-if="loading">
    <h1>Loading...</h1>
  </div>
  <div class="group-container" v-else>
    <div class="group-list">
      <h2 class="tab-title">群組列表</h2>
      <div 
        v-for="(group, idx) in paginatedGroups" :key="idx" 
        class="group-item"
        @click="router.push({path: '/groups/' + group._id})"
      >
        <h3>{{ group.name }}</h3>
        <p>創建人: {{ group.creator_name }}</p>
        <p>創建時間: {{ date_output_format(group.createdAt) }}</p>
        <AvatarCircles :members="group.members" :showNum="3"></AvatarCircles>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="button-style prev-button">上一頁</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="button-style next-button">下一頁</button>
      </div>
    </div>
    <button @click="router.push({path:'/groups/create'})" class="add-button button-style">新增群組</button>
  </div>
</div>
</template>

<style scoped>
.group-container-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.group-container {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.tab-title {
  padding-bottom: 20px;
}

.button-style {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.add-button {
  background-color: #28a745;
}

.add-button:hover {
  background-color: #218838;
}

.group-item {
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.group-item:hover {
  cursor: pointer;
}

.group-item h3 {
  margin: 0 0 5px 0;
  color: #343a40;
}

.group-item p, .group-item ul {
  margin: 5px 0;
  color: #495057;
}

.group-item ul {
  padding-left: 20px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.prev-button, .next-button {
  width: 48%;
  background-color: #007bff;
}

.prev-button:disabled, .next-button:disabled {
  background-color: #6c757d;
}

.prev-button:hover, .next-button:hover {
  background-color: #0056b3;
}
</style>
