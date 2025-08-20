using System.Text.Json.Serialization;
using EC4_HP2.Data;
using EC4_HP2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EC4_HP2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly BancoContext _context;
    public AuthController(BancoContext context) => _context = context;

    // Coincide con el JSON que envía tu Login.jsx: { id, password }
    public sealed class LoginRequest
    {
        [JsonPropertyName("id")] public string Id { get; set; } = string.Empty;
        [JsonPropertyName("password")] public string Password { get; set; } = string.Empty;
    }

    public sealed class LoginResponse
    {
        public int UidUsuario { get; init; }
        public string Nombres { get; init; } = "";
        public string TipoDocumento { get; init; } = "";
        public string NroDocumento { get; init; } = "";
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Id) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "id y password son requeridos." });

        // Buscar por nro_documento
        var user = await _context.Usuarios
            .AsNoTracking()
            .SingleOrDefaultAsync(u => u.NroDocumento == req.Id);

        if (user is null)
            return Unauthorized(new { message = "Usuario o contraseña inválidos." });

        // OJO: en SQL está como CHAR(10) => podría tener espacios de relleno
        var stored = (user.Contrasenha ?? string.Empty).TrimEnd();
        if (!string.Equals(stored, req.Password, StringComparison.Ordinal))
            return Unauthorized(new { message = "Usuario o contraseña inválidos." });

        // (Opcional) Aquí puedes emitir un JWT. Devolvemos datos básicos por ahora.
        return Ok(new LoginResponse
        {
            UidUsuario = user.UidUsuario,
            Nombres = user.Nombres,
            TipoDocumento = user.TipoDocumento,
            NroDocumento = user.NroDocumento
        });
    }
}
