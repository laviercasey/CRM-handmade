<template>
    <div class="notification-system">
      <transition-group name="notification">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          :class="['notification', notification.type]"
        >
          <div class="notification-icon">
            <i :class="getIconClass(notification.type)"></i>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
          </div>
          <button class="notification-close" @click="removeNotification(notification.id)">
            &times;
          </button>
        </div>
      </transition-group>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  
  const store = useStore()
  
  const notifications = computed(() => store.state.notifications.notifications)
  
  function removeNotification(id) {
    store.dispatch('notifications/removeNotification', id)
  }
  
  function getIconClass(type) {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle'
      case 'error':
        return 'fas fa-exclamation-circle'
      case 'warning':
        return 'fas fa-exclamation-triangle'
      case 'info':
        return 'fas fa-info-circle'
      default:
        return 'fas fa-bell'
    }
  }
  </script>
   
  <style scoped>
  .notification-system {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 350px;
  }
  
  .notification {
    display: flex;
    align-items: flex-start;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 15px;
    transition: all 0.3s;
  }
  
  .notification.success {
    border-left: 4px solid #4caf50;
  }
  
  .notification.error {
    border-left: 4px solid #f44336;
  }
  
  .notification.warning {
    border-left: 4px solid #ff9800;
  }
  
  .notification.info {
    border-left: 4px solid #2196f3;
  }
  
  .notification-icon {
    margin-right: 15px;
    font-size: 20px;
  }
  
  .notification.success .notification-icon {
    color: #4caf50;
  }
  
  .notification.error .notification-icon {
    color: #f44336;
  }
  
  .notification.warning .notification-icon {
    color: #ff9800;
  }
  
  .notification.info .notification-icon {
    color: #2196f3;
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-title {
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .notification-message {
    font-size: 14px;
    color: #666;
  }
  
  .notification-close {
    background: none;
    border: none;
    font-size: 20px;
    color: #999;
    cursor: pointer;
    padding: 0;
    margin-left: 10px;
  }
  
  .notification-close:hover {
    color: #666;
  }
  
  .notification-enter-active, .notification-leave-active {
    transition: all 0.3s;
  }
  
  .notification-enter-from, .notification-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  </style>
  