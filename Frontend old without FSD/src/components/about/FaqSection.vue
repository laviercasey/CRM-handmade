<template>
  <section class="faq-section">
    <div class="container">
      <h2>Часто задаваемые вопросы</h2>
      
      <div class="faq-categories">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-button', { active: activeCategory === category.id }]"
          @click="activeCategory = category.id"
        >
          <i :class="category.icon"></i>
          {{ category.name }}
        </button>
      </div>
      
      <div class="faq-search">
        <div class="search-input-wrapper">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск по вопросам..."
            class="search-input"
          >
          <button 
            v-if="searchQuery" 
            class="clear-search"
            @click="searchQuery = ''"
          >
            &times;
          </button>
        </div>
      </div>
      
      <div class="faq-list">
        <div 
          v-for="(item, index) in filteredFaqItems" 
          :key="index"
          class="faq-item"
        >
          <div 
            class="faq-question" 
            :class="{ active: activeIndex === index }"
            @click="toggleItem(index)"
          >
            <span>{{ item.question }}</span>
            <i class="fas" :class="activeIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </div>
          
          <div 
            class="faq-answer"
            :class="{ active: activeIndex === index }"
            :style="{ maxHeight: activeIndex === index ? answerHeight + 'px' : '0' }"
          >
            <div class="answer-content" ref="answerContent">
              <div v-html="formatAnswer(item.answer)"></div>
              
              <div v-if="item.links && item.links.length > 0" class="answer-links">
                <div class="links-title">Полезные ссылки:</div>
                <ul class="links-list">
                  <li v-for="(link, linkIndex) in item.links" :key="linkIndex">
                    <a :href="link.url" target="_blank" rel="noopener">{{ link.text }}</a>
                  </li>
                </ul>
              </div>
              
              <div class="answer-feedback">
                <div class="feedback-question">Был ли этот ответ полезным?</div>
                <div class="feedback-buttons">
                  <button 
                    class="feedback-button"
                    @click="submitFeedback(index, true)"
                  >
                    <i class="far fa-thumbs-up"></i> Да
                  </button>
                  <button 
                    class="feedback-button"
                    @click="submitFeedback(index, false)"
                  >
                    <i class="far fa-thumbs-down"></i> Нет
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="filteredFaqItems.length === 0" class="no-results">
        <div class="no-results-icon">
          <i class="fas fa-search"></i>
        </div>
        <h3>Ничего не найдено</h3>
        <p>Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
      </div>
      
      <div class="faq-footer">
        <p>Не нашли ответ на свой вопрос?</p>
        <button class="btn-primary" @click="scrollToFeedback">Задать вопрос</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const activeIndex = ref(null)
const answerHeight = ref(0)
const searchQuery = ref('')
const activeCategory = ref('all')
const answerContent = ref(null)

const categories = [
  { id: 'all', name: 'Все вопросы', icon: 'fas fa-border-all' },
  { id: 'general', name: 'Общие вопросы', icon: 'fas fa-info-circle' },
  { id: 'account', name: 'Аккаунт', icon: 'fas fa-user' },
  { id: 'orders', name: 'Заказы', icon: 'fas fa-clipboard-list' },
  { id: 'products', name: 'Товары', icon: 'fas fa-box' }
]

const faqItems = [
  {
    question: 'Что такое ТвойCRM?',
    answer: 'ТвойCRM — это платформа, разработанная специально для хендмейдеров и творческих людей, которые создают свой товар. Она помогает упростить управление заказами, товарами и клиентами.',
    category: 'general'
  },
  {
    question: 'Как зарегистрироваться на платформе?',
    answer: 'Для регистрации нажмите кнопку "Регистрация" в верхнем правом углу сайта. Заполните необходимые поля: логин, email и пароль. После регистрации вы сможете войти в свой личный кабинет.',
    category: 'account'
  },
  {
    question: 'Является ли сервис бесплатным?',
    answer: 'На данный момент сервис находится в стадии MVP (минимально жизнеспособный продукт) и предоставляется бесплатно. В будущем планируется введение платных тарифов с расширенным функционалом, но базовые возможности останутся доступными бесплатно.',
    category: 'general',
    links: [
      { text: 'Подробнее о тарифах', url: '#' }
    ]
  },
  {
    question: 'Как добавить товар в каталог?',
    answer: 'В личном кабинете выберите вкладку "Товары" и нажмите кнопку "+" в правом нижнем углу. Заполните информацию о товаре: название, описание, цену и добавьте фотографию. После сохранения товар появится в вашем каталоге.',
    category: 'products'
  },
  {
    question: 'Как клиенты могут оформить заказ?',
    answer: 'У вас есть уникальная ссылка на форму заказа, которую вы можете разместить в социальных сетях или отправить клиентам напрямую. Клиенты заполняют форму, выбирают товары и отправляют заявку, которая появится в вашем личном кабинете.',
    category: 'orders'
  },
  {
    question: 'Можно ли изменить статус заказа?',
    answer: 'Да, в личном кабинете во вкладке "Заявки" вы можете изменить статус любого заказа. Доступны статусы: "Ожидает", "Принята", "Отклонена".',
    category: 'orders'
  },
  {
    question: 'Что означают разные статусы заказов?',
    answer: '<ul><li><strong>Ожидает</strong> — новая заявка, требующая вашего внимания.</li><li><strong>Принята</strong> — вы приняли заказ и работаете над ним.</li><li><strong>Отклонена</strong> — вы отклонили заказ по какой-либо причине.</li></ul>',
    category: 'orders'
  },
  {
    question: 'Как связаться с технической поддержкой?',
    answer: 'Вы можете оставить сообщение в разделе "Обратная связь" на странице "О проекте" или написать напрямую на email: support@tvoycrm.ru.',
    category: 'general'
  },
  {
    question: 'Как рассчитать стоимость изделия?',
    answer: 'В личном кабинете перейдите во вкладку "Расчеты". Там вы найдете калькулятор стоимости изделия, который поможет учесть все затраты: материалы, время работы, дополнительные расходы и наценку.',
    category: 'products',
    links: [
      { text: 'Перейти к калькулятору', url: '/dashboard/calculations' }
    ]
  },
  {
    question: 'Как изменить данные профиля?',
    answer: 'В личном кабинете выберите вкладку "Профиль". Там вы можете изменить свои личные данные, контактную информацию и пароль.',
    category: 'account'
  },
  {
    question: 'Можно ли импортировать товары из других систем?',
    answer: 'На данный момент функция импорта товаров находится в разработке. В будущих обновлениях будет добавлена возможность импорта из Excel, CSV файлов и популярных маркетплейсов.',
    category: 'products'
  }
]

const filteredFaqItems = computed(() => {
  let result = faqItems

  if (activeCategory.value !== 'all') {
    result = result.filter(item => item.category === activeCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.question.toLowerCase().includes(query) || 
      item.answer.toLowerCase().includes(query)
    )
  }
  
  return result
})

function toggleItem(index) {
  if (activeIndex.value === index) {
    activeIndex.value = null
    return
  }
  
  activeIndex.value = index
  
  nextTick(() => {
    if (answerContent.value && answerContent.value[index]) {
      answerHeight.value = answerContent.value[index].offsetHeight
    }
  })
}

function formatAnswer(answer) {
  if (answer.includes('<')) {
    return answer
  }
  
  return answer.replace(/\n/g, '<br>')
}

function scrollToFeedback() {
  const feedbackElement = document.querySelector('.feedback-section')
  if (feedbackElement) {
    feedbackElement.scrollIntoView({ behavior: 'smooth' })
  }
}

function submitFeedback(index, isHelpful) {
  console.log(`Feedback for question ${index}: ${isHelpful ? 'helpful' : 'not helpful'}`)
  
  // Показываем уведомление
  store.dispatch('notifications/showSuccess', {
    title: 'Спасибо за отзыв',
    message: 'Ваш отзыв поможет нам улучшить ответы на вопросы'
  })
}
</script>
  
  <style scoped>
  .faq-section {
    padding: 60px 0;
    background-color: #fff;
  }
  
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  h2 {
    margin-bottom: 40px;
    text-align: center;
    position: relative;
  }
  
  h2:after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background-color: #6c5ce7;
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .faq-categories {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .category-button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background-color: #f5f5f5;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .category-button.active {
    background-color: #6c5ce7;
    color: white;
    border-color: #6c5ce7;
  }
  
  .category-button i {
    font-size: 14px;
  }
  
  .faq-search {
    margin-bottom: 30px;
  }
  
  .search-input-wrapper {
    position: relative;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .search-input-wrapper i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 40px;
    border: 1px solid #ddd;
    border-radius: 30px;
    font-size: 16px;
    transition: border-color 0.3s;
  }
  
  .search-input:focus {
    border-color: #6c5ce7;
    outline: none;
  }
  
  .clear-search {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 18px;
    color: #666;
    cursor: pointer;
  }
  
  .faq-list {
    margin-bottom: 40px;
  }
  
  .faq-item {
    margin-bottom: 15px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .faq-question {
    padding: 20px;
    background-color: #f9f9f9;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    transition: background-color 0.3s;
  }
  
  .faq-question:hover {
    background-color: #f0f0f0;
  }
  
  .faq-question.active {
    background-color: #6c5ce7;
    color: white;
  }
  
  .faq-question i {
    transition: transform 0.3s;
  }
  
  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease;
    background-color: #fff;
  }
  
  .answer-content {
    padding: 20px;
    line-height: 1.6;
  }
  
  .answer-links {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }
  
  .links-title {
    font-weight: 500;
    margin-bottom: 10px;
  }
  
  .links-list {
    padding-left: 20px;
  }
  
  .links-list a {
    color: #6c5ce7;
    text-decoration: none;
  }
  
  .links-list a:hover {
    text-decoration: underline;
  }
  
  .answer-feedback {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    text-align: center;
  }
  
  .feedback-question {
    margin-bottom: 10px;
    color: #666;
  }
  
  .feedback-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
  }
  
  .feedback-button {
    padding: 8px 16px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .feedback-button:hover {
    background-color: #e9e9e9;
  }
  
  .no-results {
    text-align: center;
    padding: 40px 0;
  }
  
  .no-results-icon {
    font-size: 48px;
    color: #ddd;
    margin-bottom: 15px;
  }
  
  .faq-footer {
    text-align: center;
    margin-top: 30px;
  }
  
  .faq-footer p {
    margin-bottom: 15px;
    color: #666;
  }
  
  .btn-primary {
    background-color: #6c5ce7;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-primary:hover {
    background-color: #5649c0;
  }
  
  @media (max-width: 768px) {
    .faq-categories {
      flex-direction: column;
      align-items: stretch;
    }
    
    .feedback-buttons {
      flex-direction: column;
      gap: 10px;
    }
  }
  </style>
  