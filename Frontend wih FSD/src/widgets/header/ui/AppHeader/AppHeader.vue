<template>
  <header :class="$style.appHeader">
    <div :class="$style.container">
      <div :class="$style.headerLogo">
        <router-link to="/">ТвойCRM</router-link>
      </div>
      
      <nav :class="[$style.headerNav, $style.desktopNav]">
        <router-link to="/" :class="$style.navLink">О проекте</router-link>
        <router-link v-if="isAuthenticated" to="/dashboard" :class="$style.navLink">Личный кабинет</router-link>
      </nav>
      
      <div :class="[$style.headerAuth, $style.desktopAuth]">
        <template v-if="isAuthenticated">
          <div :class="$style.userDropdown">
            <button :class="$style.dropdownToggle">
              <img :class="$style.userAvatar"
                v-if="imagePreview" 
                :src="imagePreview" 
                alt="Аватар"
              >
              <span v-else :class="$style.userAvatar">{{ userInitials }}</span>
              <span :class="$style.userName">{{ userName }}</span>
              <i class="fas fa-chevron-down"></i>
            </button>
            
            <div :class="$style.dropdownMenu">
              <router-link to="/dashboard" :class="$style.dropdownItem">
                <i class="fas fa-tachometer-alt"></i> Панель управления
              </router-link>
              <button 
                :class="$style.dropdownItem"
                @click="goToProfile"
              >
                <i class="fas fa-user-cog"></i> Настройки профиля
              </button>
              <button 
                :class="$style.dropdownItem"
                @click="logout"
              >
                <i class="fas fa-sign-out-alt"></i> Выйти
              </button>
            </div>
          </div>
        </template>
        
        <template v-else>
          <button :class="$style.btnLogin" @click="showLoginModal">Войти</button>
          <button :class="$style.btnRegister" @click="showRegisterModal">Регистрация</button>
        </template>
      </div>
      
      <button :class="$style.mobileMenuToggle" @click="$emit('toggle-mobile-menu')">
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

interface User {
  first_name?: string;
  second_name?: string;
  avatar?: string;
  [key: string]: any;
}

const store = useStore();
const router = useRouter();

const isAuthenticated = computed((): boolean => store.getters['auth/isAuthenticated']);
const user = computed((): User | null => store.getters['auth/user']);
const imagePreview = ref<string | null>(null);

const userName = computed((): string => {
  return user.value ? user.value.first_name || 'Пользователь' : 'Пользователь';
});

const userInitials = computed((): string => {
  if (!user.value) return '?';
  
  const firstInitial = user.value.first_name ? user.value.first_name.charAt(0).toUpperCase() : '';
  const secondInitial = user.value.second_name ? user.value.second_name.charAt(0).toUpperCase() : '';
  
  return `${firstInitial}${secondInitial}` || '?';
});

function showLoginModal(): void {
  store.commit('auth/SET_SHOW_LOGIN_MODAL', true);
}

function showRegisterModal(): void {
  store.commit('auth/SET_SHOW_REGISTER_MODAL', true);
}

function goToProfile(): void {
  router.push('/dashboard');
  store.commit('dashboard/SET_ACTIVE_TAB', 'profile');
}

function logout(): void {
  store.dispatch('auth/logout');
  router.push('/');
}

watchEffect(() => {
  if (user.value && user.value.avatar) {
    imagePreview.value = `${import.meta.env.VITE_API_URL}/uploads/avatars/${user.value.avatar}`;
  } else {
    imagePreview.value = null;
  }
});

defineEmits<{
  (e: 'toggle-mobile-menu'): void;
}>();
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>