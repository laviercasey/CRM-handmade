import { ref, computed, Ref, ComputedRef } from 'vue';
import { searchInText, stripHtml } from '@/shared/utils/string';
import FeedbackService from '@/shared/api/feedback.service';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
  category_id?: number;
  [key: string]: any;
}

export function useFaqSearch(initialFaqItems: FaqItem[] = []) {
  const searchQuery: Ref<string> = ref('');
  const activeCategory: Ref<string> = ref('all');
  const faqItems: Ref<FaqItem[]> = ref(initialFaqItems);
  const isLoading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  const filteredItems: ComputedRef<FaqItem[]> = computed(() => {
    let result = faqItems.value;
    
    if (activeCategory.value !== 'all') {
      result = result.filter(item => item.category === activeCategory.value);
    }
    
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.trim();
      result = result.filter(item => 
        searchInText(item.question, query) || 
        searchInText(stripHtml(item.answer), query)
      );
    }
    
    return result;
  });

  async function searchFaq(query: string): Promise<void> {
    if (!query.trim()) {
      searchQuery.value = '';
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      
      const results = await FeedbackService.searchFaq(query);
      faqItems.value = results;
      searchQuery.value = query;
    } catch (err) {
      console.error('Error searching FAQ:', err);
      error.value = 'Ошибка поиска. Попробуйте позже.';
    } finally {
      isLoading.value = false;
    }
  }

  async function loadFaqByCategory(categoryId: string): Promise<void> {
    try {
      isLoading.value = true;
      error.value = null;
      
      if (categoryId === 'all') {
        faqItems.value = initialFaqItems;
      } else {
        const results = await FeedbackService.getFaqByCategory(categoryId);
        faqItems.value = results;
      }
      
      activeCategory.value = categoryId;
    } catch (err) {
      console.error('Error loading FAQ by category:', err);
      error.value = 'Ошибка загрузки. Попробуйте позже.';
    } finally {
      isLoading.value = false;
    }
  }

  function setSearchQuery(query: string): void {
    searchQuery.value = query;
  }

  function setActiveCategory(categoryId: string): void {
    if (categoryId !== activeCategory.value) {
      loadFaqByCategory(categoryId);
    }
  }

  function clearSearch(): void {
    searchQuery.value = '';
  }

  return {
    searchQuery,
    activeCategory,
    faqItems,
    filteredItems,
    isLoading,
    error,
    setSearchQuery,
    setActiveCategory,
    clearSearch,
    searchFaq,
    loadFaqByCategory
  };
}