using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EC4_HP2.Models
{
    [Table("movimiento")]
    public class Movimiento
    {
        [Key]
        [Column("uid_movimiento")]
        public int UidMovimiento { get; set; }

        [Column("cuenta_origen")]
        public string CuentaOrigen { get; set; } = null!;

        [Column("cuenta_destin")]
        public string CuentaDestin { get; set; } = null!;

        [Column("monto")]
        public decimal Monto { get; set; }

        [Column("fecha")]
        public DateTime? Fecha { get; set; }

        [ForeignKey("CuentaOrigen")]
        public Cuenta CuentaOrigenNavigation { get; set; } = null!;

        [ForeignKey("CuentaDestin")]
        public Cuenta CuentaDestinNavigation { get; set; } = null!;
    }
}
