<template>
  <div :class="$style.item">
    <div 
      :class="[$style.question, { [$style.active]: isOpen }]"
      @click="$emit('toggle')"
    >
      <span>{{ item.question }}</span>
      <i 
        class="fas" 
        :class="isOpen ? 'fa-chevron-up' : 'fa-chevron-down'"
        :style="{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }"
      ></i>
    </div>
    
    <div 
      :class="[$style.answer, { [$style.active]: isOpen }]"
      :style="{ maxHeight: isOpen ? maxHeight + 'px' : '0' }"
    >
      <div :class="$style.content" ref="answerContent">
        <div v-html="formattedAnswer"></div>
        
        <div v-if="item.links && item.links.length > 0" :class="$style.links">
          <div :class="$style.linksTitle">Полезные ссылки:</div>
          <ul :class="$style.linksList">
            <li v-for="(link, linkIndex) in item.links" :key="linkIndex">
              <a :href="link.url" target="_blank" rel="noopener">{{ link.text }}</a>
            </li>
          </ul>
        </div>
        
        <FeedbackButtons @feedback="handleFeedback" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import FeedbackButtons from '../FeedbackButtons/'
import { formatAnswer } from '@/shared/utils/string'

interface FaqLink {
  text: string
  url: string
}

interface FaqItem {
  id: number
  question: string
  answer: string
  category: string
  links?: FaqLink[]
}

interface FeedbackEvent {
  itemId: number
  isHelpful: boolean
}

const props = defineProps<{
  item: FaqItem
  isOpen?: boolean
}>()

const emit = defineEmits<{
  toggle: []
  feedback: [event: FeedbackEvent]
}>()

const answerContent = ref<HTMLElement | null>(null)
const maxHeight = ref<number>(0)

const formattedAnswer = computed(() => formatAnswer(props.item.answer))

function handleFeedback(isHelpful: boolean): void {
  emit('feedback', { itemId: props.item.id, isHelpful })
}

// Вычисляем высоту контента для анимации
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      if (answerContent.value) {
        maxHeight.value = answerContent.value.offsetHeight
      }
    })
  }
}, { immediate: true })
</script>

<style module src="./styles.module.scss" />