<template>
  <section class="team-info">
    <div class="container">
      <h2 class="section-title">Наша команда</h2>
      <p class="section-subtitle">Познакомьтесь с людьми, которые создали ТвойCRM для вас</p>
      
      <div class="team-grid">
        <div class="team-member founder">
          <div class="member-photo">
            <img src="@/assets/founder.jpg" alt="Основатель" @error="handleImageError">
          </div>
          <div class="member-info">
            <h3 class="member-name">Анастасия Смирнова</h3>
            <div class="member-role">Основатель и CEO</div>
            <p class="member-description">
              Будучи хендмейдером с многолетним опытом, Анастасия столкнулась с проблемой управления заказами и решила создать удобный инструмент, который поможет творческим людям сосредоточиться на своем ремесле, а не на административных задачах.
            </p>
            <div class="member-social">
              <a href="#" target="_blank" class="social-link"><i class="fab fa-linkedin"></i></a>
              <a href="#" target="_blank" class="social-link"><i class="fab fa-telegram"></i></a>
              <a href="#" target="_blank" class="social-link"><i class="fab fa-instagram"></i></a>
            </div>
            <div class="member-quote">
              <i class="fas fa-quote-left"></i>
              <p>Я верю, что творческие люди должны тратить время на то, что они любят — создавать прекрасное, а не бороться с таблицами и записями заказов.</p>
            </div>
          </div>
        </div>
        
        <div class="team-members-grid">
          <div class="team-member">
            <div class="member-photo">
              <img src="@/assets/developer.jpg" alt="Разработчик" @error="handleImageError">
            </div>
            <h3 class="member-name">Александр Петров</h3>
            <div class="member-role">Ведущий разработчик</div>
            <p class="member-description">
              Опытный разработчик с фокусом на создании интуитивно понятных и производительных веб-приложений.
            </p>
            <div class="member-social">
              <a href="#" target="_blank" class="social-link"><i class="fab fa-github"></i></a>
              <a href="#" target="_blank" class="social-link"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>
          
          <div class="team-member">
            <div class="member-photo">
              <img src="@/assets/designer.jpg" alt="Дизайнер" @error="handleImageError">
            </div>
            <h3 class="member-name">Елена Иванова</h3>
            <div class="member-role">UI/UX дизайнер</div>
            <p class="member-description">
              Создает элегантные и функциональные интерфейсы, фокусируясь на потребностях пользователей и удобстве использования.
            </p>
            <div class="member-social">
              <a href="#" target="_blank" class="social-link"><i class="fab fa-behance"></i></a>
              <a href="#" target="_blank" class="social-link"><i class="fab fa-dribbble"></i></a>
            </div>
          </div>
          
          <div class="team-member">
            <div class="member-photo">
              <img src="@/assets/marketing.jpg" alt="Маркетолог" @error="handleImageError">
            </div>
            <h3 class="member-name">Михаил Соколов</h3>
            <div class="member-role">Маркетолог</div>
            <p class="member-description">
              Помогает творческим людям узнать о ТвойCRM и развивает сообщество пользователей платформы.
            </p>
            <div class="member-social">
              <a href="#" target="_blank" class="social-link"><i class="fab fa-twitter"></i></a>
              <a href="#" target="_blank" class="social-link"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>
          
          <div class="team-member">
            <div class="member-photo">
              <img src="@/assets/support.jpg" alt="Поддержка" @error="handleImageError">
            </div>
            <h3 class="member-name">Ольга Новикова</h3>
            <div class="member-role">Служба поддержки</div>
            <p class="member-description">
              Всегда готова помочь пользователям разобраться с функциями платформы и решить любые возникающие вопросы.
            </p>
            <div class="member-social">
              <a href="#" target="_blank" class="social-link"><i class="fab fa-telegram"></i></a>
              <a href="#" target="_blank" class="social-link"><i class="fas fa-envelope"></i></a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="join-team-section">
        <h3>Присоединяйтесь к нашей команде</h3>
        <p>Мы всегда ищем талантливых и увлеченных людей, которые хотят помогать творческому сообществу</p>
        <a href="mailto:careers@tvoycrm.ru" class="btn-primary">Отправить резюме</a>
      </div>
      
      <div class="our-values">
        <h3>Наши ценности</h3>
        
        <div class="values-grid">
          <div class="value-item">
            <div class="value-icon"><i class="fas fa-users"></i></div>
            <h4>Сообщество</h4>
            <p>Мы создаем инструменты, которые помогают творческим людям расти и развиваться вместе.</p>
          </div>
          
          <div class="value-item">
            <div class="value-icon"><i class="fas fa-lightbulb"></i></div>
            <h4>Инновации</h4>
            <p>Мы постоянно ищем новые способы улучшить наш продукт и сделать его более полезным.</p>
          </div>
          
          <div class="value-item">
            <div class="value-icon"><i class="fas fa-heart"></i></div>
            <h4>Забота</h4>
            <p>Мы искренне заботимся о наших пользователях и стремимся сделать их опыт максимально комфортным.</p>
          </div>
          
          <div class="value-item">
            <div class="value-icon"><i class="fas fa-paint-brush"></i></div>
            <h4>Творчество</h4>
            <p>Мы ценим и поддерживаем творческие идеи, как в нашей работе, так и в сообществе.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
function handleImageError(e) {
  e.target.src = require('@/assets/placeholder-image.png')
}
</script>

  <style scoped>
  .team-info {
    padding: 80px 0;
    background-color: #fff;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .section-title {
    text-align: center;
    margin-bottom: 10px;
    font-size: 2rem;
    color: #333;
  }
  
  .section-subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 50px;
    font-size: 1.1rem;
  }
  
  .team-grid {
    margin-bottom: 60px;
  }
  
  .team-member.founder {
    display: flex;
    gap: 40px;
    margin-bottom: 60px;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  
  .team-member.founder .member-photo {
    flex-shrink: 0;
    width: 250px;
    height: 250px;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .team-member.founder .member-info {
    flex: 1;
  }
  
  .team-member.founder .member-description {
    margin-bottom: 20px;
  }
  
  .member-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .member-name {
    margin: 15px 0 5px;
    font-size: 1.2rem;
  }
  
  .member-role {
    color: #6c5ce7;
    font-weight: 500;
    margin-bottom: 15px;
  }
  
  .member-description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 15px;
  }
  
  .member-social {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .social-link {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #f0f0f0;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }
  
  .social-link:hover {
    background-color: #6c5ce7;
    color: white;
  }
  
  .member-quote {
    background-color: #f0f0f0;
    border-left: 3px solid #6c5ce7;
    padding: 15px;
    border-radius: 0 8px 8px 0;
    position: relative;
  }
  
  .member-quote i {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #6c5ce7;
    opacity: 0.3;
    font-size: 1.5rem;
  }
  
  .member-quote p {
    padding-left: 30px;
    font-style: italic;
    color: #555;
  }
  
  .team-members-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
  }
  
  .team-member {
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
    padding: 20px;
    border-radius: 8px;
  }
  
  .team-member:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .team-member .member-photo {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 15px;
    border: 5px solid #f5f5f5;
  }
  
  .join-team-section {
    text-align: center;
    margin-bottom: 60px;
  }
  
  .join-team-section h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
  
  .join-team-section p {
    color: #666;
    margin-bottom: 20px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .btn-primary {
    display: inline-block;
    background-color: #6c5ce7;
    color: white;
    padding: 12px 30px;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.3s;
  }
  
  .btn-primary:hover {
    background-color: #5649c0;
  }
  
  .our-values h3 {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 30px;
  }
  
  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
  }
  
  .value-item {
    text-align: center;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    transition: transform 0.3s;
  }
  
  .value-item:hover {
    transform: translateY(-5px);
  }
  
  .value-icon {
    font-size: 2rem;
    color: #6c5ce7;
    margin-bottom: 15px;
  }
  
  .value-item h4 {
    margin-bottom: 10px;
    font-size: 1.2rem;
  }
  
  .value-item p {
    color: #666;
    line-height: 1.6;
  }
  
  @media (max-width: 768px) {
    .team-member.founder {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .team-member.founder .member-photo {
      width: 200px;
      height: 200px;
      margin-bottom: 20px;
    }
    
    .member-social {
      justify-content: center;
    }
  }
  </style>
  