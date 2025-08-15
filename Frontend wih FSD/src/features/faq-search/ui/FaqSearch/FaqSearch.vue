<template>
  <div>
    <CategoryFilter
      :categories="categories"
      :activeCategory="activeCategory"
      @update:activeCategory="setActiveCategory"
      :disabled="isLoading"
    />
    
    <SearchInput
      v-model="searchQuery"
      placeholder="Поиск по вопросам..."
      @keyup.enter="handleSearch"
      :disabled="isLoading"
    />
    
    <div v-if="isLoading" :class="$style.loading">
      <i class="fas fa-spinner fa-spin"></i>
      Загрузка...
    </div>
    
    <div v-else-if="error" :class="$style.error">
      <i class="fas fa-exclamation-triangle"></i>
      {{ error }}
    </div>
    
    <FaqList
      v-else-if="filteredItems.length > 0"
      :items="filteredItems"
      @feedback="$emit('feedback', $event)"
    />
    
    <NoResults v-else />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import CategoryFilter from '@/shared/ui/CategoryFilter/';
import SearchInput from '@/shared/ui/SearchInput/';
import FaqList from '@/entities/faq-item/ui/FaqList/';
import NoResults from '../NoResults/';
import { useFaqSearch } from '../../model/use-faq-search';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
  category_id?: number;
  [key: string]: any;
}

interface Category {
  id: string | number;
  name: string;
  [key: string]: any;
}

interface FeedbackEvent {
  itemId: number;
  isHelpful: boolean;
}

interface FaqSearchProps {
  faqItems: FaqItem[];
  categories: Category[];
}

const props = defineProps<FaqSearchProps>();

defineEmits<{
  (e: 'feedback', event: FeedbackEvent): void;
}>();

const {
  searchQuery,
  activeCategory,
  filteredItems,
  isLoading,
  error,
  setActiveCategory,
  searchFaq
} = useFaqSearch(props.faqItems);

function handleSearch(): void {
  if (searchQuery.value.trim()) {
    searchFaq(searchQuery.value);
  }
}

let searchTimeout: ReturnType<typeof setTimeout>;
watch(() => searchQuery.value, (newQuery: string) => {
  clearTimeout(searchTimeout);
  if (newQuery.trim()) {
    searchTimeout = setTimeout(() => {
      searchFaq(newQuery);
    }, 500);
  }
});
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>