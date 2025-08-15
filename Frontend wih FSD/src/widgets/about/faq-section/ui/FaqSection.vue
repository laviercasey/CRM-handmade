<template>
  <section :class="$style.section">
    <Container>
      <h2 :class="$style.title">Часто задаваемые вопросы</h2>
      
      <div v-if="isLoadingInitial" :class="$style.loading">
        <i class="fas fa-spinner fa-spin"></i>
        Загрузка вопросов...
      </div>
      
      <div v-else-if="loadError" :class="$style.error">
        <i class="fas fa-exclamation-triangle"></i>
        {{ loadError }}
        <Button variant="secondary" @click="loadInitialData" :class="$style.retryButton">
          Попробовать снова
        </Button>
      </div>
      
      <template v-else>
        <FaqSearch
          :faqItems="faqData"
          :categories="categories"
          @feedback="handleFeedback"
        />
        
        <FaqFooter />
      </template>
    </Container>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Container from '@/shared/ui/Container/';
import Button from '@/shared/ui/Button/';
import FaqSearch from '@/features/faq-search/ui/FaqSearch/';
import FaqFooter from '@/features/faq-feedback/ui/FaqFooter/';
import FeedbackService from '@/shared/api/feedback.service';
import { useFaqSection } from '../model/use-faq-section';

// Fallback данные на случай если API недоступен
import { faqData as fallbackFaqData } from '@/entities/faq-item/model/faq-data';
import { faqCategories as fallbackCategories } from '@/entities/faq-item/model/faq-categories';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category_id: number;
  [key: string]: any;
}

interface FaqCategory {
  id: number;
  name: string;
  description?: string;
  [key: string]: any;
}

interface FeedbackParams {
  itemId: number;
  isHelpful: boolean;
}

const { handleFeedback } = useFaqSection();

const faqData = ref<FaqItem[]>([]);
const categories = ref<FaqCategory[]>([]);
const isLoadingInitial = ref<boolean>(true);
const loadError = ref<string | null>(null);

async function loadInitialData(): Promise<void> {
  try {
    isLoadingInitial.value = true;
    loadError.value = null;

    // Загружаем категории и FAQ параллельно
    const [categoriesData, faqDataResponse] = await Promise.all([
      FeedbackService.getFaqCategories().catch(() => fallbackCategories),
      // Пока нет метода для получения всех FAQ, используем fallback
      Promise.resolve(fallbackFaqData)
    ]);

    categories.value = categoriesData;
    faqData.value = faqDataResponse;
  } catch (error) {
    console.error('Error loading initial FAQ data:', error);
    loadError.value = 'Не удалось загрузить данные. Проверьте подключение к интернету.';
    
    // Используем fallback данные
    categories.value = fallbackCategories;
    faqData.value = fallbackFaqData;
  } finally {
    isLoadingInitial.value = false;
  }
}

onMounted(() => {
  loadInitialData();
});
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>