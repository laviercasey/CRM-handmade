<template>
  <div :class="$style.contactInfo">
    <FooterLink
      v-for="contact in contactLinks"
      :key="contact.id"
      :to="contact.url"
      :text="contact.text"
      :icon="contact.icon"
      variant="contact"
      :external="true"
    />
  </div>
</template>

<script setup lang="ts">
import FooterLink from '@/shared/ui/FooterLink/'
import { contactLinks } from '@/entities/social-link/model/social-links'
</script>

<style module src="./styles.module.scss" />