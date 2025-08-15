<template>
  <div :class="$style.dropdown" @click.stop>
    <div 
      :class="$style.trigger"
      @click="toggle"
    >
      <slot name="trigger" :isOpen="isOpen" />
    </div>
    
    <div 
      v-if="isOpen"
      :class="[$style.menu, $style[position]]"
      @click.stop
    >
      <slot name="menu" :close="close" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

type DropdownPosition = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

interface DropdownProps {
  position?: DropdownPosition;
}

const props = withDefaults(defineProps<DropdownProps>(), {
  position: 'bottomRight'
});

const isOpen = ref(false);

function toggle(): void {
  isOpen.value = !isOpen.value;
}

function close(): void {
  isOpen.value = false;
}

function handleClickOutside(event: MouseEvent): void {
  if (!(event.target as HTMLElement).closest('[data-dropdown]')) {
    close();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>