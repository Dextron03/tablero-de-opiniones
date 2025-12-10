namespace OpinionDW.API.DTOs
{
    public class StatsDTO
    {
        public int TotalOpiniones { get; set; }
        public decimal AvgSentiment { get; set; }
        public decimal AvgRating { get; set; }
    }

    public class SentimentBySourceDTO
    {
        public string Fuente { get; set; }
        public decimal Sentiment { get; set; }
        public int Count { get; set; }
    }

    public class ClassificationDTO
    {
        public string Tipo { get; set; }
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }

    public class TemporalTrendDTO
    {
        public string Mes { get; set; }
        public int Positivas { get; set; }
        public int Neutras { get; set; }
        public int Negativas { get; set; }
    }

    public class TopProductDTO
    {
        public string Producto { get; set; }
        public decimal Rating { get; set; }
        public int Reviews { get; set; }
    }

    public class SatisfactionDTO
    {
        public string Canal { get; set; }
        public decimal Satisfaction { get; set; }
    }

    public class VolumeBySourceDTO
    {
        public string Fuente { get; set; }
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }

    public class SentimentDistributionDTO
    {
        public string Range { get; set; }
        public int Count { get; set; }
    }

    public class CategoryAnalysisDTO
    {
        public string Categoria { get; set; }
        public decimal AvgSentiment { get; set; }
        public int Count { get; set; }
    }
}
