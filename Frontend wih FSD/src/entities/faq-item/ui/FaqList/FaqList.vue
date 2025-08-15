<template>
  <div :class="$style.list">
    <FaqItem 
      v-for="(item, index) in items" 
      :key="item.id"
      :item="item"
      :isOpen="activeIndex === index"
      @toggle="toggleItem(index)"
      @feedback="$emit('feedback', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FaqItem from '../FaqItem/'

interface FaqLink {
  text: string
  url: string
}

interface FaqItemType {
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

defineProps<{
  items: FaqItemType[]
}>()

defineEmits<{
  feedback: [event: FeedbackEvent]
}>()

const activeIndex = ref<number | null>(null)

function toggleItem(index: number): void {
  if (activeIndex.value === index) {
    activeIndex.value = null
    return
  }

  activeIndex.value = index
}
</script>

<style module src="./styles.module.scss" />