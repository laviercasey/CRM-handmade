<template>
  <section :class="$style.hero">
    <Container>
      <h1 :class="$style.title">ТвойCRM</h1>
      <p :class="$style.slogan">Управляйте заказами и товарами легко и эффективно</p>
      
      <div :class="$style.goal">
        <p>Наша цель — сделать работу хендмейдеров проще и продуктивнее</p>
      </div>
      
      <div :class="$style.image">
        <img src="@/shared/assets/images/creative-craft.jpg" alt="Творческий процесс">
      </div>
    </Container>
  </section>
</template>

<script setup lang="ts">
import Container from '@/shared/ui/Container/index.vue';
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>