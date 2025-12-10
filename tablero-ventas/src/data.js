const API_URL = 'https://localhost:7085/api';

function handleError(error, endpoint) {
  console.error(`❌ Error en ${endpoint}:`, error);
  throw error;
}

export async function fetchStats() {
  try {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error('Error al cargar estadísticas');
    return await response.json();
  } catch (error) {
    return handleError(error, 'stats');
  }
}

export async function fetchSentimentBySource() {
  try {
    const response = await fetch(`${API_URL}/sentiment-by-source`);
    if (!response.ok) throw new Error('Error al cargar sentimiento por fuente');
    return await response.json();
  } catch (error) {
    return handleError(error, 'sentiment-by-source');
  }
}

export async function fetchClassification() {
  try {
    const response = await fetch(`${API_URL}/classification`);
    if (!response.ok) throw new Error('Error al cargar clasificación');
    return await response.json();
  } catch (error) {
    return handleError(error, 'classification');
  }
}

export async function fetchTemporalTrend() {
  try {
    const response = await fetch(`${API_URL}/temporal-trend`);
    if (!response.ok) throw new Error('Error al cargar tendencia temporal');
    return await response.json();
  } catch (error) {
    return handleError(error, 'temporal-trend');
  }
}

export async function fetchTopProducts() {
  try {
    const response = await fetch(`${API_URL}/top-products`);
    if (!response.ok) throw new Error('Error al cargar top productos');
    return await response.json();
  } catch (error) {
    return handleError(error, 'top-products');
  }
}

export async function fetchSatisfaction() {
  try {
    const response = await fetch(`${API_URL}/satisfaction`);
    if (!response.ok) throw new Error('Error al cargar satisfacción');
    return await response.json();
  } catch (error) {
    return handleError(error, 'satisfaction');
  }
}

export async function fetchVolumeBySource() {
  try {
    const response = await fetch(`${API_URL}/volume-by-source`);
    if (!response.ok) throw new Error('Error al cargar volumen');
    return await response.json();
  } catch (error) {
    return handleError(error, 'volume-by-source');
  }
}

export async function fetchSentimentDistribution() {
  try {
    const response = await fetch(`${API_URL}/sentiment-distribution`);
    if (!response.ok) throw new Error('Error al cargar distribución');
    return await response.json();
  } catch (error) {
    return handleError(error, 'sentiment-distribution');
  }
}

export async function fetchCategoryAnalysis() {
  try {
    const response = await fetch(`${API_URL}/category-analysis`);
    if (!response.ok) throw new Error('Error al cargar análisis');
    return await response.json();
  } catch (error) {
    return handleError(error, 'category-analysis');
  }
}

export async function loadAllData() {
  console.log('🔄 Cargando datos de la API ASP.NET...');
  
  const [
    stats,
    sentimentBySource,
    classification,
    temporalTrend,
    topProducts,
    satisfactionByChannel,
    volumeBySource,
    sentimentDistribution,
    categoryAnalysis
  ] = await Promise.all([
    fetchStats(),
    fetchSentimentBySource(),
    fetchClassification(),
    fetchTemporalTrend(),
    fetchTopProducts(),
    fetchSatisfaction(),
    fetchVolumeBySource(),
    fetchSentimentDistribution(),
    fetchCategoryAnalysis()
  ]);

  console.log('✅ Datos cargados exitosamente desde API ASP.NET');

  return {
    totalOpiniones: stats.totalOpiniones,
    avgSentiment: stats.avgSentiment,
    avgRating: stats.avgRating,
    sentimentBySource,
    classification,
    temporalTrend,
    topProducts,
    satisfactionByChannel,
    volumeBySource,
    sentimentDistribution,
    categoryAnalysis
  };
}

export async function applyFilters(fuente, periodo, clasificacion) {
  console.log('Filtros aplicados:', { fuente, periodo, clasificacion });
  return await loadAllData();
}

export async function refreshData() {
  console.log('🔄 Refrescando datos desde API ASP.NET...');
  return await loadAllData();
}
