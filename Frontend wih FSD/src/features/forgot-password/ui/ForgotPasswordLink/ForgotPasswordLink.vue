<template>
  <button 
    :class="$style.forgotLink"
    @click="handleClick"
  >
    Забыли пароль?
  </button>
</template>

<script setup lang="ts">
import { useForgotPassword } from '../../model/use-forgot-password'

const emit = defineEmits<{
  click: []
}>()

const { handleForgotPassword } = useForgotPassword()

function handleClick(): void {
  handleForgotPassword()
  emit('click')
}
</script>

<style module src="./styles.module.scss" />