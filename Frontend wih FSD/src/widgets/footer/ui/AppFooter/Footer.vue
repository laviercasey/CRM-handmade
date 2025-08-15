<template>
  <footer :class="$style.footer">
    <Container>
      <FooterMain />
      <FooterBottom />
    </Container>
  </footer>
</template>

<script setup lang="ts">
import Container from '@/shared/ui/Container/';
import FooterMain from '../FooterMain/';
import FooterBottom from '../FooterBottom/';
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>