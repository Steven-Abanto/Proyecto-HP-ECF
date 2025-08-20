using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EC4_HP2.Models
{
    [Table("usuarios")]
    public class Usuario
    {
        [Key]
        [Column("uid_usuario")]
        public int UidUsuario { get; set; }

        [Column("tipo_documento")]
        public string TipoDocumento { get; set; } = null!;

        [Column("nro_documento")]
        public string NroDocumento { get; set; } = null!;

        [Column("nombres")]
        public string Nombres { get; set; } = null!;

        [Column("contrasenha")]
        public string Contrasenha { get; set; } = null!;

        public ICollection<Cuenta> Cuentas { get; set; } = new List<Cuenta>();
    }
}
