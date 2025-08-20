using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EC4_HP2.Models
{
    [Table("prestamo_detalle")]
    public class PrestamoDetalle
    {
        [Key]
        [Column("uid_detalle")]
        public int UidDetalle { get; set; }

        [Column("uid_prestamo")]
        public int UidPrestamo { get; set; }

        [Column("nro_cuenta")]
        public string NroCuenta { get; set; } = null!;

        [Column("monto_prestamo")]
        public decimal MontoPrestamo { get; set; }

        [Column("tasa_int")]
        public decimal TasaInt { get; set; }

        [Column("cuotas")]
        public int Cuotas { get; set; }

        [Column("deuda_cuota")]
        public decimal DeudaCuota { get; set; }

        [Column("deuda_total")]
        public decimal DeudaTotal { get; set; }

        [Column("fecha")]
        public DateTime Fecha { get; set; }

        [ForeignKey("NroCuenta")]
        public Cuenta NroCuentaNavigation { get; set; } = null!;

        [ForeignKey("UidPrestamo")]
        public Prestamo UidPrestamoNavigation { get; set; } = null!;
    }
}
