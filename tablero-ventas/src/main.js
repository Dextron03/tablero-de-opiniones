import './dashboard.css';
import { loadAllData, applyFilters, refreshData } from './data.js';
import * as Charts from './charts.js';

let dashboardData = null;

document.querySelector('#app').innerHTML = `
  <div class="dashboard-container">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1><i class="bi bi-graph-up-arrow"></i> Dashboard de Análisis de Opiniones</h1>
        <p class="subtitle">Sistema de Gestión de Opiniones - OpinionDW</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <i class="bi bi-chat-dots stat-icon"></i>
          <span class="stat-label">Total Opiniones</span>
          <span class="stat-value" id="totalOpiniones">300,000</span>
        </div>
        <div class="stat-card">
          <i class="bi bi-emoji-smile stat-icon"></i>
          <span class="stat-label">Sentiment Promedio</span>
          <span class="stat-value" id="avgSentiment">+0.42</span>
        </div>
        <div class="stat-card">
          <i class="bi bi-star-fill stat-icon"></i>
          <span class="stat-label">Rating Promedio</span>
          <span class="stat-value" id="avgRating">3.8</span>
        </div>
      </div>
    </header>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="filter-group">
        <label for="filterFuente">Fuente:</label>
        <select id="filterFuente">
          <option value="all">Todas</option>
          <option value="social">Redes Sociales</option>
          <option value="surveys">Encuestas</option>
          <option value="web">Web Reviews</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="filterPeriodo">Período:</label>
        <select id="filterPeriodo">
          <option value="all">Todo el tiempo</option>
          <option value="month">Último mes</option>
          <option value="quarter">Último trimestre</option>
          <option value="year">Último año</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="filterClasificacion">Clasificación:</label>
        <select id="filterClasificacion">
          <option value="all">Todas</option>
          <option value="positive">Positivas</option>
          <option value="neutral">Neutras</option>
          <option value="negative">Negativas</option>
        </select>
      </div>
      <button class="btn-refresh" id="btnRefresh"><i class="bi bi-arrow-clockwise"></i> Actualizar</button>
    </section>

    <!-- Main Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Chart 1: Sentimiento por Fuente -->
      <div class="chart-card">
        <div class="card-header">
          <h3><i class="bi bi-phone"></i> Sentimiento por Fuente</h3>
          <span class="chart-info" title="Análisis de sentimiento promedio por canal"><i class="bi bi-info-circle"></i></span>
        </div>
        <canvas id="sentimentBySourceChart"></canvas>
      </div>

      <!-- Chart 2: Distribución de Clasificaciones -->
      <div class="chart-card">
        <div class="card-header">
          <h3><i class="bi bi-bullseye"></i> Distribución de Clasificaciones</h3>
          <span class="chart-info" title="Porcentaje de opiniones positivas, neutras y negativas"><i class="bi bi-info-circle"></i></span>
        </div>
        <canvas id="classificationChart"></canvas>
      </div>

      <!-- Chart 3: Tendencia Temporal -->
      <div class="chart-card chart-wide">
        <div class="card-header">
          <h3><i class="bi bi-graph-up"></i> Tendencia de Opiniones en el Tiempo</h3>
          <span class="chart-info" title="Evolución mensual de opiniones"><i class="bi bi-info-circle"></i></span>
        </div>
        <canvas id="temporalTrendChart"></canvas>
      </div>

      <!-- Chart 4: Rating Promedio por Producto -->
      <div class="chart-card">
        <div class="card-header">
          <h3><i class="bi bi-star-fill"></i> Top 10 Productos por Rating</h3>
          <span class="chart-info" title="Productos con mejor calificación"><i class="bi bi-info-circle"></i></span>
        </div>
        <canvas id="productRatingChart"></canvas>
      </div>

      <!-- Chart 5: Satisfacción por Canal -->
      <div class="chart-card">
        <div class="card-header">
          <h3><i class="bi bi-bar-chart-fill"></i> Satisfacción por Canal</h3>
          <span class="chart-info" title="Puntuación promedio de satisfacción (1-10)"><i class="bi bi-info-circle"></i></span>
        </div>
        <canvas id="satisfactionChart"></canvas>
      </div>

      <!-- Chart 6: Volumen de Opiniones por Fuente -->
      <div class="chart-card chart-wide">
        <div class="card-header">
          <h3><i class="bi bi-pie-chart-fill"></i> Volumen de Opiniones por Fuente</h3>
          <span class="chart-info" title="Cantidad de opiniones por cada canal"><i class="bi bi-info-circle"></i></span>
        </div>
        <canvas id="volumeBySourceChart"></canvas>
      </div>

      <!-- Chart 7: Sentimiento Score Distribution -->
      <div class="chart-card">
        <div class="card-header">
          <h3><i class="bi bi-graph-down"></i> Distribución de Sentiment Score</h3>
          <span class="chart-info" title="Histograma de scores de sentimiento (-1 a 1)"><i class="bi bi-info-circle"></i></span>
        </div>
        <canvas id="sentimentDistributionChart"></canvas>
      </div>

      <!-- Chart 8: Análisis por Categoría -->
      <div class="chart-card">
        <div class="card-header">
          <h3><i class="bi bi-tags-fill"></i> Análisis por Categoría de Producto</h3>
          <span class="chart-info" title="Opiniones agrupadas por categoría"><i class="bi bi-info-circle"></i></span>
        </div>
        <canvas id="categoryAnalysisChart"></canvas>
      </div>
    </div>

    <!-- Footer -->
    <footer class="dashboard-footer">
      <p><i class="bi bi-c-circle"></i> 2025 OpinionDW Dashboard | Última actualización: <span id="lastUpdate"></span></p>
      <p>ITLA - Electiva 1: Big Data | Unidad 9: Visualización de Datos</p>
    </footer>
  </div>
`;

// Función para actualizar las estadísticas del header
function updateHeaderStats(data) {
  document.getElementById('totalOpiniones').textContent = data.totalOpiniones.toLocaleString();
  document.getElementById('avgSentiment').textContent = `+${data.avgSentiment.toFixed(2)}`;
  document.getElementById('avgRating').textContent = data.avgRating.toFixed(1);
}

// Función para actualizar la fecha de última actualización
function updateLastUpdate() {
  const now = new Date();
  const formatted = now.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById('lastUpdate').textContent = formatted;
}

// Función para inicializar todos los gráficos con datos de la API
function initializeAllCharts(data) {
  Charts.createSentimentBySourceChart(data.sentimentBySource);
  Charts.createClassificationChart(data.classification);
  Charts.createTemporalTrendChart(data.temporalTrend);
  Charts.createProductRatingChart(data.topProducts);
  Charts.createSatisfactionChart(data.satisfactionByChannel);
  Charts.createVolumeBySourceChart(data.volumeBySource);
  Charts.createSentimentDistributionChart(data.sentimentDistribution);
  Charts.createCategoryAnalysisChart(data.categoryAnalysis);
}

// Función para manejar filtros
async function handleFilters() {
  const filterFuente = document.getElementById('filterFuente').value;
  const filterPeriodo = document.getElementById('filterPeriodo').value;
  const filterClasificacion = document.getElementById('filterClasificacion').value;

  console.log('Filtros aplicados:', {
    fuente: filterFuente,
    periodo: filterPeriodo,
    clasificacion: filterClasificacion
  });

  try {
    // Cargar datos filtrados de la API
    dashboardData = await applyFilters(filterFuente, filterPeriodo, filterClasificacion);
    updateHeaderStats(dashboardData);
    initializeAllCharts(dashboardData);
  } catch (error) {
    console.error('Error aplicando filtros:', error);
    alert('Error al aplicar filtros. Verifica que la API esté corriendo.');
  }
}

// Función para refrescar el dashboard
async function handleRefresh() {
  console.log('Refrescando dashboard...');
  
  const btnRefresh = document.getElementById('btnRefresh');
  const originalText = btnRefresh.innerHTML;
  btnRefresh.innerHTML = '<i class="bi bi-hourglass-split"></i> Actualizando...';
  btnRefresh.disabled = true;

  try {
    dashboardData = await refreshData();
    updateHeaderStats(dashboardData);
    updateLastUpdate();
    initializeAllCharts(dashboardData);
    
    btnRefresh.innerHTML = originalText;
    btnRefresh.disabled = false;
  } catch (error) {
    console.error('Error refrescando datos:', error);
    alert('Error al actualizar. Verifica que la API esté corriendo.');
    btnRefresh.innerHTML = originalText;
    btnRefresh.disabled = false;
  }
}

async function initDashboard() {
  console.log('🚀 Inicializando Dashboard de Opiniones...');
  
  try {
    console.log('📡 Conectando con API en https://localhost:7085/api...');
    dashboardData = await loadAllData();
    
    updateHeaderStats(dashboardData);
    updateLastUpdate();
    
    document.getElementById('filterFuente').addEventListener('change', handleFilters);
    document.getElementById('filterPeriodo').addEventListener('change', handleFilters);
    document.getElementById('filterClasificacion').addEventListener('change', handleFilters);
    document.getElementById('btnRefresh').addEventListener('click', handleRefresh);
    
    setTimeout(() => {
      initializeAllCharts(dashboardData);
      console.log('✅ Dashboard inicializado correctamente con datos de la API');
    }, 100);
    
  } catch (error) {
    console.error('❌ Error inicializando dashboard:', error);
    alert('Error al cargar el dashboard. Verifica que el API esté ejecutándose.');
  }
}

initDashboard();

window.applyFilters = handleFilters;
window.refreshDashboard = handleRefresh;
