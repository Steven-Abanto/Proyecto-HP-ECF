using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EC4_HP2.Models
{
    [Table("prestamos")]
    public class Prestamo
    {
        [Key]
        [Column("uid_prestamo")]
        public int UidPrestamo { get; set; }

        [Column("tipo_prestamo")]
        public string TipoPrestamo { get; set; } = null!;

        [Column("monto_prestamo")]
        public decimal MontoPrestamo { get; set; }

        [Column("fecha")]
        public DateTime Fecha { get; set; }

        public ICollection<PrestamoDetalle> PrestamoDetalles { get; set; } = new List<PrestamoDetalle>();
    }
}
