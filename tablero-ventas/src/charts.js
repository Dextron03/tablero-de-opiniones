import Chart from 'chart.js/auto';

// Configuración de colores del tema
const colors = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
};

// Almacenar instancias de gráficos
const chartInstances = {};

// Función para destruir un gráfico existente
function destroyChart(chartId) {
  if (chartInstances[chartId]) {
    chartInstances[chartId].destroy();
    delete chartInstances[chartId];
  }
}

// 1. Gráfico de Sentimiento por Fuente (Horizontal Bar)
export function createSentimentBySourceChart(data) {
  destroyChart('sentimentBySourceChart');
  
  const ctx = document.getElementById('sentimentBySourceChart');

  chartInstances['sentimentBySourceChart'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.fuente),
      datasets: [{
        label: 'Sentiment Score',
        data: data.map(d => d.sentiment),
        backgroundColor: data.map(d => 
          d.sentiment > 0.5 ? colors.success :
          d.sentiment > 0.3 ? colors.warning :
          colors.danger
        ),
        borderRadius: 8,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `Sentiment: ${context.parsed.x.toFixed(2)}`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 1,
          grid: { display: false }
        }
      }
    }
  });
}

// 2. Gráfico de Distribución de Clasificaciones (Doughnut)
export function createClassificationChart(data) {
  destroyChart('classificationChart');
  
  const ctx = document.getElementById('classificationChart');

  chartInstances['classificationChart'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.tipo),
      datasets: [{
        data: data.map(d => d.count),
        backgroundColor: [colors.success, colors.warning, colors.danger],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label;
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// 3. Gráfico de Tendencia Temporal (Line)
export function createTemporalTrendChart(data) {
  destroyChart('temporalTrendChart');
  
  const ctx = document.getElementById('temporalTrendChart');

  chartInstances['temporalTrendChart'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.mes),
      datasets: [
        {
          label: 'Positivas',
          data: data.map(d => d.positivas),
          borderColor: colors.success,
          backgroundColor: colors.success + '20',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Neutras',
          data: data.map(d => d.neutras),
          borderColor: colors.warning,
          backgroundColor: colors.warning + '20',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Negativas',
          data: data.map(d => d.negativas),
          borderColor: colors.danger,
          backgroundColor: colors.danger + '20',
          fill: true,
          tension: 0.4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

// 4. Gráfico de Top 10 Productos por Rating (Bar)
export function createProductRatingChart(data) {
  destroyChart('productRatingChart');
  
  const ctx = document.getElementById('productRatingChart');

  chartInstances['productRatingChart'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.producto),
      datasets: [{
        label: 'Rating',
        data: data.map(d => d.rating),
        backgroundColor: colors.primary,
        borderRadius: 8,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const product = data[context.dataIndex];
              return [
                `Rating: ${product.rating} ⭐`,
                `Reviews: ${product.reviews.toLocaleString()}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 5,
          grid: { display: false }
        }
      }
    }
  });
}

// 5. Gráfico de Satisfacción por Canal (Radar)
export function createSatisfactionChart(data) {
  destroyChart('satisfactionChart');
  
  const ctx = document.getElementById('satisfactionChart');

  chartInstances['satisfactionChart'] = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: data.map(d => d.canal),
      datasets: [{
        label: 'Satisfacción (1-10)',
        data: data.map(d => d.satisfaction),
        backgroundColor: colors.secondary + '40',
        borderColor: colors.secondary,
        pointBackgroundColor: colors.secondary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colors.secondary,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          ticks: { stepSize: 2 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// 6. Gráfico de Volumen de Opiniones por Fuente (Pie)
export function createVolumeBySourceChart(data) {
  destroyChart('volumeBySourceChart');
  
  const ctx = document.getElementById('volumeBySourceChart');

  chartInstances['volumeBySourceChart'] = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.map(d => d.fuente),
      datasets: [{
        data: data.map(d => d.count),
        backgroundColor: [colors.primary, colors.secondary, colors.info],
        borderWidth: 2,
        borderColor: '#fff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label;
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// 7. Gráfico de Distribución de Sentiment Score (Bar)
export function createSentimentDistributionChart(data) {
  destroyChart('sentimentDistributionChart');
  
  const ctx = document.getElementById('sentimentDistributionChart');

  chartInstances['sentimentDistributionChart'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.range),
      datasets: [{
        label: 'Cantidad',
        data: data.map(d => d.count),
        backgroundColor: [
          colors.danger,
          colors.warning + 'cc',
          colors.warning,
          colors.success + 'cc',
          colors.success
        ],
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

// 8. Gráfico de Análisis por Categoría (Mixed: Bar + Line)
export function createCategoryAnalysisChart(data) {
  destroyChart('categoryAnalysisChart');
  
  const ctx = document.getElementById('categoryAnalysisChart');

  chartInstances['categoryAnalysisChart'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.categoria),
      datasets: [
        {
          label: 'Cantidad de Opiniones',
          data: data.map(d => d.count),
          backgroundColor: colors.primary + '80',
          borderRadius: 8,
          yAxisID: 'y',
        },
        {
          label: 'Sentiment Promedio',
          data: data.map(d => d.avgSentiment),
          type: 'line',
          borderColor: colors.danger,
          backgroundColor: colors.danger,
          pointRadius: 5,
          pointHoverRadius: 7,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad de Opiniones'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          beginAtZero: true,
          max: 1,
          title: {
            display: true,
            text: 'Sentiment Score'
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

// Función para inicializar todos los gráficos
export function initializeAllCharts() {
  createSentimentBySourceChart();
  createClassificationChart();
  createTemporalTrendChart();
  createProductRatingChart();
  createSatisfactionChart();
  createVolumeBySourceChart();
  createSentimentDistributionChart();
  createCategoryAnalysisChart();
}

// Función para actualizar todos los gráficos
export function updateAllCharts() {
  initializeAllCharts();
}
