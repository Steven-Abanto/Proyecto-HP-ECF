using System.ComponentModel.DataAnnotations;

namespace EC4_HP2.Dtos
{
    public class PrestamoDetalleDto
    {
        public int UidDetalle { get; set; }

        [Required] public int UidPrestamo { get; set; }
        [Required, RegularExpression(@"^\d{18}$")]
        public string NroCuenta { get; set; } = null!;

        [Range(0.01, double.MaxValue)]
        public decimal MontoPrestamo { get; set; }

        [Range(0, double.MaxValue)]
        public decimal TasaInt { get; set; }

        [Range(1, int.MaxValue)]
        public int Cuotas { get; set; }

        [Range(0, double.MaxValue)]
        public decimal DeudaCuota { get; set; }

        [Range(0, double.MaxValue)]
        public decimal DeudaTotal { get; set; }

        public DateTime Fecha { get; set; }
    }
}