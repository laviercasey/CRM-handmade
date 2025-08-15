<template>
  <section :class="$style.teamInfo">
    <Container>
      <h2 :class="$style.title">Наша команда</h2>
      <p :class="$style.subtitle">
        Познакомьтесь с людьми, которые создали ТвойCRM для вас
      </p>
      
      <TeamSection />
      
      <JoinTeamSection />
      
      <ValuesSection />
    </Container>
  </section>
</template>

<script setup lang="ts">
import Container from '@/shared/ui/Container/'
import TeamSection from '../TeamSection/'
import JoinTeamSection from '../JoinTeamSection/'
import ValuesSection from '../ValuesSection/'
</script>

<style module src="./styles.module.scss" />