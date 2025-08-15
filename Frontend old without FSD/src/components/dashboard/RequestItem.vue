
<template>
  <div 
    class="request-card"
    @click="$emit('click', request)"
  >
    <div class="request-header">
      <div class="request-date">
        {{ formatDate(request.created_at) }}
      </div>
      <div :class="['request-status', `status-${request.status}`]">
        {{ getStatusText(request.status) }}
      </div>
    </div>
    
    <div class="request-body">
      <h3 class="request-title">{{ request.service_name }}</h3>
      <p class="request-price">{{ formatPrice(request.price) }} ₽</p>
      <p class="request-contact">
        <i class="fab fa-telegram"></i> {{ request.contact_tg }}
      </p>
    </div>
    
    <div class="request-footer">
      <button 
        v-if="request.status === 'pending'"
        class="action-button accept"
        @click.stop="updateStatus('accepted')"
      >
        Принять
      </button>
      <button 
        v-if="request.status === 'pending'"
        class="action-button reject"
        @click.stop="updateStatus('rejected')"
      >
        Отклонить
      </button>
      <button 
        v-if="request.status === 'accepted'"
        class="action-button complete"
        @click.stop="updateStatus('done')"
      >
        Выполнено
      </button>
      <button 
        v-if="request.status !== 'pending'"
        class="action-button reset"
        @click.stop="updateStatus('pending')"
      >
        Вернуть в ожидание
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['statusUpdate', 'click']);

function formatDate(dateString) {
  const date = new Date(dateString);
  
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  
  return new Intl.DateTimeFormat('ru-RU', options).format(date);
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price);
}

function getStatusText(status) {
  const statusMap = {
    'pending': 'Ожидает',
    'accepted': 'Принята',
    'rejected': 'Отклонена',
    'done': 'Выполнена'
  };
  
  return statusMap[status] || status;
}

function updateStatus(newStatus) {
  emit('statusUpdate', {
    requestId: props.request.id,
    status: newStatus
  });
}
</script>

<style scoped>
.request-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.request-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.request-date {
  font-size: 14px;
  color: #666;
}

.request-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background-color: #fff8e1;
  color: #f9a825;
}

.status-accepted {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-rejected {
  background-color: #ffebee;
  color: #c62828;
}

.status-done {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.request-body {
  padding: 15px;
}

.request-title {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 500;
}

.request-price {
  font-weight: bold;
  color: #6c5ce7;
  margin: 0 0 10px;
}

.request-contact {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.request-footer {
  padding: 10px 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.action-button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button.accept {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.action-button.accept:hover {
  background-color: #c8e6c9;
}

.action-button.reject {
  background-color: #ffebee;
  color: #c62828;
}

.action-button.reject:hover {
  background-color: #ffcdd2;
}

.action-button.complete {
  background-color: #e3f2fd;
  color: #1565c0;
}

.action-button.complete:hover {
  background-color: #bbdefb;
}

.action-button.reset {
  background-color: #f5f5f5;
  color: #333;
}

.action-button.reset:hover {
  background-color: #e0e0e0;
}
</style>
