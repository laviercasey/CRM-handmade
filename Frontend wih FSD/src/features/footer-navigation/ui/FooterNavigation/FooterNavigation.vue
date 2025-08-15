<template>
  <div :class="$style.navigation">
    <FooterLinkGroup
      v-for="group in footerLinkGroups"
      :key="group.id"
      :group="group"
      :isAuthenticated="isAuthenticated"
      @linkAction="handleLinkAction"
    />
  </div>
</template>

<script setup lang="ts">
import FooterLinkGroup from '@/entities/footer-link/ui/FooterLinkGroup/'
import { footerLinkGroups } from '@/entities/footer-link/model/footer-links'
import { useFooterNavigation } from '../../model/use-footer-navigation'

const props = defineProps<{
  isAuthenticated?: boolean
}>()

const { handleLinkAction } = useFooterNavigation()
</script>

<style module src="./styles.module.scss" />