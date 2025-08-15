<template>
  <div :class="$style.group">
    <h3 :class="$style.title">{{ group.title }}</h3>
    <ul :class="$style.list">
      <li 
        v-for="link in visibleLinks" 
        :key="link.id"
        :class="$style.item"
      >
        <FooterLink
          :to="link.to"
          :text="link.text"
          :icon="link.icon"
          :external="link.type === 'external'"
          @click="handleLinkClick(link)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FooterLink from '@/shared/ui/FooterLink/'
import { LINK_TYPES } from '../../model/types'

interface FooterLinkType {
  id: string
  text: string
  to: string
  type: string
  requiresAuth: boolean
  requiresGuest?: boolean
  action?: string
  icon?: string
}

interface FooterGroupType {
  id: string
  title: string
  links: FooterLinkType[]
}

const props = defineProps<{
  group: FooterGroupType
  isAuthenticated?: boolean
}>()

const emit = defineEmits<{
  linkAction: [action: string, link: FooterLinkType]
}>()

const visibleLinks = computed(() => {
  return props.group.links.filter(link => {
    if (link.requiresAuth && !props.isAuthenticated) {
      return false
    }
    
    if (link.requiresGuest && props.isAuthenticated) {
      return false
    }
    
    return true
  })
})

function handleLinkClick(link: FooterLinkType): void {
  if (link.type === LINK_TYPES.ACTION && link.action) {
    emit('linkAction', link.action, link)
  }
}
</script>

<style module src="./styles.module.scss" />