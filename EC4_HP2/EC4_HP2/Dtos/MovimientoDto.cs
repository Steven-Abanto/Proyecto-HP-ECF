namespace EC4_HP2.Dtos
{
    public class MovimientoDto
    {
        public int UidMovimiento { get; set; }
        public string CuentaOrigen { get; set; } = null!;
        public string CuentaDestino { get; set; } = null!;
        public decimal Monto { get; set; }

        //Fecha del movimiento, puede ser null si no se especifica y se asigna la fecha actual en el Controller
        public DateTime? Fecha { get; set; } 
    }
}
