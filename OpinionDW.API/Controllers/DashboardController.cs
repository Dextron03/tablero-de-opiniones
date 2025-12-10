using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OpinionDW.API.Data;
using OpinionDW.API.DTOs;

namespace OpinionDW.API.Controllers
{
    [ApiController]
    [Route("api")]
    public class DashboardController : ControllerBase
    {
        private readonly OpinionDWContext _context;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(OpinionDWContext context, ILogger<DashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<StatsDTO>> GetStats()
        {
            try
            {
                var stats = new StatsDTO
                {
                    TotalOpiniones = await _context.FactOpiniones.CountAsync(),
                    AvgSentiment = await _context.FactOpiniones
                        .Where(f => f.SentimentScore != null)
                        .AverageAsync(f => (decimal)f.SentimentScore),
                    AvgRating = await _context.FactOpiniones
                        .Where(f => f.Rating != null)
                        .AverageAsync(f => (decimal)f.Rating)
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting stats");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("sentiment-by-source")]
        public async Task<ActionResult<List<SentimentBySourceDTO>>> GetSentimentBySource()
        {
            try
            {
                var result = await _context.FactOpiniones
                    .Join(_context.DimFuente,
                        f => f.FuenteKey,
                        d => d.FuenteKey,
                        (f, d) => new { Fact = f, Fuente = d })
                    .GroupBy(x => x.Fuente.NombreFuente)
                    .Select(g => new SentimentBySourceDTO
                    {
                        Fuente = g.Key,
                        Sentiment = g.Average(x => (decimal)x.Fact.SentimentScore),
                        Count = g.Count()
                    })
                    .OrderByDescending(x => x.Sentiment)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sentiment by source");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("classification")]
        public async Task<ActionResult<List<ClassificationDTO>>> GetClassification()
        {
            try
            {
                var total = await _context.FactOpiniones.CountAsync();
                
                var result = await _context.FactOpiniones
                    .Join(_context.DimClasificacion,
                        f => f.ClasificacionKey,
                        d => d.ClasificacionKey,
                        (f, d) => new { Fact = f, Clasificacion = d })
                    .GroupBy(x => x.Clasificacion.NombreClasificacion)
                    .Select(g => new ClassificationDTO
                    {
                        Tipo = g.Key,
                        Count = g.Count(),
                        Percentage = (decimal)g.Count() * 100 / total
                    })
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting classification");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("temporal-trend")]
        public async Task<ActionResult<List<TemporalTrendDTO>>> GetTemporalTrend()
        {
            try
            {
                var last12Months = DateTime.Now.AddMonths(-12);
                
                FormattableString query = $@"
                    SELECT 
                        DATENAME(MONTH, d.Fecha) + ' ' + CAST(d.Anio AS NVARCHAR(4)) AS Mes,
                        COUNT(CASE WHEN c.NombreClasificacion = 'Positiva' THEN 1 END) AS Positivas,
                        COUNT(CASE WHEN c.NombreClasificacion = 'Neutra' THEN 1 END) AS Neutras,
                        COUNT(CASE WHEN c.NombreClasificacion = 'Negativa' THEN 1 END) AS Negativas
                    FROM FactOpiniones f
                    INNER JOIN DimFecha d ON f.FechaKey = d.FechaKey
                    LEFT JOIN DimClasificacion c ON f.ClasificacionKey = c.ClasificacionKey
                    WHERE d.Fecha >= {last12Months}
                    GROUP BY d.Anio, d.Mes, DATENAME(MONTH, d.Fecha)
                    ORDER BY d.Anio, d.Mes";

                var result = await _context.Database
                    .SqlQuery<TemporalTrendDTO>(query)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting temporal trend");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("top-products")]
        public async Task<ActionResult<List<TopProductDTO>>> GetTopProducts()
        {
            try
            {
                var result = await _context.FactOpiniones
                    .Where(f => f.Rating != null)
                    .Join(_context.DimProducto,
                        f => f.ProductoKey,
                        p => p.ProductoKey,
                        (f, p) => new { Fact = f, Producto = p })
                    .GroupBy(x => x.Producto.NombreProducto)
                    .Select(g => new TopProductDTO
                    {
                        Producto = g.Key,
                        Rating = g.Average(x => (decimal)x.Fact.Rating),
                        Reviews = g.Count()
                    })
                    .OrderByDescending(x => x.Rating)
                    .Take(10)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting top products");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("satisfaction")]
        public async Task<ActionResult<List<SatisfactionDTO>>> GetSatisfaction()
        {
            try
            {
                var result = await _context.FactOpiniones
                    .Where(f => f.PuntajeSatisfaccion != null)
                    .Join(_context.DimFuente,
                        f => f.FuenteKey,
                        d => d.FuenteKey,
                        (f, d) => new { Fact = f, Fuente = d })
                    .GroupBy(x => x.Fuente.NombreFuente)
                    .Select(g => new SatisfactionDTO
                    {
                        Canal = g.Key,
                        Satisfaction = g.Average(x => (decimal)x.Fact.PuntajeSatisfaccion)
                    })
                    .OrderByDescending(x => x.Satisfaction)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting satisfaction");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("volume-by-source")]
        public async Task<ActionResult<List<VolumeBySourceDTO>>> GetVolumeBySource()
        {
            try
            {
                var total = await _context.FactOpiniones.CountAsync();
                
                var result = await _context.FactOpiniones
                    .Join(_context.DimFuente,
                        f => f.FuenteKey,
                        d => d.FuenteKey,
                        (f, d) => new { Fact = f, Fuente = d })
                    .GroupBy(x => x.Fuente.NombreFuente)
                    .Select(g => new VolumeBySourceDTO
                    {
                        Fuente = g.Key,
                        Count = g.Count(),
                        Percentage = (decimal)g.Count() * 100 / total
                    })
                    .OrderByDescending(x => x.Count)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting volume by source");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("sentiment-distribution")]
        public async Task<ActionResult<List<SentimentDistributionDTO>>> GetSentimentDistribution()
        {
            try
            {
                var opiniones = await _context.FactOpiniones
                    .Where(f => f.SentimentScore != null)
                    .Select(f => f.SentimentScore)
                    .ToListAsync();

                var result = new List<SentimentDistributionDTO>
                {
                    new SentimentDistributionDTO { Range = "-1.0 a -0.6", Count = opiniones.Count(s => s >= -1.0m && s < -0.6m) },
                    new SentimentDistributionDTO { Range = "-0.6 a -0.2", Count = opiniones.Count(s => s >= -0.6m && s < -0.2m) },
                    new SentimentDistributionDTO { Range = "-0.2 a 0.2", Count = opiniones.Count(s => s >= -0.2m && s < 0.2m) },
                    new SentimentDistributionDTO { Range = "0.2 a 0.6", Count = opiniones.Count(s => s >= 0.2m && s < 0.6m) },
                    new SentimentDistributionDTO { Range = "0.6 a 1.0", Count = opiniones.Count(s => s >= 0.6m && s <= 1.0m) }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sentiment distribution");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("category-analysis")]
        public async Task<ActionResult<List<CategoryAnalysisDTO>>> GetCategoryAnalysis()
        {
            try
            {
                var result = await _context.FactOpiniones
                    .Join(_context.DimProducto,
                        f => f.ProductoKey,
                        p => p.ProductoKey,
                        (f, p) => new { Fact = f, Producto = p })
                    .GroupBy(x => x.Producto.NombreCategoria)
                    .Select(g => new CategoryAnalysisDTO
                    {
                        Categoria = g.Key,
                        AvgSentiment = g.Average(x => (decimal)x.Fact.SentimentScore),
                        Count = g.Count()
                    })
                    .OrderByDescending(x => x.Count)
                    .ToListAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting category analysis");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
