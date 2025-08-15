<template>
  <div :class="$style.member">
    <div :class="$style.photo">
      <img 
        :src="member.photo" 
        :alt="member.name"
        @error="handleImageError"
      >
    </div>
    <h3 :class="$style.name">{{ member.name }}</h3>
    <div :class="$style.role">{{ member.role }}</div>
    <p :class="$style.description">{{ member.description }}</p>
    
    <div :class="$style.social">
      <SocialLink
        v-for="social in member.social"
        :key="social.icon"
        :href="social.href"
        :icon="social.icon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SocialLink from '@/shared/ui/SocialLink/'
import { handleImageError } from '@/shared/utils/dom'

interface SocialLinkType {
  href: string
  icon: string
}

interface TeamMember {
  id: number
  name: string
  role: string
  photo: string
  description: string
  social: SocialLinkType[]
}

defineProps<{
  member: TeamMember
}>()
</script>

<style module src="./styles.module.scss" />