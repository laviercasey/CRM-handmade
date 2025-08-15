<template>
  <div :class="$style.joinTeam">
    <h3 :class="$style.title">Присоединяйтесь к нашей команде</h3>
    <p :class="$style.description">
      Мы всегда ищем талантливых и увлеченных людей, которые хотят помогать творческому сообществу
    </p>
    <Button 
      variant="primary"
      :class="$style.button"
      @click="handleEmailClick"
    >
      Отправить резюме
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '@/shared/ui/Button/'
import { openEmailClient } from '@/shared/utils/dom'

function handleEmailClick(): void {
  openEmailClient(
    'careers@tvoycrm.ru',
    'Резюме для работы в ТвойCRM',
    'Здравствуйте! Прикладываю свое резюме для рассмотрения.'
  )
}
</script>

<style module src="./styles.module.scss" />