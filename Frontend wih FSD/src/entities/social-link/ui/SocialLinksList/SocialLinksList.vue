<template>
  <div :class="$style.socialLinks">
    <SocialLinkButton
      v-for="link in socialLinks"
      :key="link.id"
      :link="link"
    />
  </div>
</template>

<script setup lang="ts">
import SocialLinkButton from '../SocialLinkButton/'
import { socialLinks } from '../../model/social-links'
</script>

<style module src="./styles.module.scss" />