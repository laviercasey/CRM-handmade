<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <router-link to="/">
            <span class="logo-text">ТвойCRM</span>
          </router-link>
          <p class="tagline">Для хендмейдеров и творческих людей</p>
        </div>
        
        <div class="footer-links">
          <div class="links-column">
            <h3>О проекте</h3>
            <ul>
              <li><router-link to="/">О нас</router-link></li>
              <li><router-link to="/#faq">Часто задаваемые вопросы</router-link></li>
              <li><router-link to="/#feedback">Обратная связь</router-link></li>
            </ul>
          </div>
          
          <div class="links-column">
            <h3>Возможности</h3>
            <ul>
              <li><router-link to="/dashboard">Личный кабинет</router-link></li>
              <li><router-link to="/dashboard/profile">Настройки профиля</router-link></li>
              <li><a href="#" @click.prevent="showCalculator">Калькулятор стоимости</a></li>
            </ul>
          </div>
          
          <div class="links-column">
            <h3>Документация</h3>
            <ul>
              <li><router-link to="/api-docs">API документация</router-link></li>
              <li><a href="#" @click.prevent="showTerms">Условия использования</a></li>
              <li><a href="#" @click.prevent="showPrivacy">Политика конфиденциальности</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-contact">
          <h3>Связаться с нами</h3>
          <div class="contact-info">
            <p><i class="fas fa-envelope"></i> <a href="mailto:info@tvoycrm.ru">info@tvoycrm.ru</a></p>
            <p><i class="fab fa-telegram"></i> <a href="https://t.me/tvoycrm" target="_blank">@tvoycrm</a></p>
          </div>
          <div class="social-links">
            <a href="#" target="_blank" class="social-link"><i class="fab fa-vk"></i></a>
            <a href="#" target="_blank" class="social-link"><i class="fab fa-telegram"></i></a>
            <a href="#" target="_blank" class="social-link"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="copyright">&copy; {{ currentYear }} ТвойCRM. Все права защищены.</p>
        <div class="footer-nav">
          <a href="#" @click.prevent="showTerms">Условия</a>
          <a href="#" @click.prevent="showPrivacy">Конфиденциальность</a>
          <a href="#" @click.prevent="showCookies">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  },
  
  methods: {
    showCalculator() {
      if (this.$store.getters['auth/isAuthenticated']) {
        this.$router.push('/dashboard')
        this.$store.commit('dashboard/SET_ACTIVE_TAB', 'calculations')
      } else {
        this.$store.commit('auth/SET_SHOW_LOGIN_MODAL', true)
      }
    },
    
    showTerms() {
      alert('Условия использования будут доступны в следующей версии')
    },
    
    showPrivacy() {
      alert('Политика конфиденциальности будет доступна в следующей версии')
    },
    
    showCookies() {
      alert('Информация о cookies будет доступна в следующей версии')
    }
  }
}
</script>

<style scoped>
.app-footer {
  background-color: #f5f5f5;
  padding: 50px 0 20px;
  margin-top: 60px;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 40px;
}

.footer-logo {
  flex: 1;
  min-width: 200px;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #6c5ce7;
}

.tagline {
  margin-top: 10px;
  color: #666;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  flex: 2;
}

.links-column {
  flex: 1;
  min-width: 150px;
}

.links-column h3 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
}

.links-column ul {
  list-style: none;
  padding: 0;
}

.links-column ul li {
  margin-bottom: 10px;
}

.links-column ul li a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.links-column ul li a:hover {
  color: #6c5ce7;
}

.footer-contact {
  flex: 1;
  min-width: 200px;
}

.footer-contact h3 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
}

.contact-info {
  margin-bottom: 15px;
}

.contact-info p {
  margin-bottom: 8px;
  color: #666;
}

.contact-info a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.contact-info a:hover {
  color: #6c5ce7;
}

.contact-info i {
  width: 20px;
  color: #6c5ce7;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #666;
  transition: all 0.3s;
}

.social-link:hover {
  background-color: #6c5ce7;
  color: white;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
  flex-wrap: wrap;
  gap: 15px;
}

.copyright {
  color: #999;
  font-size: 14px;
}

.footer-nav {
  display: flex;
  gap: 20px;
}

.footer-nav a {
  color: #999;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-nav a:hover {
  color: #6c5ce7;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 30px;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 20px;
  }
  
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
