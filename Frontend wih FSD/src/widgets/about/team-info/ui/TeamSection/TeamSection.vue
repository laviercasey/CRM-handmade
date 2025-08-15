<template>
  <div :class="$style.teamGrid">
    <FounderCard :founder="founder" />
    <TeamMembersList />
  </div>
</template>

<script setup lang="ts">
import FounderCard from '@/entities/team-member/ui/FounderCard/'
import TeamMembersList from '@/entities/team-member/ui/TeamMembersList/'
import { founder } from '@/entities/team-member/model/team-members'
</script>

<style module src="./styles.module.scss" />