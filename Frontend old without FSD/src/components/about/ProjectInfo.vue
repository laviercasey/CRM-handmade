<template>
  <section class="project-info">
    <div class="hero-section">
      <div class="container">
        <h1 class="project-title">ТвойCRM</h1>
        <p class="project-slogan">Управляйте заказами и товарами легко и эффективно</p>
        
        <div class="project-goal">
          <p>Наша цель — сделать работу хендмейдеров проще и продуктивнее</p>
        </div>
        
        <div class="hero-image">
          <img src="@/assets/creative-craft.jpg" alt="Творческий процесс">
        </div>
      </div>
    </div>
    
    <div class="features-section">
      <div class="container">
        <h2 class="section-title">Возможности платформы</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-clipboard-list"></i>
            </div>
            <h3 class="feature-title">Управление заказами</h3>
            <p class="feature-description">
              Отслеживайте все заказы в одном месте, меняйте их статусы и храните историю взаимодействия с клиентами.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-box"></i>
            </div>
            <h3 class="feature-title">Каталог товаров</h3>
            <p class="feature-description">
              Создавайте карточки товаров с фотографиями, описаниями и ценами. Управляйте ассортиментом в удобном интерфейсе.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-calculator"></i>
            </div>
            <h3 class="feature-title">Калькулятор стоимости</h3>
            <p class="feature-description">
              Рассчитывайте себестоимость и итоговую цену изделий с учетом материалов, времени работы и наценки.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
            <h3 class="feature-title">Статистика и аналитика</h3>
            <p class="feature-description">
              Анализируйте свои продажи, отслеживайте популярные товары и оценивайте эффективность работы.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Готовы упростить свой бизнес?</h2>
          <p>Присоединяйтесь к ТвойCRM уже сегодня и сфокусируйтесь на том, что действительно важно — на творчестве!</p>
          <div class="cta-buttons">
            <button class="btn-primary" @click="showRegistration">Начать бесплатно</button>
            <button class="btn-secondary" @click="scrollToFeatures">Узнать больше</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="how-it-works-section" id="how-it-works">
      <div class="container">
        <h2 class="section-title">Как это работает</h2>
        
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Регистрация</h3>
              <p>Создайте аккаунт за несколько минут и получите доступ ко всем функциям платформы.</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Добавление товаров</h3>
              <p>Создайте карточки своих изделий с фотографиями, описаниями и ценами.</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Получение заказов</h3>
              <p>Поделитесь своей формой заказа с клиентами или добавляйте заказы самостоятельно.</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Управление и аналитика</h3>
              <p>Отслеживайте статусы заказов, анализируйте продажи и развивайте свой бизнес.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="testimonials-section">
      <div class="container">
        <h2 class="section-title">Отзывы наших пользователей</h2>
        
        <div class="testimonials-slider">
          <div class="testimonial">
            <div class="testimonial-content">
              <p>"ТвойCRM полностью изменил мой подход к управлению заказами. Теперь я трачу меньше времени на организацию и больше на творчество!"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img src="@/assets/testimonial-1.jpg" alt="Анна" @error="handleImageError">
              </div>
              <div class="author-info">
                <div class="author-name">Анна</div>
                <div class="author-profession">Мастер вязаных игрушек</div>
              </div>
            </div>
          </div>
          
          <div class="testimonial">
            <div class="testimonial-content">
              <p>"Калькулятор стоимости помог мне понять, какие изделия действительно выгодны, а какие я продавала себе в убыток. Очень ценная функция!"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img src="@/assets/testimonial-2.jpg" alt="Мария" @error="handleImageError">
              </div>
              <div class="author-info">
                <div class="author-name">Мария</div>
                <div class="author-profession">Керамист</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()

function scrollToFeatures() {
  document.getElementById('how-it-works').scrollIntoView({ 
    behavior: 'smooth' 
  })
}

function handleImageError(e) {
  e.target.src = require('@/assets/placeholder-image.png')
}

function showRegistration() {
  store.commit('auth/SET_SHOW_REGISTER_MODAL', true)
}
</script>

  <style scoped>
  .project-info {
    color: #333;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .hero-section {
    padding: 80px 0;
    background-color: #f9f7f4;
    text-align: center;
  }
  
  .project-title {
    font-size: 3rem;
    margin-bottom: 20px;
    color: #6c5ce7;
  }
  
  .project-slogan {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #555;
  }
  
  .project-goal {
    max-width: 700px;
    margin: 0 auto 40px;
    font-size: 1.2rem;
    line-height: 1.6;
  }
  
  .hero-image {
    max-width: 800px;
    margin: 0 auto;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }
  
  .hero-image img {
    width: 100%;
    height: auto;
    display: block;
  }
  
  .section-title {
    text-align: center;
    margin-bottom: 50px;
    position: relative;
    font-size: 2rem;
  }
  
  .section-title:after {
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
  
  .features-section {
    padding: 80px 0;
    background-color: #fff;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }
  
  .feature-card {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .feature-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .feature-icon {
    font-size: 2.5rem;
    color: #6c5ce7;
    margin-bottom: 20px;
  }
  
  .feature-title {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }
  
  .feature-description {
    color: #666;
    line-height: 1.6;
  }
  
  .cta-section {
    padding: 80px 0;
    background-color: #6c5ce7;
    color: white;
    text-align: center;
  }
  
  .cta-content {
    max-width: 700px;
    margin: 0 auto;
  }
  
  .cta-content h2 {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  .cta-content p {
    font-size: 1.2rem;
    margin-bottom: 30px;
  }
  
  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 12px 30px;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .btn-primary {
    background-color: white;
    color: #6c5ce7;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #f5f5f5;
    transform: translateY(-3px);
  }
  
  .btn-secondary {
    background-color: transparent;
    color: white;
    border: 2px solid white;
  }
  
  .btn-secondary:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
  }
  
  .how-it-works-section {
    padding: 80px 0;
    background-color: #f9f9f9;
  }
  
  .steps {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .step {
    display: flex;
    margin-bottom: 40px;
    position: relative;
  }
  
  .step:last-child {
    margin-bottom: 0;
  }
  
  .step:not(:last-child):after {
    content: '';
    position: absolute;
    top: 50px;
    left: 25px;
    width: 2px;
    height: calc(100% - 20px);
    background-color: #ddd;
  }
  
  .step-number {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #6c5ce7;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    margin-right: 20px;
    z-index: 1;
  }
  
  .step-content {
    flex: 1;
  }
  
  .step-content h3 {
    margin-bottom: 10px;
  }
  
  .step-content p {
    color: #666;
    line-height: 1.6;
  }
  
  .testimonials-section {
    padding: 80px 0;
    background-color: #fff;
  }
  
  .testimonials-slider {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
  }
  
  .testimonial {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 30px;
    max-width: 500px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  
  .testimonial-content {
    margin-bottom: 20px;
    font-style: italic;
    color: #555;
    line-height: 1.6;
  }
  
  .testimonial-content p {
    position: relative;
    padding: 0 20px;
  }
  
  .testimonial-content p:before,
  .testimonial-content p:after {
    content: '"';
    font-size: 1.5rem;
    color: #6c5ce7;
    position: absolute;
  }
  
  .testimonial-content p:before {
    left: 0;
    top: 0;
  }
  
  .testimonial-content p:after {
    right: 0;
    bottom: 0;
  }
  
  .testimonial-author {
    display: flex;
    align-items: center;
  }
  
  .author-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;
  }
  
  .author-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .author-name {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .author-profession {
    font-size: 0.9rem;
    color: #666;
  }
  
  @media (max-width: 768px) {
    .project-title {
      font-size: 2rem;
    }
    
    .project-slogan {
      font-size: 1.2rem;
    }
    
    .cta-buttons {
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    
    .testimonials-slider {
      flex-direction: column;
      align-items: center;
    }
    
    .testimonial {
      width: 100%;
    }
  }
  </style>
  