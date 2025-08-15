<template>
  <div class="calculations-container">
    <div class="section-header">
      <h2>Расчеты и аналитика</h2>
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
    </div>
    
    <div class="cards-row">
      <div class="calc-card">
        <div class="card-header">
          <h3>Финансовая сводка</h3>
          <button class="btn-icon" @click="refreshFinancialData">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
        <div class="card-body">
          <div v-if="loading.financialData" class="loader">Загрузка...</div>
          <div v-else class="financial-summary">
            <div class="summary-item">
              <div class="summary-label">Доход</div>
              <div class="summary-value income">{{ formatPrice(financialData.income) }} ₽</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Расходы</div>
              <div class="summary-value expenses">{{ formatPrice(financialData.expenses) }} ₽</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Прибыль</div>
              <div class="summary-value profit">{{ formatPrice(financialData.profit) }} ₽</div>
            </div>
          </div>
          <div class="profit-chart">
            <div class="chart-title">Динамика прибыли</div>
            <div v-if="loading.profitTrend" class="loader">Загрузка...</div>
            <div v-else class="chart-container">
              <div 
                v-for="(item, index) in profitTrend" 
                :key="index"
                class="chart-bar-container"
              >
                <div class="bar-label">{{ item.label }}</div>
                <div class="bar-wrapper">
                  <div 
                    class="bar" 
                    :class="{ positive: item.value >= 0, negative: item.value < 0 }"
                    :style="getBarStyle(item.value, maxProfitValue)"
                  ></div>
                </div>
                <div class="bar-value">{{ formatPrice(item.value) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="calc-card">
        <div class="card-header">
          <h3>Материалы и затраты</h3>
          <button class="btn-icon" @click="showMaterialForm = true">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="card-body">
          <div v-if="loading.materials" class="loader">Загрузка материалов...</div>
          <div v-else-if="materials.length === 0" class="empty-state">
            <p>У вас пока нет добавленных материалов</p>
            <button class="btn-primary" @click="showMaterialForm = true">
              Добавить материал
            </button>
          </div>
          <div v-else class="materials-list">
            <div 
              v-for="material in materials" 
              :key="material.id"
              class="material-item"
            >
              <div class="material-info">
                <div class="material-name">{{ material.name }}</div>
                <div class="material-details">
                  <span>{{ material.quantity }} {{ material.unit }}</span>
                  <span>{{ formatPrice(material.price) }} ₽</span>
                </div>
              </div>
              <div class="material-actions">
                <button class="btn-icon" @click="editMaterial(material)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" @click="confirmDeleteMaterial(material.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="materials-total">
              <div class="total-label">Общая стоимость материалов:</div>
              <div class="total-value">{{ formatPrice(calculateMaterialsTotal()) }} ₽</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="cards-row">
      <div class="calc-card full-width">
        <div class="card-header">
          <h3>Калькулятор стоимости изделия</h3>
        </div>
        <div class="card-body">
          <div class="calculator-form">
            <div class="form-row">
              <div class="form-group">
                <label for="product-name">Название изделия</label>
                <input 
                  type="text" 
                  id="product-name" 
                  v-model="calculator.name"
                  placeholder="Введите название изделия"
                >
              </div>
              <div class="form-group">
                <label for="work-hours">Время работы (часы)</label>
                <input 
                  type="number" 
                  id="work-hours" 
                  v-model.number="calculator.workHours"
                  min="0"
                  step="0.5"
                >
              </div>
              <div class="form-group">
                <label for="hourly-rate">Стоимость часа работы (₽)</label>
                <input 
                  type="number" 
                  id="hourly-rate" 
                  v-model.number="calculator.hourlyRate"
                  min="0"
                >
              </div>
            </div>
            
            <div class="materials-selector">
              <label>Используемые материалы</label>
              <div v-if="loading.materials" class="loader">Загрузка материалов...</div>
              <div v-else-if="materials.length === 0" class="empty-state">
                <p>Для расчета необходимо добавить материалы</p>
                <button class="btn-primary" @click="showMaterialForm = true">
                  Добавить материал
                </button>
              </div>
              <div v-else class="materials-grid">
                <div 
                  v-for="material in materials" 
                  :key="material.id"
                  :class="['material-card', { selected: isMaterialSelected(material.id) }]"
                  @click="toggleMaterial(material.id)"
                >
                  <div class="material-card-name">{{ material.name }}</div>
                  <div class="material-card-details">
                    {{ material.quantity }} {{ material.unit }} | {{ formatPrice(material.price) }} ₽
                  </div>
                  <div class="material-checkbox">
                    <i class="fas" :class="isMaterialSelected(material.id) ? 'fa-check-circle' : 'fa-circle'"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="additional-costs">Дополнительные расходы (₽)</label>
                <input 
                  type="number" 
                  id="additional-costs" 
                  v-model.number="calculator.additionalCosts"
                  min="0"
                >
              </div>
              <div class="form-group">
                <label for="profit-margin">Наценка (%)</label>
                <input 
                  type="number" 
                  id="profit-margin" 
                  v-model.number="calculator.profitMargin"
                  min="0"
                  max="100"
                >
              </div>
            </div>
            
            <div class="calculation-results">
              <div class="result-item">
                <div class="result-label">Стоимость материалов:</div>
                <div class="result-value">{{ formatPrice(calculatedMaterialsCost) }} ₽</div>
              </div>
              <div class="result-item">
                <div class="result-label">Стоимость работы:</div>
                <div class="result-value">{{ formatPrice(calculatedLaborCost) }} ₽</div>
              </div>
              <div class="result-item">
                <div class="result-label">Дополнительные расходы:</div>
                <div class="result-value">{{ formatPrice(calculator.additionalCosts) }} ₽</div>
              </div>
              <div class="result-item">
                <div class="result-label">Себестоимость:</div>
                <div class="result-value">{{ formatPrice(calculatedCostPrice) }} ₽</div>
              </div>
              <div class="result-item">
                <div class="result-label">Наценка ({{ calculator.profitMargin }}%):</div>
                <div class="result-value">{{ formatPrice(calculatedMargin) }} ₽</div>
              </div>
              <div class="result-item total">
                <div class="result-label">Итоговая цена:</div>
                <div class="result-value">{{ formatPrice(calculatedTotalPrice) }} ₽</div>
              </div>
            </div>
            
            <div class="form-actions">
              <button class="btn-secondary" @click="resetCalculator">Сбросить</button>
              <button class="btn-primary" @click="saveAsProduct">Сохранить как товар</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
    <div v-if="showMaterialForm" class="modal-overlay" @click="showMaterialForm = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingMaterial ? 'Редактировать материал' : 'Добавить материал' }}</h3>
          <button class="close-button" @click="closeMaterialForm">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveMaterial">
            <div class="form-group">
              <label for="material-name">Название материала</label>
              <input 
                type="text" 
                id="material-name" 
                v-model="materialForm.name"
                placeholder="Например: Пряжа, Бисер, Ткань"
                required
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="material-quantity">Количество</label>
                <input 
                  type="number" 
                  id="material-quantity" 
                  v-model.number="materialForm.quantity"
                  min="0"
                  step="0.1"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="material-unit">Единица измерения</label>
                <select id="material-unit" v-model="materialForm.unit" required>
                  <option value="шт">шт</option>
                  <option value="г">г</option>
                  <option value="кг">кг</option>
                  <option value="м">м</option>
                  <option value="см">см</option>
                  <option value="л">л</option>
                  <option value="мл">мл</option>
                  <option value="упак">упак</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="material-price">Стоимость (₽)</label>
              <input 
                type="number" 
                id="material-price" 
                v-model.number="materialForm.price"
                min="0"
                step="0.01"
                required
              >
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeMaterialForm">Отмена</button>
              <button type="submit" class="btn-primary">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const selectedPeriod = ref('month');
const periods = ref([
  { label: 'Неделя', value: 'week' },
  { label: 'Месяц', value: 'month' },
  { label: 'Квартал', value: 'quarter' },
  { label: 'Год', value: 'year' }
]);

const showMaterialForm = ref(false);
const editingMaterial = ref(null);
const materialForm = reactive({
  name: '',
  quantity: 0,
  unit: 'шт',
  price: 0
});

const calculator = reactive({
  name: '',
  workHours: 0,
  hourlyRate: 300,
  selectedMaterials: [],
  additionalCosts: 0,
  profitMargin: 30
});

const financialData = computed(() => store.state.calculations.financialData);
const profitTrend = computed(() => store.state.calculations.profitTrend);
const materials = computed(() => store.state.calculations.materials);
const loading = computed(() => store.state.calculations.loading);
const error = computed(() => store.state.calculations.error);

const maxProfitValue = computed(() => {
  if (!profitTrend.value || profitTrend.value.length === 0) return 0;
  const values = profitTrend.value.map(item => Math.abs(item.value));
  return Math.max(...values);
});

const calculatedMaterialsCost = computed(() => {
  return calculator.selectedMaterials.reduce((total, materialId) => {
    const material = materials.value.find(m => m.id === materialId);
    return total + (material ? material.price : 0);
  }, 0);
});

const calculatedLaborCost = computed(() => {
  return calculator.workHours * calculator.hourlyRate;
});

const calculatedCostPrice = computed(() => {
  return calculatedMaterialsCost.value + calculatedLaborCost.value + calculator.additionalCosts;
});

const calculatedMargin = computed(() => {
  return calculatedCostPrice.value * (calculator.profitMargin / 100);
});

const calculatedTotalPrice = computed(() => {
  return calculatedCostPrice.value + calculatedMargin.value;
});

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price);
}

function getBarStyle(value, maxValue) {
  if (maxValue === 0) return { height: '0%' };
  
  const height = (Math.abs(value) / maxValue) * 100;
  const position = value >= 0 ? 'bottom' : 'top';
  
  return {
    height: `${height}%`,
    [position]: 0
  };
}

function calculateMaterialsTotal() {
  return materials.value.reduce((total, material) => total + material.price, 0);
}

const fetchInitialData = async () => {
  try {
    await Promise.all([
      store.dispatch('calculations/fetchFinancialData', selectedPeriod.value),
      store.dispatch('calculations/fetchProfitTrend', selectedPeriod.value),
      store.dispatch('calculations/fetchMaterials')
    ]);
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }
};

const changePeriod = async (period) => {
  selectedPeriod.value = period;
  try {
    await Promise.all([
      store.dispatch('calculations/fetchFinancialData', period),
      store.dispatch('calculations/fetchProfitTrend', period)
    ]);
  } catch (error) {
    console.error('Error fetching data for period:', error);
  }
};

const refreshFinancialData = async () => {
  try {
    await Promise.all([
      store.dispatch('calculations/fetchFinancialData', selectedPeriod.value),
      store.dispatch('calculations/fetchProfitTrend', selectedPeriod.value)
    ]);
  } catch (error) {
    console.error('Error refreshing financial data:', error);
  }
};

const editMaterial = (material) => {
  editingMaterial.value = material;
  materialForm.name = material.name;
  materialForm.quantity = material.quantity;
  materialForm.unit = material.unit;
  materialForm.price = material.price;
  showMaterialForm.value = true;
};

const confirmDeleteMaterial = (materialId) => {
  if (confirm('Вы уверены, что хотите удалить этот материал?')) {
    deleteMaterialById(materialId);
  }
};

const deleteMaterialById = async (materialId) => {
  try {
    await store.dispatch('calculations/deleteMaterial', materialId);
    
    calculator.selectedMaterials = calculator.selectedMaterials
      .filter(id => id !== materialId);
  } catch (error) {
    console.error('Error deleting material:', error);
  }
};

const saveMaterial = async () => {
  try {
    if (editingMaterial.value) {
      await store.dispatch('calculations/updateMaterial', {
        materialId: editingMaterial.value.id,
        materialData: { ...materialForm }
      });
    } else {
      await store.dispatch('calculations/createMaterial', { ...materialForm });
    }
    
    closeMaterialForm();
  } catch (error) {
    console.error('Error saving material:', error);
  }
};

const closeMaterialForm = () => {
  materialForm.name = '';
  materialForm.quantity = 0;
  materialForm.unit = 'шт';
  materialForm.price = 0;
  editingMaterial.value = null;
  showMaterialForm.value = false;
};

const isMaterialSelected = (materialId) => {
  return calculator.selectedMaterials.includes(materialId);
};

const toggleMaterial = (materialId) => {
  if (isMaterialSelected(materialId)) {
    calculator.selectedMaterials = calculator.selectedMaterials.filter(id => id !== materialId);
  } else {
    calculator.selectedMaterials.push(materialId);
  }
};

const resetCalculator = () => {
  calculator.name = '';
  calculator.workHours = 0;
  calculator.hourlyRate = 300;
  calculator.selectedMaterials = [];
  calculator.additionalCosts = 0;
  calculator.profitMargin = 30;
};

const saveAsProduct = async () => {
  if (!calculator.name) {
    alert('Пожалуйста, укажите название изделия');
    return;
  }
  
  try {
    const selectedMaterialsInfo = calculator.selectedMaterials.map(id => {
      const material = materials.value.find(m => m.id === id);
      return material ? material.name : '';
    }).filter(Boolean);
    
    const productData = {
      name: calculator.name,
      img_name: 'default-product.jpg',
      description: `Изделие создано с использованием калькулятора стоимости.\nВремя работы: ${calculator.workHours} ч.\nИспользованные материалы: ${selectedMaterialsInfo.join(', ')}`,
      calculationData: {
        workHours: calculator.workHours,
        hourlyRate: calculator.hourlyRate,
        materials: calculator.selectedMaterials,
        additionalCosts: calculator.additionalCosts,
        profitMargin: calculator.profitMargin
      }
    };
    
    await store.dispatch('calculations/saveProductFromCalculation', productData);
    alert('Товар успешно сохранен!');
    resetCalculator();
  } catch (error) {
    console.error('Error saving product:', error);
    alert('Ошибка при сохранении товара');
  }
};



onMounted(() => {
  fetchInitialData();
});
</script>
    
<style scoped>
    .calculations-container {
      padding-bottom: 40px;
    }
    
    .section-header {
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
    
    .cards-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .calc-card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      flex: 1;
      min-width: 300px;
      width: 100%;
    }
    
    .calc-card.full-width {
      width: 100%;
      flex-basis: 100%;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    
    .card-header h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }
    
    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background-color: #f5f5f5;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .btn-icon:hover {
      background-color: #e0e0e0;
    }
    
    .card-body {
      padding: 20px;
    }
    
    .financial-summary {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .summary-item {
      text-align: center;
      flex: 1;
      min-width: 100px;
    }
    
    .summary-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .summary-value {
      font-size: 24px;
      font-weight: bold;
    }
    
    .summary-value.income {
      color: #2e7d32;
    }
    
    .summary-value.expenses {
      color: #c62828;
    }
    
    .summary-value.profit {
      color: #1976d2;
    }
    
    .profit-chart {
      margin-top: 20px;
    }
    
    .chart-title {
      font-size: 16px;
      color: #333;
      margin-bottom: 15px;
    }
    
    .chart-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 200px;
      overflow-x: auto;
      padding-bottom: 10px;
    }
    
    .chart-bar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      min-width: 40px;
    }
    
    .bar-label {
      margin-bottom: 8px;
      font-size: 14px;
      color: #666;
    }
    
    .bar-wrapper {
      width: 30px;
      height: 150px;
      position: relative;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .bar {
      width: 100%;
      position: absolute;
      border-radius: 4px;
    }
    
    .bar.positive {
      background-color: #4caf50;
    }
    
    .bar.negative {
      background-color: #f44336;
    }
    
    .bar-value {
      margin-top: 8px;
      font-size: 12px;
      color: #666;
    }
    
    .empty-state {
      text-align: center;
      padding: 30px 0;
      color: #666;
    }
    
    .materials-list {
      margin-bottom: 20px;
    }
    
    .material-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .material-info {
      flex: 1;
      min-width: 200px;
    }
    
    .material-name {
      font-weight: 500;
      margin-bottom: 5px;
    }
    
    .material-details {
      font-size: 14px;
      color: #666;
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    
    .material-actions {
      display: flex;
      gap: 10px;
    }
    
    .materials-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      font-weight: 500;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .calculator-form {
      max-width: 900px;
      margin: 0 auto;
    }
    
    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .form-group {
      flex: 1;
      min-width: 250px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #555;
    }
    
    input, select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .materials-selector {
      margin-bottom: 20px;
    }
    
    .materials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 10px;
    }
    
    .material-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s;
    }
    
    .material-card:hover {
      border-color: #6c5ce7;
      background-color: #f9f8fe;
    }
    
    .material-card.selected {
      border-color: #6c5ce7;
      background-color: #f5f3ff;
    }
    
    .material-card-name {
      font-weight: 500;
      margin-bottom: 5px;
    }
    
    .material-card-details {
      font-size: 14px;
      color: #666;
    }
    
    .material-checkbox {
      position: absolute;
      top: 15px;
      right: 15px;
      color: #ddd;
    }
    
    .material-card.selected .material-checkbox {
      color: #6c5ce7;
    }
    
    .calculation-results {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .result-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .result-item.total {
      border-bottom: none;
      padding-top: 15px;
      font-size: 18px;
      font-weight: bold;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      flex-wrap: wrap;
    }
    
    .btn-primary, .btn-secondary {
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .btn-primary {
      background-color: #6c5ce7;
      color: white;
      border: none;
    }
    
    .btn-primary:hover {
      background-color: #5649c0;
    }
    
    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }
    
    .btn-secondary:hover {
      background-color: #e9e9e9;
    }
    
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
      max-width: 500px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    
    .modal-header h3 {
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
    }
    
    @media (max-width: 768px) {
      .financial-summary {
        flex-direction: column;
        gap: 15px;
      }
      
      .form-row {
        flex-direction: column;
        gap: 15px;
      }
      
      .chart-container {
        overflow-x: auto;
        padding-bottom: 10px;
        justify-content: flex-start;
      }
    
      .chart-bar-container {
        min-width: 60px;
      }
      
      .material-item {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .material-actions {
        margin-top: 10px;
        align-self: flex-end;
      }
      
      .result-item {
        flex-direction: column;
      }
      
      .form-actions {
        justify-content: center;
      }
      
      .materials-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
    
@media (max-width: 480px) {
  .period-button {
    padding: 6px 8px;
    font-size: 12px;
    flex: 1;
    text-align: center;
  }
  
  .section-header h2 {
    font-size: 18px;
    width: 100%;
    margin-bottom: 10px;
  }
  
  .card-header {
    padding: 12px;
  }
  
  .card-header h3 {
    font-size: 16px;
  }
  
  .btn-icon {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
  
  .card-body {
    padding: 12px;
  }
  
  .summary-label {
    font-size: 12px;
  }
  
  .summary-value {
    font-size: 18px;
  }
  
  .chart-title {
    font-size: 14px;
  }
  
  .profit-chart {
    overflow-x: auto;
    margin: 0 -12px;
    padding: 0 12px;
    width: calc(100% + 24px);
  }
  
  .chart-container {
    padding-bottom: 15px; 
    margin-bottom: 10px;
  }
  
  .chart-bar-container {
    min-width: 50px;
  }
  
  .bar-wrapper {
    width: 20px;
  }
  
  .bar-label, .bar-value {
    font-size: 10px;
  }
  
  .material-name {
    font-size: 14px;
  }
  
  .material-details {
    font-size: 12px;
  }
  
  .materials-total {
    font-size: 14px;
  }
  
  .calc-card.full-width {
    overflow-x: hidden;
  }
  
  label {
    font-size: 14px;
  }
  
  input, select {
    padding: 8px;
    font-size: 14px;
  }
  
  .materials-grid {
    grid-template-columns: 1fr;
  }
  
  .material-card {
    padding: 10px;
  }
  
  .material-card-name {
    font-size: 14px;
  }
  
  .material-card-details {
    font-size: 12px;
  }
  
  .calculation-results {
    padding: 12px;
  }
  
  .result-item {
    font-size: 13px;
  }
  
  .result-item.total {
    font-size: 16px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 8px 15px;
    font-size: 14px;
  }
  
  .modal-content {
    width: 95%;
  }
  
  .modal-header h3 {
    font-size: 16px;
  }
  
  .modal-body {
    padding: 15px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-actions {
    gap: 10px;
  }
  
  /* Уменьшаем отступы для экономии места */
  .cards-row {
    gap: 15px;
    margin-bottom: 15px;
  }
  
  /* Уменьшаем размер шрифта и отступы в результатах */
  .result-label, .result-value {
    font-size: 12px;
  }
}


    </style>
    