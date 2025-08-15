<template>
  <Teleport :to="teleportTarget">
    <Transition name="modal">
      <div 
        v-if="show"
        :class="$style.overlay"
        @click="handleOverlayClick"
        @keydown.esc="handleEscapeKey"
        tabindex="-1"
      >
        <div :class="$style.modalContainer" @click.stop>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue';

interface ModalProps {
  show?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const props = withDefaults(defineProps<ModalProps>(), {
  show: false,
  closeOnOverlayClick: true,
  closeOnEscape: true
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const teleportTarget = computed((): string => {
  return 'body';
});

watch(() => props.show, (newValue: boolean) => {
  if (newValue) {
    lockBodyScroll();
  } else {
    unlockBodyScroll();
  }
});

function handleOverlayClick(): void {
  if (props.closeOnOverlayClick) {
    emit('close');
  }
}

function handleEscapeKey(): void {
  if (props.closeOnEscape) {
    emit('close');
  }
}

function lockBodyScroll(): void {
  const scrollbarWidth = getScrollbarWidth();
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = scrollbarWidth + 'px';
}

function unlockBodyScroll(): void {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

function getScrollbarWidth(): number {
  return window.innerWidth - document.documentElement.clientWidth;
}

onMounted(() => {
  if (props.show) {
    lockBodyScroll();
  }
});

onUnmounted(() => {
  unlockBodyScroll();
});
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>