<template>
  <nav :class="$style.nav">
    <router-link 
      v-for="item in navigationItems" 
      :key="item.path"
      :to="item.path" 
      :class="$style.link"
    >
      <i v-if="item.icon" :class="item.icon"></i>
      {{ item.label }}
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { navigationConfig } from '../model/config'

interface NavigationItem {
  path: string
  label: string
  icon: string
  requiresAuth: boolean
  requiresGuest: boolean
}

const props = defineProps<{
  isAuthenticated?: boolean
}>()

const navigationItems = computed<NavigationItem[]>(() => {
  return navigationConfig.items.filter(item => {
    if (item.requiresAuth && !props.isAuthenticated) return false
    if (item.requiresGuest && props.isAuthenticated) return false
    return true
  })
})
</script>

<style module src="./styles.module.scss" />