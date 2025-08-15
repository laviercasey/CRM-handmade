<template>
  <div :class="$style.noResults">
    <div :class="$style.icon">
      <i class="fas fa-search"></i>
    </div>
    <h3 :class="$style.title">Ничего не найдено</h3>
    <p :class="$style.description">
      Попробуйте изменить поисковый запрос или выбрать другую категорию
    </p>
  </div>
</template>


<style module lang="scss">
@use './styles.module.scss';
</style>