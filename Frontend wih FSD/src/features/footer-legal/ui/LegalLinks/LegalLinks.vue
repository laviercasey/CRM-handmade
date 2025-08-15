<template>
  <div :class="$style.legalLinks">
    <FooterLink
      v-for="link in legalLinks"
      :key="link.id"
      :to="link.to"
      :text="link.text"
      @click="handleLegalClick(link)"
    />
  </div>
</template>

<script setup lang="ts">
import FooterLink from '@/shared/ui/FooterLink/'
import { legalLinks } from '@/entities/footer-link/model/footer-links'
import { useLegalActions } from '../../model/use-legal-actions'

interface LegalLink {
  id: string
  text: string
  to: string
  action?: string
}

const { handleLegalAction } = useLegalActions()

function handleLegalClick(link: LegalLink): void {
  if (link.action) {
    handleLegalAction(link.action)
  }
}
</script>

<style module src="./styles.module.scss" />