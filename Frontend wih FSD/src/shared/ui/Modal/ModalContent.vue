<template>
  <div :class="$style.modal" @click.stop>
    <div :class="[$style.content, $style[size]]">
      <div v-if="showHeader" :class="$style.header">
        <h2 v-if="title" :class="$style.title">{{ title }}</h2>
        <slot name="header" />
        <button 
          v-if="closable"
          :class="$style.closeButton"
          @click="$emit('close')"
          aria-label="Закрыть"
        >
          &times;
        </button>
      </div>
      
      <div :class="$style.body">
        <slot />
      </div>
      
      <div v-if="$slots.footer" :class="$style.footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

interface ModalContentProps {
  title?: string;
  size?: ModalSize;
  closable?: boolean;
  showHeader?: boolean;
}

const props = withDefaults(defineProps<ModalContentProps>(), {
  title: '',
  size: 'medium',
  closable: true,
  showHeader: true
});

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>