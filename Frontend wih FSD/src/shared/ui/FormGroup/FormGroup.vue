<template>
  <div :class="$style.group">
    <label 
      v-if="label" 
      :for="fieldId"
      :class="[$style.label, { [$style.required]: required }]"
    >
      {{ label }}
    </label>
    
    <slot />
    
    <div v-if="error" :class="$style.error">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>
    
    <div v-if="hint && !error" :class="$style.hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormGroupProps {
  label?: string;
  fieldId?: string;
  required?: boolean;
  error?: string;
  hint?: string;
}

const props = withDefaults(defineProps<FormGroupProps>(), {
  label: '',
  fieldId: '',
  required: false,
  error: '',
  hint: ''
});
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>