using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EC4_HP2.Models
{
    [Table("cuentas")]
    public class Cuenta
    {
        [Key]
        [Column("uid_cuenta")]
        public int UidCuenta { get; set; }

        [Column("uid_usuario")]
        public int UidUsuario { get; set; }

        [Column("nro_cuenta")]
        public string NroCuenta { get; set; } = null!;

        [Column("tipo_cuenta")]
        public string TipoCuenta { get; set; } = null!;

        [Column("saldo")]
        public decimal Saldo { get; set; }

        [Column("compra_int")]
        public bool CompraInt { get; set; }

        [ForeignKey("UidUsuario")]
        public Usuario UidUsuarioNavigation { get; set; } = null!;

        public ICollection<Movimiento> MovimientosOrigen { get; set; } = new List<Movimiento>();
        public ICollection<Movimiento> MovimientosDestino { get; set; } = new List<Movimiento>();
        public ICollection<PrestamoDetalle> PrestamoDetalles { get; set; } = new List<PrestamoDetalle>();
    }
}
