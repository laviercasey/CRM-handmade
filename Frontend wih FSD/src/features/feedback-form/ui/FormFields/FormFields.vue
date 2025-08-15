<template>
  <div>
    <FormGroup 
      v-if="!isAuthenticated"
      label="Ваше имя"
      fieldId="feedback-name"
      :required="true"
      :error="errors.name"
      hint="Как к вам обращаться?"
    >
      <Input
        id="feedback-name"
        v-model="formData.name"
        :placeholder="nameConfig.placeholder"
        :required="true"
        :disabled="disabled"
        :hasError="!!errors.name"
      />
    </FormGroup>
    
    <FormGroup 
      label="Сообщение"
      fieldId="feedback-message"
      :required="true"
      :error="errors.message"
      :hint="`${messageLength}/${messageConfig.maxLength} символов`"
    >
      <Textarea
        id="feedback-message"
        v-model="formData.message"
        :placeholder="messageConfig.placeholder"
        :required="true"
        :disabled="disabled"
        :hasError="!!errors.message"
        :rows="5"
      />
    </FormGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FormGroup from '@/shared/ui/FormGroup/'
import Input from '@/shared/ui/Input/'
import Textarea from '@/shared/ui/Textarea/'
import { FEEDBACK_FORM_CONFIG } from '@/entities/feedback/model/types'

interface FormData {
  name: string
  message: string
}

const props = defineProps<{
  formData: FormData
  errors?: Record<string, string>
  isAuthenticated?: boolean
  disabled?: boolean
}>()

const nameConfig = FEEDBACK_FORM_CONFIG.name
const messageConfig = FEEDBACK_FORM_CONFIG.message

const messageLength = computed(() => {
  return props.formData.message ? props.formData.message.length : 0
})
</script>