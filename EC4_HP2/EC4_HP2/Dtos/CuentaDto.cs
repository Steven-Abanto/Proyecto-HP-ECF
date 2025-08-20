namespace EC4_HP2.Dtos
{
    public class CuentaDto
    {
        public int UidCuenta { get; set; }
        public string NroCuenta { get; set; } = null!;
        public string TipoCuenta { get; set; } = null!;
        public decimal Saldo { get; set; }
        public bool CompraInt { get; set; }
        public int UidUsuario { get; set; }
    }
}
