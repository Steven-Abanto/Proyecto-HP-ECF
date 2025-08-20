using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EC4_HP2.Data;
using EC4_HP2.Models;
using EC4_HP2.Dtos;

[Route("api/[controller]")]
[ApiController]
public class CuentaController : ControllerBase
{
    private readonly BancoContext _context;

    public CuentaController(BancoContext context)
    {
        _context = context;
    }

    // GET: api/Cuenta
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CuentaDto>>> GetCuentas()
    {
        return await _context.Cuentas
            .Select(c => new CuentaDto
            {
                UidCuenta = c.UidCuenta,
                NroCuenta = c.NroCuenta,
                TipoCuenta = c.TipoCuenta,
                Saldo = c.Saldo,
                CompraInt = c.CompraInt,
                UidUsuario = c.UidUsuario
            }).ToListAsync();
    }

    // GET: api/Cuenta/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CuentaDto>> GetCuenta(int id)
    {
        var cuenta = await _context.Cuentas
            .Where(c => c.UidCuenta == id)
            .Select(c => new CuentaDto
            {
                UidCuenta = c.UidCuenta,
                NroCuenta = c.NroCuenta,
                TipoCuenta = c.TipoCuenta,
                Saldo = c.Saldo,
                CompraInt = c.CompraInt,
                UidUsuario = c.UidUsuario
            })
            .FirstOrDefaultAsync();

        if (cuenta == null)
            return NotFound();

        return cuenta;
    }

    // POST: api/Cuenta
    [HttpPost]
    public async Task<ActionResult<CuentaDto>> CrearCuenta(CuentaDto dto)
    {
        var cuenta = new Cuenta
        {
            NroCuenta = dto.NroCuenta,
            TipoCuenta = dto.TipoCuenta,
            Saldo = dto.Saldo,
            CompraInt = dto.CompraInt,
            UidUsuario = dto.UidUsuario
        };

        _context.Cuentas.Add(cuenta);
        await _context.SaveChangesAsync();

        dto.UidCuenta = cuenta.UidCuenta;
        return CreatedAtAction(nameof(GetCuenta), new { id = dto.UidCuenta }, dto);
    }

    // PUT: api/Cuenta/5
    [HttpPut("{id}")]
    public async Task<ActionResult<CuentaDto>> ActualizarCuenta(int id, CuentaDto dto)
    {
        if (id != dto.UidCuenta)
            return BadRequest();

        var cuenta = await _context.Cuentas.FindAsync(id);
        if (cuenta == null)
            return NotFound();

        // No modificamos NroCuenta si es clave primaria
        cuenta.TipoCuenta = dto.TipoCuenta;
        cuenta.Saldo = dto.Saldo;
        cuenta.CompraInt = dto.CompraInt;
        cuenta.UidUsuario = dto.UidUsuario;

        _context.Entry(cuenta).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        // Devolvemos el DTO actualizado
        var updatedDto = new CuentaDto
        {
            UidCuenta = cuenta.UidCuenta,
            NroCuenta = cuenta.NroCuenta,
            TipoCuenta = cuenta.TipoCuenta,
            Saldo = cuenta.Saldo,
            CompraInt = cuenta.CompraInt,
            UidUsuario = cuenta.UidUsuario
        };

        return Ok(updatedDto); // HTTP 200 con JSON
    }


    // DELETE: api/Cuenta/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarCuenta(int id)
    {
        var cuenta = await _context.Cuentas.FindAsync(id);
        if (cuenta == null)
            return NotFound();

        _context.Cuentas.Remove(cuenta);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/Cuenta/by-user/5
    [HttpGet("by-user/{uidUsuario:int}")]
    public async Task<ActionResult<IEnumerable<CuentaDto>>> GetCuentasByUser(int uidUsuario)
    {
        var cuentas = await _context.Cuentas
            .AsNoTracking()
            .Where(c => c.UidUsuario == uidUsuario)
            .Select(c => new CuentaDto
            {
                UidCuenta = c.UidCuenta,
                NroCuenta = c.NroCuenta,
                TipoCuenta = c.TipoCuenta,
                Saldo = c.Saldo,
                CompraInt = c.CompraInt,
                UidUsuario = c.UidUsuario
            })
            .ToListAsync();

        return Ok(cuentas);
    }
}
