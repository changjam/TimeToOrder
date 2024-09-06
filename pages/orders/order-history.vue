<script setup>
import { ref } from 'vue'
import { getUserData } from '@/utils/users/userHandler'
import { verify_credential } from '@/utils/auth/verifyHandler'
import { getGroupData } from '@/utils/groups/groupHandler'
import { getOrders } from '@/utils/order/orderHandler'

const user_info = ref(null)
const user_id = ref('')
const groupDataList = ref([])
const order_history = ref([])

onMounted(async () => {
    const data = await verify_credential()
    if (!data)
        router.push('/login');

    user_id.value = data.user_id;
    const response = await getUserData(`user_id=${user_id.value}`);
    user_info.value = response.data;
    const joinedGroups = user_info.value.joinedGroups
    for (const group of joinedGroups) {
        const groupData = await getGroupData(`_id=${group}`)
        groupDataList.value.push( groupData.data )
    }
    for (const group of groupDataList.value) {
      group.historicalOrderIds.filter(async (order_id) => {
          const info = await getOrders(`_id=${order_id}`);
          order_history.value.push(info.data[0])
      })
    }
})
</script>

<template>
    <div class="order-history">
      <h1 class="title">Order History</h1>
      <div v-for="order in order_history" :key="order._id" class="order-card">
        <div class="order-header">
          <h2 class="order-name">訂單名稱 : {{ order.order_name }}</h2>
        </div>
        <div class="order-content" v-if="order.orders.length">
          <div v-for="item in order.orders" :key="item._id" class="order-item">
            <div class="item-header">
              <p class="item-name">訂購人 : {{ item.name }}</p>
              <p class="item-total-amount">總金額 : {{ item.totalAmount }}</p>
              <p class="item-order-time">訂購時間 : {{ item.orderTime }}</p>
            </div>
            <div v-for="food in item.orderedItems" :key="food.name" class="food-details">
              <p>訂購細項 :</p>
              <p class="food-name">餐點名稱 : {{ food.name }}</p>
              <p class="food-amount">數量 : {{ food.amount }}</p>
            </div>
          </div>
        </div>
        <div v-else class="no-order-info">
          <p>尚未有訂購資訊</p>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .order-history {
    font-family: 'Poppins', sans-serif;
    padding: 30px;
    background-color: #f4f6f9;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .title {
    text-align: center;
    color: #2d3436;
    font-size: 2.5em;
    margin-bottom: 20px;
  }
  
  .order-card {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    margin-bottom: 30px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .order-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  
  .order-header {
    border-bottom: 1px solid #dfe6e9;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
  
  .order-name {
    font-size: 1.75em;
    color: #2d3436;
  }
  
  .order-content {
    padding: 10px 0;
  }
  
  .order-item {
    border-top: 1px solid #f0f0f0;
    padding-top: 15px;
    margin-top: 15px;
  }
  
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    color: #636e72;
  }
  
  .item-name {
    font-weight: 600;
  }
  
  .item-total-amount {
    font-size: 1.1em;
    color: #0984e3;
  }
  
  .item-order-time {
    font-size: 0.9em;
    color: #b2bec3;
  }
  
  .food-details {
    padding-left: 25px;
    border-left: 2px solid #dfe6e9;
    margin-top: 10px;
  }
  
  .food-name {
    font-size: 1.1em;
    color: #2d3436;
  }
  
  .food-amount {
    color: #00b894;
  }
  
  .no-order-info {
    text-align: center;
    padding: 20px;
    background-color: #ffeaa7;
    border-radius: 8px;
  }
  
  .no-order-info p {
    font-size: 1.2em;
    color: #d35400;
  }
  
  @media screen and (max-width: 768px) {
    .item-header {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .order-card {
      padding: 15px;
    }
  }
  </style>
  