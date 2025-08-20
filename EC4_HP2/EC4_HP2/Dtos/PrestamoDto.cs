using System;
using System.Collections.Generic;

namespace EC4_HP2.Dtos
{
    public class PrestamoDto
    {
        public int UidPrestamo { get; set; }
        public string TipoPrestamo { get; set; } = null!;
        public decimal MontoPrestamo { get; set; }
        public DateTime Fecha { get; set; }
    }
}

