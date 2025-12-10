// Script para actualizar charts.js
// Ejecutar: node actualizar-charts.js

const fs = require('fs');
const path = require('path');

const chartsPath = path.join(__dirname, 'charts.js');
let content = fs.readFileSync(chartsPath, 'utf8');

// 1. Eliminar la importación de mockData
content = content.replace("import { mockData } from './data.js';\n", '');

// 2. Cambiar las firmas de las funciones para recibir 'data' como parámetro
const functions = [
  'createClassificationChart',
  'createTemporalTrendChart',
  'createProductRatingChart',
  'createSatisfactionChart',
  'createVolumeBySourceChart',
  'createSentimentDistributionChart',
  'createCategoryAnalysisChart'
];

functions.forEach(funcName => {
  // Cambiar función() por función(data)
  content = content.replace(
    new RegExp(`export function ${funcName}\\(\\) {`, 'g'),
    `export function ${funcName}(data) {`
  );
  
  // Eliminar líneas "const data = mockData.xxx;"
  content = content.replace(
    new RegExp(`\\s*const data = mockData\\.[a-zA-Z]+;\\n`, 'g'),
    '\n'
  );
});

// Guardar archivo actualizado
fs.writeFileSync(chartsPath, content, 'utf8');
console.log('✅ charts.js actualizado exitosamente!');
