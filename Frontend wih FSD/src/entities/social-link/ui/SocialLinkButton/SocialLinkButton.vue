<template>
  <a 
    :href="link.url"
    :title="link.name"
    :class="$style.socialLink"
    :style="hoverStyle"
    target="_blank"
    rel="noopener noreferrer"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <i :class="link.icon"></i>
  </a>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface SocialLinkType {
  id: string
  name: string
  icon: string
  url: string
  color?: string
}

const props = defineProps<{
  link: SocialLinkType
}>()

const isHovered = ref<boolean>(false)

const hoverStyle = computed(() => {
  if (isHovered.value && props.link.color) {
    return {
      backgroundColor: props.link.color,
      color: 'white'
    }
  }
  return {}
})
</script>

<style module src="./styles.module.scss" />