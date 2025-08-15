<template>
  <div :class="[$style.avatar, $style[size]]">
    <img 
      v-if="src && !imageError" 
      :src="src" 
      :alt="alt"
      :class="$style.image"
      @error="handleImageError"
    />
    <span v-else :class="$style.initials">
      {{ initials }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type AvatarSize = 'small' | 'medium' | 'large';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
}

const props = withDefaults(defineProps<AvatarProps>(), {
  src: '',
  alt: 'Avatar',
  initials: '?',
  size: 'medium'
});

const imageError = ref(false);

function handleImageError(): void {
  imageError.value = true;
}
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>