<template>
  <Dropdown position="bottomRight" data-dropdown>
    <template #trigger="{ isOpen }">
      <div :class="$style.trigger">
        <UserInfo 
          :user="user" 
          :show-name="true"
          :show-email="false"
          avatar-size="medium"
        />
        <i 
          class="fas fa-chevron-down"
          :class="[$style.chevron, { [$style.open]: isOpen }]"
        ></i>
      </div>
    </template>
    
    <template #menu="{ close }">
      <div :class="$style.menu">
        <router-link 
          to="/dashboard" 
          :class="$style.menuItem"
          @click="close"
        >
          <i class="fas fa-tachometer-alt"></i>
          Панель управления
        </router-link>
        
        <button 
          :class="$style.menuItem"
          @click="handleProfileClick(close)"
        >
          <i class="fas fa-user-cog"></i>
          Настройки профиля
        </button>
        
        <div :class="$style.divider"></div>
        
        <button 
          :class="[$style.menuItem, $style.logoutItem]"
          @click="handleLogout(close)"
        >
          <i class="fas fa-sign-out-alt"></i>
          Выйти
        </button>
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import Dropdown from '@/shared/ui/Dropdown/';
import UserInfo from '@/entities/user/ui/UserInfo/';

interface User {
  [key: string]: any;
}

interface UserDropdownProps {
  user: User;
}

const props = defineProps<UserDropdownProps>();

const emit = defineEmits<{
  (e: 'goToProfile'): void;
  (e: 'logout'): void;
}>();

function handleProfileClick(close: () => void): void {
  close();
  emit('goToProfile');
}

function handleLogout(close: () => void): void {
  close();
  emit('logout');
}
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>