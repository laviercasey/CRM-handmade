<template>
  <form @submit.prevent="submitForm" :class="$style.form">
    <FormFields
      :formData="formData"
      :errors="errors"
      :isAuthenticated="isAuthenticated"
      :disabled="isSubmitting"
    />
    
    <div :class="$style.actions">
      <Button 
        type="submit" 
        variant="primary"
        :disabled="!canSubmit"
        :class="$style.submitButton"
      >
        {{ isSubmitting ? FEEDBACK_MESSAGES.submitting : FEEDBACK_MESSAGES.submitButton }}
      </Button>
      
      <Button 
        v-if="hasChanges"
        type="button" 
        variant="secondary"
        :disabled="isSubmitting"
        @click="resetForm"
        :class="$style.resetButton"
      >
        Очистить
      </Button>
    </div>
    
    <SuccessMessage
      :show="showSuccess"
      :message="FEEDBACK_MESSAGES.success"
      variant="success"
      :closable="true"
      @close="showSuccess = false"
    />
    
    <SuccessMessage
      v-if="submitError"
      :show="!!submitError"
      :message="submitError"
      variant="error"
      :closable="true"
      @close="submitError = ''"
    />
  </form>
</template>

<script setup lang="ts">
import Button from '@/shared/ui/Button/'
import SuccessMessage from '@/shared/ui/SuccessMessage/'
import FormFields from '../FormFields/'
import { useFeedbackForm } from '../../model/use-feedback-form'
import { FEEDBACK_MESSAGES } from '@/entities/feedback/model/types'

const {
  formData,
  errors,
  isSubmitting,
  showSuccess,
  submitError,
  isAuthenticated,
  isFormValid,
  hasChanges,
  canSubmit,
  resetForm,
  submitForm
} = useFeedbackForm()
</script>

<style module src="./styles.module.scss" />