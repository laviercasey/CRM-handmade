<template>
  <div :class="$style.footerMain">
    <!-- Логотип и описание -->
    <div :class="$style.logoSection">
      <Logo size="medium" />
      <p :class="$style.tagline">{{ config.tagline }}</p>
    </div>
    
    <!-- Навигационные ссылки -->
    <FooterNavigation :isAuthenticated="isAuthenticated" />
    
    <!-- Контактная информация -->
    <ContactSection />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import Logo from '@/shared/ui/Logo/';
import FooterNavigation from '@/features/footer-navigation/ui/FooterNavigation/';
import ContactSection from '@/features/footer-contact/ui/ContactSection/';
import { footerConfig } from '../../model/config';

const store = useStore();
const config = footerConfig;

const isAuthenticated = computed((): boolean => 
  store.getters['auth/isAuthenticated']
);
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>