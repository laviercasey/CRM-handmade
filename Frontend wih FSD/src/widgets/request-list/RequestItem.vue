<template>
  <div 
    :class="$style.requestCard"
    @click="$emit('click', request)"
  >
    <div :class="$style.requestHeader">
      <div :class="$style.requestDate">
        {{ formatDate(request.created_at) }}
      </div>
      <div :class="[$style.requestStatus, $style[`status${capitalizeStatus(request.status)}`]]">
        {{ getStatusText(request.status) }}
      </div>
    </div>
    
    <div :class="$style.requestBody">
      <h3 :class="$style.requestTitle">{{ request.service_name }}</h3>
      <p :class="$style.requestPrice">{{ formatPrice(request.price) }} ₽</p>
      <p :class="$style.requestContact">
        <i class="fab fa-telegram"></i> {{ request.contact_tg }}
      </p>
    </div>
    
    <div :class="$style.requestFooter">
      <button 
        v-if="request.status === 'pending'"
        :class="[$style.actionButton, $style.accept]"
        @click.stop="updateStatus('accepted')"
      >
        Принять
      </button>
      <button 
        v-if="request.status === 'pending'"
        :class="[$style.actionButton, $style.reject]"
        @click.stop="updateStatus('rejected')"
      >
        Отклонить
      </button>
      <button 
        v-if="request.status === 'accepted'"
        :class="[$style.actionButton, $style.complete]"
        @click.stop="updateStatus('done')"
      >
        Выполнено
      </button>
      <button 
        v-if="request.status !== 'pending'"
        :class="[$style.actionButton, $style.reset]"
        @click.stop="updateStatus('pending')"
      >
        Вернуть в ожидание
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'done';

interface Request {
  id: string | number;
  service_name: string;
  price: number;
  status: RequestStatus;
  created_at: string;
  contact_tg: string;
  [key: string]: any;
}

interface StatusUpdateEvent {
  requestId: string | number;
  status: RequestStatus;
}

interface RequestItemProps {
  request: Request;
}

const props = defineProps<RequestItemProps>();

const emit = defineEmits<{
  (e: 'statusUpdate', payload: StatusUpdateEvent): void;
  (e: 'click', request: Request): void;
}>();

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  
  return new Intl.DateTimeFormat('ru-RU', options).format(date);
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price);
}

function getStatusText(status: RequestStatus): string {
  const statusMap: Record<RequestStatus, string> = {
    'pending': 'Ожидает',
    'accepted': 'Принята',
    'rejected': 'Отклонена',
    'done': 'Выполнена'
  };
  
  return statusMap[status] || status;
}

function capitalizeStatus(status: RequestStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function updateStatus(newStatus: RequestStatus): void {
  emit('statusUpdate', {
    requestId: props.request.id,
    status: newStatus
  });
}
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>