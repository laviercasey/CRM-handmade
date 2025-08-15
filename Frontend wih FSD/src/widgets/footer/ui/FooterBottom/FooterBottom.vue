<template>
  <div :class="$style.footerBottom">
    <Copyright />
    <LegalLinks />
  </div>
</template>

<script setup lang="ts">
import Copyright from '@/features/footer-legal/ui/Copyright/';
import LegalLinks from '@/features/footer-legal/ui/LegalLinks/';
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>