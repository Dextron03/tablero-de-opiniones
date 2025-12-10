using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OpinionDW.API.Models
{
    [Table("FactOpiniones")]
    public class FactOpinion
    {
        [Key]
        public long OpinionKey { get; set; }
        
        public int FechaKey { get; set; }
        public int ClienteKey { get; set; }
        public int ProductoKey { get; set; }
        public int FuenteKey { get; set; }
        public int? ClasificacionKey { get; set; }
        
        public int? Rating { get; set; }
        public int? PuntajeSatisfaccion { get; set; }
        
        [Column(TypeName = "decimal(5,2)")]
        public decimal? SentimentScore { get; set; }
    }

    [Table("DimFecha")]
    public class DimFecha
    {
        [Key]
        public int FechaKey { get; set; }
        
        public DateTime Fecha { get; set; }
        public int Dia { get; set; }
        public int Mes { get; set; }
        public int Anio { get; set; }
        public int Trimestre { get; set; }
        public int DiaDeLaSemana { get; set; }
    }

    [Table("DimCliente")]
    public class DimCliente
    {
        [Key]
        public int ClienteKey { get; set; }
        
        public string IdCliente { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
    }

    [Table("DimProducto")]
    public class DimProducto
    {
        [Key]
        public int ProductoKey { get; set; }
        
        public string IdProducto { get; set; }
        public string NombreProducto { get; set; }
        public string NombreCategoria { get; set; }
    }

    [Table("DimFuente")]
    public class DimFuente
    {
        [Key]
        public int FuenteKey { get; set; }
        
        public string NombreFuente { get; set; }
    }

    [Table("DimClasificacion")]
    public class DimClasificacion
    {
        [Key]
        public int ClasificacionKey { get; set; }
        
        public string NombreClasificacion { get; set; }
    }
}
