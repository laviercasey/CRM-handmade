<template>
  <div :class="$style.founder">
    <div :class="$style.photo">
      <img 
        :src="founder.photo" 
        :alt="founder.name"
        @error="handleImageError"
      >
    </div>
    <div :class="$style.info">
      <h3 :class="$style.name">{{ founder.name }}</h3>
      <div :class="$style.role">{{ founder.role }}</div>
      <p :class="$style.description">{{ founder.description }}</p>
      
      <div :class="$style.social">
        <SocialLink
          v-for="social in founder.social"
          :key="social.icon"
          :href="social.href"
          :icon="social.icon"
        />
      </div>
      
      <div :class="$style.quote">
        <i class="fas fa-quote-left"></i>
        <p>{{ founder.quote }}</p>
      </div>
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

interface Founder {
  id: string
  name: string
  role: string
  photo: string
  description: string
  social: SocialLinkType[]
  quote: string
}

defineProps<{
  founder: Founder
}>()
</script>

<style module src="./styles.module.scss" />