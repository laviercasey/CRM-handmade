<template>
  <div :class="$style.contact">
    <h3 :class="$style.title">{{ config.title }}</h3>
    <ContactInfo />
    <SocialLinksList />
  </div>
</template>

<script setup lang="ts">
import ContactInfo from '../ContactInfo/'
import SocialLinksList from '@/entities/social-link/ui/SocialLinksList/'
import { contactConfig } from '../../model/config'

const config = contactConfig
</script>

<style module src="./styles.module.scss" />