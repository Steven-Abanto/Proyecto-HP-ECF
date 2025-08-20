namespace EC4_HP2.Dtos
{
    public class MovimientoDto
    {
        public int UidMovimiento { get; set; }
        public string CuentaOrigen { get; set; } = null!;
        public string CuentaDestino { get; set; } = null!;
        public decimal Monto { get; set; }
        public DateTime? Fecha { get; set; } // nullable para evitar errores
    }
}
