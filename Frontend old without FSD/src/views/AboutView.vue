<template>
  <div class="about-view">
    <ProjectInfo />
    <TeamInfo />
    <FaqSection id="faq" />
    <FeedbackForm id="feedback" />
  </div>
</template>

<script setup>
import ProjectInfo from '@/components/about/ProjectInfo.vue'
import TeamInfo from '@/components/about/TeamInfo.vue'
import FaqSection from '@/components/about/FaqSection.vue'
import FeedbackForm from '@/components/about/FeedbackForm.vue'
</script>
