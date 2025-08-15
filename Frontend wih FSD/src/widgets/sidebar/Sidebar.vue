<template>
  <aside :class="$style.sidebar">
    <nav :class="$style.sidebarNav">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="[$style.sidebarItem, { [$style.active]: activeTab === tab.key }]"
        @click="$emit('change-tab', tab.key)"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
interface Tab {
  key: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  activeTab: string;
}

defineProps<SidebarProps>();

defineEmits<{
  (e: 'change-tab', tabKey: string): void;
}>();

const tabs: Tab[] = [
  { key: 'requests', label: 'Заявки', icon: 'fas fa-clipboard-list' },
  { key: 'products', label: 'Товары', icon: 'fas fa-box' },
  { key: 'statistics', label: 'Статистика', icon: 'fas fa-chart-bar' },
  { key: 'calculations', label: 'Расчеты', icon: 'fas fa-calculator' },
  { key: 'profile', label: 'Профиль', icon: 'fas fa-user-cog' }
];
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>