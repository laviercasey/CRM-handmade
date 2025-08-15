<template>
  <section :class="$style.cta">
    <Container>
      <div :class="$style.content">
        <h2>Готовы упростить свой бизнес?</h2>
        <p>Присоединяйтесь к ТвойCRM уже сегодня и сфокусируйтесь на том, что действительно важно — на творчестве!</p>
        <div :class="$style.buttons">
          <Button variant="primary" @click="$emit('showRegistration')">
            Начать бесплатно
          </Button>
          <Button variant="secondary" @click="$emit('scrollToFeatures')">
            Узнать больше
          </Button>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup lang="ts">
import Container from '@/shared/ui/Container/';
import Button from '@/shared/ui/Button/';

defineEmits<{
  (e: 'showRegistration'): void;
  (e: 'scrollToFeatures'): void;
}>();
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>