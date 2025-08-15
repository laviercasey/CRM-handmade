<template>
  <component 
    :is="linkComponent"
    :to="isRouterLink ? to : undefined"
    :href="isExternalLink ? to : undefined"
    :target="isExternalLink ? '_blank' : undefined"
    :rel="isExternalLink ? 'noopener noreferrer' : undefined"
    :class="[$style.link, $style[variant]]"
    @click="handleClick"
  >
    <i v-if="icon" :class="[icon, $style.icon]"></i>
    <slot>{{ text }}</slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type LinkVariant = 'default' | 'contact' | 'social';
type LinkComponent = 'router-link' | 'a' | 'button';

interface AppLinkProps {
  to: string;
  text?: string;
  icon?: string;
  variant?: LinkVariant;
  external?: boolean;
}

const props = withDefaults(defineProps<AppLinkProps>(), {
  text: '',
  icon: '',
  variant: 'default',
  external: false
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const isExternalLink = computed((): boolean => {
  return props.external || props.to.startsWith('http') || props.to.startsWith('mailto:');
});

const isRouterLink = computed((): boolean => {
  return !isExternalLink.value && props.to.startsWith('/');
});

const linkComponent = computed((): LinkComponent => {
  if (isRouterLink.value) return 'router-link';
  if (isExternalLink.value) return 'a';
  return 'button';
});

function handleClick(event: MouseEvent): void {
  if (!isRouterLink.value && !isExternalLink.value) {
    event.preventDefault();
  }
  emit('click', event);
}
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>