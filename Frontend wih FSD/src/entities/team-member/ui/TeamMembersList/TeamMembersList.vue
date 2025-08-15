<template>
  <div :class="$style.grid">
    <TeamMemberCard 
      v-for="member in teamMembers" 
      :key="member.id"
      :member="member"
    />
  </div>
</template>

<script setup lang="ts">
import TeamMemberCard from '../TeamMemberCard/';
import { teamMembers } from '../../model/team-members';
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>