using Microsoft.EntityFrameworkCore;
using OpinionDW.API.Models;

namespace OpinionDW.API.Data
{
    public class OpinionDWContext : DbContext
    {
        public OpinionDWContext(DbContextOptions<OpinionDWContext> options)
            : base(options)
        {
        }

        public DbSet<FactOpinion> FactOpiniones { get; set; }
        public DbSet<DimFecha> DimFecha { get; set; }
        public DbSet<DimCliente> DimCliente { get; set; }
        public DbSet<DimProducto> DimProducto { get; set; }
        public DbSet<DimFuente> DimFuente { get; set; }
        public DbSet<DimClasificacion> DimClasificacion { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FactOpinion>()
                .ToTable("FactOpiniones")
                .HasKey(f => f.OpinionKey);

            modelBuilder.Entity<DimFecha>()
                .ToTable("DimFecha")
                .HasKey(d => d.FechaKey);

            modelBuilder.Entity<DimCliente>()
                .ToTable("DimCliente")
                .HasKey(d => d.ClienteKey);

            modelBuilder.Entity<DimProducto>()
                .ToTable("DimProducto")
                .HasKey(d => d.ProductoKey);

            modelBuilder.Entity<DimFuente>()
                .ToTable("DimFuente")
                .HasKey(d => d.FuenteKey);

            modelBuilder.Entity<DimClasificacion>()
                .ToTable("DimClasificacion")
                .HasKey(d => d.ClasificacionKey);

            base.OnModelCreating(modelBuilder);
        }
    }
}
