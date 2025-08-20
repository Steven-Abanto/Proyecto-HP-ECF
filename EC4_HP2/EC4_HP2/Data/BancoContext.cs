using Microsoft.EntityFrameworkCore;
using EC4_HP2.Models;
using System.Text.Json.Serialization;

namespace EC4_HP2.Data
{
    public class BancoContext : DbContext
    {
        public BancoContext(DbContextOptions<BancoContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Cuenta> Cuentas { get; set; } = null!;
        public DbSet<Movimiento> Movimientos { get; set; } = null!;
        public DbSet<Prestamo> Prestamos { get; set; } = null!;
        public DbSet<PrestamoDetalle> PrestamoDetalles { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Tablas
            modelBuilder.Entity<Usuario>().ToTable("usuarios").HasKey(u => u.UidUsuario);
            modelBuilder.Entity<Cuenta>().ToTable("cuentas").HasKey(c => c.UidCuenta);
            modelBuilder.Entity<Movimiento>().ToTable("movimiento").HasKey(m => m.UidMovimiento);
            modelBuilder.Entity<Prestamo>().ToTable("prestamos").HasKey(p => p.UidPrestamo);
            modelBuilder.Entity<PrestamoDetalle>().ToTable("prestamo_detalle").HasKey(d => d.UidDetalle);

            // Propiedades decimal
            modelBuilder.Entity<Cuenta>().Property(c => c.Saldo).HasColumnType("decimal(15,2)");
            modelBuilder.Entity<Movimiento>().Property(m => m.Monto).HasColumnType("decimal(15,2)");
            modelBuilder.Entity<Prestamo>().Property(p => p.MontoPrestamo).HasColumnType("decimal(15,2)");
            modelBuilder.Entity<PrestamoDetalle>().Property(d => d.MontoPrestamo).HasColumnType("decimal(15,2)");
            modelBuilder.Entity<PrestamoDetalle>().Property(d => d.DeudaCuota).HasColumnType("decimal(15,2)");
            modelBuilder.Entity<PrestamoDetalle>().Property(d => d.DeudaTotal).HasColumnType("decimal(15,2)");
            modelBuilder.Entity<PrestamoDetalle>().Property(d => d.TasaInt).HasColumnType("decimal(5,2)");

            // Relaciones
            modelBuilder.Entity<Cuenta>()
                .HasOne(c => c.UidUsuarioNavigation)
                .WithMany(u => u.Cuentas)
                .HasForeignKey(c => c.UidUsuario);

            modelBuilder.Entity<Movimiento>()
                .HasOne(m => m.CuentaOrigenNavigation)
                .WithMany(c => c.MovimientosOrigen)
                .HasForeignKey(m => m.CuentaOrigen)
                .HasPrincipalKey(c => c.NroCuenta)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Movimiento>()
                .HasOne(m => m.CuentaDestinNavigation)
                .WithMany(c => c.MovimientosDestino)
                .HasForeignKey(m => m.CuentaDestin)
                .HasPrincipalKey(c => c.NroCuenta)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PrestamoDetalle>()
                .HasOne(d => d.NroCuentaNavigation)
                .WithMany(c => c.PrestamoDetalles)
                .HasForeignKey(d => d.NroCuenta)
                .HasPrincipalKey(c => c.NroCuenta)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PrestamoDetalle>()
                .HasOne(d => d.UidPrestamoNavigation)
                .WithMany(p => p.PrestamoDetalles)
                .HasForeignKey(d => d.UidPrestamo)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
