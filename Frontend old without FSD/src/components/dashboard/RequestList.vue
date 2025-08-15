
<template>
  <div class="request-list">
    <div class="filters">
      <div class="filter-group">
        <label for="status-filter">Статус:</label>
        <select id="status-filter" v-model="statusFilter">
          <option value="">Все</option>
          <option value="pending">Ожидающие</option>
          <option value="accepted">Принятые</option>
          <option value="rejected">Отклоненные</option>
          <option value="done">Выполненные</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="date-filter">Сортировка:</label>
        <select id="date-filter" v-model="sortOrder">
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
        </select>
      </div>
      
      <div class="search-group">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Поиск заявок..."
          class="search-input"
        >
      </div>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка заявок...</p>
    </div>
    
    <div v-else-if="filteredRequests.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-inbox"></i>
      </div>
      <h3>Заявок не найдено</h3>
      <p v-if="statusFilter || searchQuery">
        Попробуйте изменить параметры фильтрации или поиска
      </p>
      <p v-else>
        У вас пока нет заявок. Создайте новую заявку или разместите форму для клиентов.
      </p>
    </div>
    
    <div v-else class="request-cards">
      <RequestItem 
        v-for="request in filteredRequests" 
        :key="request.id"
        :request="request"
        @click="openRequestDetails"
        @status-update="handleStatusUpdate"
      />
    </div>
    
    <div v-if="selectedRequest" class="modal-overlay" @click="selectedRequest = null">
      <div class="modal-content request-details" @click.stop>
        <div class="modal-header">
          <h2>Детали заявки</h2>
          <button class="close-button" @click="selectedRequest = null">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="detail-row">
            <div class="detail-label">Статус:</div>
            <div :class="['detail-value', `status-${selectedRequest.status}`]">
              {{ getStatusText(selectedRequest.status) }}
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">Дата создания:</div>
            <div class="detail-value">{{ formatDate(selectedRequest.created_at, true) }}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">Название услуги:</div>
            <div class="detail-value">{{ selectedRequest.service_name }}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">Цена:</div>
            <div class="detail-value">{{ formatPrice(selectedRequest.price) }} ₽</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">Контакт:</div>
            <div class="detail-value">{{ selectedRequest.contact_tg }}</div>
          </div>
          
          <div class="detail-row full-width">
            <div class="detail-label">Описание:</div>
            <div class="detail-value description">{{ selectedRequest.description || 'Описание отсутствует' }}</div>
          </div>
        </div>
        
        <div class="modal-footer">
          <div v-if="selectedRequest.status === 'pending'" class="action-buttons">
            <button 
              class="btn-success"
              @click="updateRequestStatus(selectedRequest.id, 'accepted')"
            >
              Принять заявку
            </button>
            <button 
              class="btn-danger"
              @click="updateRequestStatus(selectedRequest.id, 'rejected')"
            >
              Отклонить заявку
            </button>
          </div>
          <div v-else-if="selectedRequest.status === 'accepted'" class="action-buttons">
            <button 
              class="btn-success"
              @click="updateRequestStatus(selectedRequest.id, 'done')"
            >
              Отметить как выполненную
            </button>
            <button 
              class="btn-secondary"
              @click="updateRequestStatus(selectedRequest.id, 'pending')"
            > 
              Вернуть в ожидание
            </button>
          </div>
          <div v-else class="action-buttons">
            <button 
              class="btn-secondary"
              @click="updateRequestStatus(selectedRequest.id, 'pending')"
            > 
              Вернуть в ожидание
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import RequestItem from './RequestItem.vue';

const store = useStore();

const statusFilter = ref('');
const sortOrder = ref('newest');
const searchQuery = ref('');
const selectedRequest = ref(null);
const loading = ref(true);

const requests = computed(() => store.state.requests.requests);

const filteredRequests = computed(() => {
  let result = requests.value;
  
  if (statusFilter.value) {
    result = result.filter(request => request.status === statusFilter.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(request => 
      request.service_name.toLowerCase().includes(query) || 
      (request.description && request.description.toLowerCase().includes(query)) ||
      request.contact_tg.toLowerCase().includes(query)
    );
  }
  
  result = [...result].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    
    if (sortOrder.value === 'newest') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });
  
  return result;
});

async function loadRequests() {
  try {
    loading.value = true;
    await store.dispatch('requests/fetchRequests');
  } catch (error) {
    console.error('Ошибка загрузки заявок:', error);
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString, includeTime = false) {
  const date = new Date(dateString);
  
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('ru-RU', options).format(date);
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price);
}

function getStatusText(status) {
  const statusMap = {
    'pending': 'Ожидает',
    'accepted': 'Принята',
    'rejected': 'Отклонена',
    'done': 'Выполнена'
  };
  
  return statusMap[status] || status;
}

function openRequestDetails(request) {
  selectedRequest.value = {...request};
}

function handleStatusUpdate({ requestId, status }) {
  updateRequestStatus(requestId, status);
}

async function updateRequestStatus(requestId, newStatus) {
  try {
    await store.dispatch('requests/updateRequest', { requestId, status: newStatus });
    
    if (selectedRequest.value && selectedRequest.value.id === requestId) {
      selectedRequest.value = null;
    }
    
    store.dispatch('notifications/showSuccess', {
      title: 'Статус обновлен',
      text: `Статус заявки успешно изменен на "${getStatusText(newStatus)}"`
    });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    
    store.dispatch('notifications/showError', {
      title: 'Ошибка',
      text: 'Не удалось обновить статус заявки'
    });
  }
}

onMounted(() => {
  loadRequests();
});
</script>
  
/* RequestList.vue */
<style scoped>
.request-list {
  margin-bottom: 30px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-group, .search-group {
  margin-top: auto;
  flex: 1;
  min-width: 200px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #555;
}

select, .search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.request-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  color: #ddd;
  margin-bottom: 15px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(108, 92, 231, 0.2);
  border-radius: 50%;
  border-top-color: #6c5ce7;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Стили для модального окна с деталями */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.detail-row {
  display: flex;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.detail-row.full-width {
  flex-direction: column;
}

.detail-label {
  width: 150px;
  font-weight: 500;
  color: #555;
}

.detail-row.full-width .detail-label {
  margin-bottom: 8px;
}

.detail-value {
  flex: 1;
  min-width: 200px;
}

.detail-value.description {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  white-space: pre-line;
  min-height: 100px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-success, .btn-danger, .btn-secondary {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-success {
  background-color: #4caf50;
  color: white;
  border: none;
}

.btn-success:hover {
  background-color: #43a047;
}

.btn-danger {
  background-color: #f44336;
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: #e53935;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e9e9e9;
}

.status-pending {
  background-color: #fff8e1;
  color: #f9a825;
}

.status-accepted {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-rejected {
  background-color: #ffebee;
  color: #c62828;
}

.status-done {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

@media (max-width: 992px) {
  .request-cards {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 10px;
  }
  
  .filter-group, .search-group {
    min-width: 100%;
  }
  
  .request-cards {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  
  .detail-row {
    flex-direction: column;
    margin-bottom: 20px;
  }
  
  .detail-label {
    width: 100%;
    margin-bottom: 5px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-success, .btn-danger, .btn-secondary {
    width: 100%;
    margin-bottom: 5px;
  }
}

@media (max-width: 576px) {
  .request-cards {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
  
  .modal-header h2 {
    font-size: 18px;
  }
  
  .modal-body {
    padding: 15px;
  }
  
  .detail-value.description {
    padding: 10px;
  }
}
</style>
