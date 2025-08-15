<template>
  <div :class="$style.aboutView">
    <HeroSection />
    <FeaturesSection />
    <CtaSection 
      @show-registration="handleShowRegistration"
      @scroll-to-features="handleScrollToFeatures"
    />
    <HowItWorksSection />
    <TestimonialsSection />
    <TeamInfo />
    <FaqSection id="faq" />
    <FeedbackForm id="feedback" />
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import HeroSection from '@/widgets/about/project-info/ui/HeroSection/'
import FeaturesSection from '@/widgets/about/project-info/ui/FeaturesSection/'
import CtaSection from '@/widgets/about/project-info/ui/CtaSection/'
import HowItWorksSection from '@/widgets/about/project-info/ui/HowItWorksSection/'
import TestimonialsSection from '@/widgets/about/project-info/ui/TestimonialsSection/'
import { scrollToElement } from '@/shared/utils/dom'
import TeamInfo from '@/widgets/about/team-info/ui/TeamInfo/'
import FaqSection from '@/widgets/about/faq-section/ui/'
import FeedbackForm from '@/widgets/about/feedback-section/ui/FeedbackSection/'

const store = useStore()

function handleScrollToFeatures(): void {
  scrollToElement('how-it-works')
}

function handleShowRegistration(): void {
  store.commit('auth/SET_SHOW_REGISTER_MODAL', true)
}
</script>

<style module src="./styles.module.scss" />