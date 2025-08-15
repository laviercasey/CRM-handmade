<template>
  <p :class="$style.copyright">
    &copy; {{ copyrightYear }} {{ companyName }}. {{ rightsText }}
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getCurrentYear, getCopyrightYears } from '@/shared/utils/date'
import { legalConfig } from '../../model/config'

const copyrightYear = computed(() => {
  return getCopyrightYears(legalConfig.foundedYear, getCurrentYear())
})

const companyName = computed(() => legalConfig.companyName)
const rightsText = computed(() => legalConfig.rightsText)
</script>

<style module src="./styles.module.scss" />