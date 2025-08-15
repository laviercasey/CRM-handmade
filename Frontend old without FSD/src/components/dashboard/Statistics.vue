<template>
  <div class="statistics-container">
    
    <div v-if="showErrorNotification" class="notification error">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ errorMessage }}</span>
      <button class="close-btn" @click="showErrorNotification = false">&times;</button>
    </div>
    
    <div v-if="showSuccessNotification" class="notification success">
      <i class="fas fa-check-circle"></i>
      <span>{{ successMessage }}</span>
      <button class="close-btn" @click="showSuccessNotification = false">&times;</button>
    </div>
    
    <div class="statistics-header">
      <h2>Статистика и аналитика</h2>
      <div class="controls">
        <div class="period-selector">
          <button 
            v-for="period in periods" 
            :key="period.value"
            :class="['period-button', { active: selectedPeriod === period.value }]"
            @click="changePeriod(period.value)"
          >
            {{ period.label }}
          </button>
        </div>
        <div class="actions">
          <button class="btn-icon refresh-btn" @click="refreshAllData" title="Обновить данные">
            <i class="fas fa-sync-alt"></i>
          </button>
          <button 
            class="btn-icon auto-refresh-btn" 
            :class="{ active: autoRefreshEnabled }"
            @click="toggleAutoRefresh"
            :title="autoRefreshEnabled ? 'Выключить автообновление' : 'Включить автообновление'"
          >
            <i class="fas fa-clock"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="stats-cards">
      <div class="stats-card">
        <div v-if="isLoading.overview" class="card-loader">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <template v-else>
          <div class="card-icon orders">
            <i class="fas fa-clipboard-list"></i>
          </div>
          <div class="card-content">
            <div class="card-title">Всего заявок</div>
            <div class="card-value">{{ totalRequests }}</div>
            <div class="card-change" :class="requestsChange >= 0 ? 'positive' : 'negative'">
              <i :class="requestsChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ Math.abs(requestsChange) }}% за период
            </div>
          </div>
        </template>
      </div>
      
      <div class="stats-card">
        <div v-if="isLoading.overview" class="card-loader">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <template v-else>
          <div class="card-icon products">
            <i class="fas fa-box"></i>
          </div>
          <div class="card-content">
            <div class="card-title">Товаров в каталоге</div>
            <div class="card-value">{{ totalProducts }}</div>
            <div class="card-change" :class="productsChange >= 0 ? 'positive' : 'negative'">
              <i :class="productsChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ Math.abs(productsChange) }}% за период
            </div>
          </div>
        </template>
      </div>
      
      <div class="stats-card">
        <div v-if="isLoading.overview" class="card-loader">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <template v-else>
          <div class="card-icon revenue">
            <i class="fas fa-ruble-sign"></i>
          </div>
          <div class="card-content">
            <div class="card-title">Общая сумма</div>
            <div class="card-value">{{ formatPrice(totalRevenue) }} ₽</div>
            <div class="card-change" :class="revenueChange >= 0 ? 'positive' : 'negative'">
              <i :class="revenueChange >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ Math.abs(revenueChange) }}% за период
            </div>
          </div>
        </template>
      </div>
    </div>
    
    <div class="stats-charts">
      <div class="chart-container">
        <h3>Заявки по статусам</h3>
        <div v-if="isLoading.statusCounts" class="chart-loader">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Загрузка данных...</span>
        </div>
        <div v-else class="status-chart">
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color pending"></div>
              <div class="legend-label">Ожидающие ({{ statusCounts.pending }})</div>
            </div>
            <div class="legend-item">
              <div class="legend-color accepted"></div>
              <div class="legend-label">Принятые ({{ statusCounts.accepted }})</div>
            </div>
            <div class="legend-item">
              <div class="legend-color rejected"></div>
              <div class="legend-label">Отклоненные ({{ statusCounts.rejected }})</div>
            </div>
            <div class="legend-item">
              <div class="legend-color done"></div>
              <div class="legend-label">Выполненные ({{ statusCounts.done }})</div>
            </div>
          </div>
          <div class="status-bars">
            <div class="status-bar-container">
              <div 
                class="status-bar pending" 
                :style="{ width: getPercentage(statusCounts.pending, totalRequests) + '%' }"
              ></div>
              <div 
                class="status-bar accepted" 
                :style="{ width: getPercentage(statusCounts.accepted, totalRequests) + '%' }"
              ></div>
              <div 
                class="status-bar rejected" 
                :style="{ width: getPercentage(statusCounts.rejected, totalRequests) + '%' }"
              ></div>
              <div 
                class="status-bar done" 
                :style="{ width: getPercentage(statusCounts.done, totalRequests) + '%' }"
              ></div>
            </div>
            <div class="status-percentages">
              <span>{{ getPercentage(statusCounts.pending, totalRequests) }}%</span>
              <span>{{ getPercentage(statusCounts.accepted, totalRequests) }}%</span>
              <span>{{ getPercentage(statusCounts.rejected, totalRequests) }}%</span>
              <span>{{ getPercentage(statusCounts.done, totalRequests) }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>Активность по {{ selectedPeriod === 'week' ? 'дням недели' : 'периоду' }}</h3>
        <div v-if="isLoading.activityByDay" class="chart-loader">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Загрузка данных...</span>
        </div>
        <div v-else class="activity-chart">
          <div 
            v-for="(day, index) in activityByDay" 
            :key="index"
            class="activity-bar-container"
          >
            <div class="day-label">{{ day.label }}</div>
            <div class="activity-bar-wrapper">
              <div 
                class="activity-bar" 
                :style="{ height: getPercentage(day.count, maxDayActivity) + '%' }"
              ></div>
            </div>
            <div class="activity-count">{{ day.count }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="top-products">
      <h3>Популярные товары</h3>
      <div v-if="isLoading.topProducts" class="chart-loader">
        <i class="fas fa-spinner fa-spin"></i>
        <span>Загрузка данных...</span>
      </div>
      <div v-else-if="topProducts.length === 0" class="empty-state">
        <p>У вас пока нет данных о популярных товарах</p>
      </div>
      <div v-else class="product-table">
        <table>
          <thead>
            <tr>
              <th>Товар</th>
              <th>Заказов</th>
              <th>Сумма</th>
              <th>Доля в продажах</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in topProducts" :key="index">
              <td>
                <div class="product-info">
                  <div class="product-image">
                    <img 
                      :src="getProductImage(product.img_name)" 
                      :alt="product.name"
                      @error="handleImageError"
                    >
                  </div>
                  <div class="product-name">{{ product.name }}</div>
                </div>
              </td>
              <td>{{ product.orderCount }}</td>
              <td>{{ formatPrice(product.totalRevenue) }} ₽</td>
              <td>
                <div class="progress-container">
                  <div 
                    class="progress-bar"
                    :style="{ width: getPercentage(product.totalRevenue, totalRevenue) + '%' }"
                  ></div>
                  <span>{{ getPercentage(product.totalRevenue, totalRevenue) }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="stats-footer">
      <div class="export-options">
        <label for="export-format">Формат отчета:</label>
        <select id="export-format" v-model="exportFormat">
          <option v-for="format in exportFormats" :key="format.value" :value="format.value">
            {{ format.label }}
          </option>
        </select>
      </div>
      <button class="btn-primary" @click="generateReport">
        <i class="fas fa-download"></i> Скачать отчет
      </button>
    </div>
  </div>
</template>

  <script setup>
  import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
  import { useStore } from 'vuex';
  
  const store = useStore();
  
  const selectedPeriod = ref('month');
  const periods = ref([
    { label: 'Неделя', value: 'week' },
    { label: 'Месяц', value: 'month' },
    { label: 'Квартал', value: 'quarter' },
    { label: 'Год', value: 'year' }
  ]);
  
  const errorMessage = ref('');
  const showErrorNotification = ref(false);
  const successMessage = ref('');
  const showSuccessNotification = ref(false);
  
  const autoRefreshEnabled = ref(false);
  const autoRefreshInterval = ref(5); 
  let autoRefreshTimer = null;
  
  const exportFormat = ref('pdf');
  const exportFormats = [
    { label: 'PDF', value: 'pdf' },
    { label: 'CSV', value: 'csv' },
    { label: 'Excel', value: 'excel' }
  ];
  
  const totalRequests = computed(() => store.getters['statistics/totalRequests']);
  const totalProducts = computed(() => store.getters['statistics/totalProducts']);
  const totalRevenue = computed(() => store.getters['statistics/totalRevenue']);
  const requestsChange = computed(() => store.getters['statistics/requestsChange']);
  const productsChange = computed(() => store.getters['statistics/productsChange']);
  const revenueChange = computed(() => store.getters['statistics/revenueChange']);
  const statusCounts = computed(() => store.getters['statistics/statusCounts']);
  const activityByDay = computed(() => store.getters['statistics/activityByDay']);
  const topProducts = computed(() => store.getters['statistics/topProducts']);
  const maxDayActivity = computed(() => store.getters['statistics/maxDayActivity']);
  const error = computed(() => store.getters['statistics/error']);
  
const isLoading = computed(() => ({
  overview: store.getters['statistics/isLoadingOverview'],
  statusCounts: store.getters['statistics/isLoadingStatusCounts'],
  activityByDay: store.getters['statistics/isLoadingActivityByDay'],
  topProducts: store.getters['statistics/isLoadingTopProducts']
}));

  function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
  }
  
  function getPercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }
  
  function getProductImage(imageName) {
    if (!imageName) {
      return require('@/assets/placeholder-image.png');
    }
    
    return `${import.meta.env.VITE_API_URL}/images/${imageName}`;
  }
  
  function handleImageError(e) {
    e.target.src = require('@/assets/placeholder-image.png');
  }
  
  async function changePeriod(period) {
    selectedPeriod.value = period;
    try {
      await Promise.all([
        store.dispatch('statistics/fetchOverviewStats'),
        store.dispatch('statistics/fetchActivityByDay', period)
      ]);
      showSuccessNotification.value = true;
      successMessage.value = 'Данные успешно обновлены';
      setTimeout(() => {
        showSuccessNotification.value = false;
      }, 3000);
    } catch (error) {
      console.error('Error changing period:', error);
      showErrorNotification.value = true;
      errorMessage.value = 'Не удалось загрузить данные за выбранный период';
      setTimeout(() => {
        showErrorNotification.value = false;
      }, 5000);
    }
  }
  
  async function refreshAllData() {
    try {
      await Promise.all([
        store.dispatch('statistics/fetchOverviewStats'),
        store.dispatch('statistics/fetchRequestsByStatus'),
        store.dispatch('statistics/fetchActivityByDay', selectedPeriod.value),
        store.dispatch('statistics/fetchTopProducts', 5)
      ]);
      showSuccessNotification.value = true;
      successMessage.value = 'Данные успешно обновлены';
      setTimeout(() => {
        showSuccessNotification.value = false;
      }, 3000);
    } catch (error) {
      console.error('Error refreshing data:', error);
      showErrorNotification.value = true;
      errorMessage.value = 'Не удалось обновить данные статистики';
      setTimeout(() => {
        showErrorNotification.value = false;
      }, 5000);
    }
  }
  
  function toggleAutoRefresh() {
    autoRefreshEnabled.value = !autoRefreshEnabled.value;
    
    if (autoRefreshEnabled.value) {
      autoRefreshTimer = setInterval(() => {
        refreshAllData();
      }, autoRefreshInterval.value * 60 * 1000); 
      
      showSuccessNotification.value = true;
      successMessage.value = `Автообновление включено (каждые ${autoRefreshInterval.value} мин)`;
      setTimeout(() => {
        showSuccessNotification.value = false;
      }, 3000);
    } else {
      if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
        autoRefreshTimer = null;
      }
      
      showSuccessNotification.value = true;
      successMessage.value = 'Автообновление выключено';
      setTimeout(() => {
        showSuccessNotification.value = false;
      }, 3000);
    }
  }
  
  async function generateReport() {
    try {
      await store.dispatch('statistics/generateReport', { format: exportFormat.value });
      showSuccessNotification.value = true;
      successMessage.value = `Отчет успешно сгенерирован в формате ${exportFormat.value.toUpperCase()}`;
      setTimeout(() => {
        showSuccessNotification.value = false;
      }, 3000);
    } catch (error) {
      console.error('Error generating report:', error);
      showErrorNotification.value = true;
      errorMessage.value = 'Не удалось сгенерировать отчет';
      setTimeout(() => {
        showErrorNotification.value = false;
      }, 5000);
    }
  }
  
  onMounted(async () => {
  try {
    await Promise.all([
      store.dispatch('statistics/fetchOverviewStats'),
      store.dispatch('statistics/fetchRequestsByStatus'),
      store.dispatch('statistics/fetchActivityByDay', selectedPeriod.value),
      store.dispatch('statistics/fetchTopProducts', 5)
    ]);
  } catch (error) {
    console.error('Error loading statistics data:', error);
    showErrorNotification.value = true;
    errorMessage.value = 'Не удалось загрузить данные статистики';
    setTimeout(() => {
      showErrorNotification.value = false;
    }, 5000);
  }
});
  
  onUnmounted(() => {
    if (autoRefreshTimer) {
      clearInterval(autoRefreshTimer);
      autoRefreshTimer = null;
    }
  });
  
  watch(error, (newError) => {
    if (newError) {
      showErrorNotification.value = true;
      errorMessage.value = newError;
      setTimeout(() => {
        showErrorNotification.value = false;
      }, 5000);
    }

  });
  </script>

    /* Statistics.vue */
    <style scoped>
    .statistics-container {
      padding-bottom: 40px;
    }
    
    .statistics-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .period-selector {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .period-button {
      padding: 8px 16px;
      border: 1px solid #ddd;
      background-color: #f5f5f5;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .period-button.active {
      background-color: #6c5ce7;
      color: white;
      border-color: #6c5ce7;
    }
    
    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stats-card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 20px;
      display: flex;
      align-items: center;
    }
    
    .card-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-right: 20px;
      flex-shrink: 0;
    }
    
    .card-icon.orders {
      background-color: #e3f2fd;
      color: #1976d2;
    }
    
    .card-icon.products {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    
    .card-icon.revenue {
      background-color: #fff8e1;
      color: #f9a825;
    }
    
    .card-content {
      flex: 1;
    }
    
    .card-title {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .card-value {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .card-change {
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .card-change.positive {
      color: #2e7d32;
    }
    
    .card-change.negative {
      color: #c62828;
    }
    
    .stats-charts {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .chart-container {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 20px;
    }
    
    h3 {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 18px;
      color: #333;
    }
    
    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    
    .legend-color.pending {
      background-color: #f9a825;
    }
    
    .legend-color.accepted {
      background-color: #2e7d32;
    }
    
    .legend-color.rejected {
      background-color: #c62828;
    }
    
    .legend-label {
      font-size: 14px;
      color: #666;
    }
    
    .status-bars {
      margin-top: 20px;
    }
    
    .status-bar-container {
      display: flex;
      height: 30px;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .status-bar {
      height: 100%;
    }
    
    .status-bar.pending {
      background-color: #f9a825;
    }
    
    .status-bar.accepted {
      background-color: #2e7d32;
    }
    
    .status-bar.rejected {
      background-color: #c62828;
    }
    
    .status-percentages {
      display: flex;
      margin-top: 8px;
      font-size: 12px;
      color: #666;
    }
    
    .status-percentages span {
      flex: 1;
      text-align: center;
    }
    
    .activity-chart {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 200px;
      overflow-x: auto;
      padding-bottom: 10px;
    }
    
    .activity-bar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 40px;
      flex-shrink: 0;
    }
    
    .day-label {
      font-size: 14px;
      color: #666;
    }
    
    .activity-bar-wrapper {
      width: 100%;
      height: 145px;
      display: flex;
      align-items: flex-end;
    }
    
    .activity-bar {
      width: 100%;
      background-color: #6c5ce7;
      border-radius: 4px 4px 0 0;
    }
    
    .activity-count {
      margin-top: 8px;
      font-size: 12px;
      color: #666;
    }
    
    .top-products {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 20px;
      margin-bottom: 30px;
    }
    
    .product-table {
      overflow-x: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    th {
      font-weight: 500;
      color: #666;
    }
    
    .product-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .product-image {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
    }
    
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .progress-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .progress-bar {
      height: 8px;
      background-color: #6c5ce7;
      border-radius: 4px;
    }
    
    .stats-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .stats-note {
      color: #666;
      font-size: 14px;
      font-style: italic;
    }
    
    .btn-primary {
      background-color: #6c5ce7;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-primary:hover {
      background-color: #5649c0;
    }
    
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .notification.error {
      background-color: #ffebee;
      color: #c62828;
      border-left: 4px solid #c62828;
    }

    .notification.success {
      background-color: #e8f5e9;
      color: #2e7d32;
      border-left: 4px solid #2e7d32;
    }

    .notification .close-btn {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.7;
      margin-left: 10px;
    }

    .notification .close-btn:hover {
      opacity: 1;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .controls {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background-color: #f5f5f5;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-icon:hover {
      background-color: #e0e0e0;
    }

    .btn-icon.active {
      background-color: #6c5ce7;
      color: white;
    }

    .card-loader, .chart-loader {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      font-size: 20px;
      color: #6c5ce7;
      gap: 10px;
    }

    .chart-loader {
      min-height: 200px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #666;
      text-align: center;
    }

    .export-options {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .export-options select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
    }

    .legend-color.done {
      background-color: #388e3c;
    }

    .status-bar.done {
      background-color: #388e3c;
    }

    @media (max-width: 992px) {
      .stats-cards {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }
    }
    
    @media (max-width: 768px) {
      .statistics-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .period-selector {
        width: 100%;
        justify-content: space-between;
      }
      
      .period-button {
        flex: 1;
        text-align: center;
      }
      
      .stats-cards {
        grid-template-columns: 1fr;
      }
      
      .activity-chart {
        overflow-x: auto;
        padding-bottom: 10px;
        justify-content: flex-start;
      }
      
      .activity-bar-container {
        min-width: 40px;
      }
      
      .stats-footer {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .btn-primary {
        width: 100%;
        justify-content: center;
      }
    }
    
    @media (max-width: 576px) {
      .card-icon {
        width: 50px;
        height: 50px;
        font-size: 20px;
      }
      
      .card-value {
        font-size: 20px;
      }
      
      .chart-container {
        padding: 15px;
      }
      
      h3 {
        font-size: 16px;
      }
      
      th, td {
        padding: 8px;
        font-size: 14px;
      }
      
      .product-image {
        width: 30px;
        height: 30px;
      }
      
      .stats-note {
        font-size: 12px;
      }
    }
    
@media (max-width: 480px) {
  .period-button {
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .stats-card {
    padding: 12px;
  }
  
  .card-icon {
    width: 45px;
    height: 45px;
    font-size: 18px;
    margin-right: 10px;
  }
  
  .card-value {
    font-size: 18px;
  }
  
  .card-title {
    font-size: 12px;
  }
  
  .card-change {
    font-size: 10px;
  }
  
  .chart-container {
    padding: 12px;
  }
  
  h3 {
    font-size: 15px;
    margin-bottom: 15px;
  }
  
  .legend-item {
    gap: 5px;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
  }
  
  .legend-label {
    font-size: 12px;
  }
  
  .activity-bar-container {
    width: 30px;
  }
  
  .day-label {
    font-size: 12px;
  }
  
  .activity-count {
    font-size: 10px;
  }
  
  .top-products {
    padding: 12px;
  }
  
  th, td {
    padding: 6px;
    font-size: 12px;
  }
  
  .product-image {
    width: 25px;
    height: 25px;
  }
  
  .product-name {
    font-size: 12px;
  }
  
  .progress-container {
    gap: 5px;
  }
  
  .progress-bar {
    height: 6px;
  }
  
  .stats-note {
    font-size: 10px;
  }
  
  .btn-primary {
    font-size: 12px;
    padding: 8px 15px;
  }
}


</style>
    