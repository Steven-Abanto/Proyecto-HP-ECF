using System.ComponentModel.DataAnnotations;

namespace EC4_HP2.Dtos
{
    public class MovimientoCreateDto
    {
        [Required, RegularExpression(@"^\d{18}$")]
        public string CuentaOrigen { get; set; } = null!;

        [Required, RegularExpression(@"^\d{18}$")]
        public string CuentaDestino { get; set; } = null!;

        public decimal Monto { get; set; }

        public DateTime? Fecha { get; set; }
    }
}
