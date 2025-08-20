using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EC4_HP2.Data;
using EC4_HP2.Models;
using EC4_HP2.Dtos;

namespace EC4_HP2.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MovimientoController : ControllerBase
{
    private readonly BancoContext _context;

    public MovimientoController(BancoContext context)
    {
        _context = context;
    }

    // GET: api/Movimiento
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MovimientoDto>>> GetMovimientos()
    {
        var movimientos = await _context.Movimientos
            .Include(m => m.CuentaOrigenNavigation)
            .Include(m => m.CuentaDestinNavigation)
            .Select(m => new MovimientoDto
            {
                UidMovimiento = m.UidMovimiento,
                CuentaOrigen = m.CuentaOrigenNavigation.NroCuenta,
                CuentaDestino = m.CuentaDestinNavigation.NroCuenta,
                Monto = m.Monto,
                Fecha = m.Fecha
            })
            .ToListAsync();

        return Ok(movimientos);
    }

    // GET: api/Movimiento/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MovimientoDto>> GetMovimiento(int id)
    {
        var movimiento = await _context.Movimientos
            .Include(m => m.CuentaOrigenNavigation)
            .Include(m => m.CuentaDestinNavigation)
            .Where(m => m.UidMovimiento == id)
            .Select(m => new MovimientoDto
            {
                UidMovimiento = m.UidMovimiento,
                CuentaOrigen = m.CuentaOrigenNavigation.NroCuenta,
                CuentaDestino = m.CuentaDestinNavigation.NroCuenta,
                Monto = m.Monto,
                Fecha = m.Fecha
            })
            .FirstOrDefaultAsync();

        if (movimiento == null) return NotFound();
        return Ok(movimiento);
    }

    // POST: api/Movimiento
    [HttpPost]
    public async Task<ActionResult<MovimientoDto>> PostMovimiento([FromBody] MovimientoCreateDto dto)
    {
        // Validaciones básicas
        if (dto is null)
            return BadRequest(new { message = "Solicitud inválida." });

        if (string.IsNullOrWhiteSpace(dto.CuentaOrigen) || string.IsNullOrWhiteSpace(dto.CuentaDestino))
            return BadRequest(new { message = "Cuenta origen y destino son requeridas." });

        if (dto.CuentaOrigen == dto.CuentaDestino)
            return BadRequest(new { message = "La cuenta destino no puede ser igual a la cuenta origen." });

        if (dto.Monto <= 0)
            return BadRequest(new { message = "El monto debe ser mayor a 0." });

        // Valida 18 dígitos
        if (!(System.Text.RegularExpressions.Regex.IsMatch(dto.CuentaOrigen, @"^\d{18}$") &&
              System.Text.RegularExpressions.Regex.IsMatch(dto.CuentaDestino, @"^\d{18}$")))
            return BadRequest(new { message = "Las cuentas deben tener 18 dígitos." });

        // Transacción para garantizar atomicidad
        await using var tx = await _context.Database.BeginTransactionAsync();
        try
        {
            // Carga de cuentas
            var cuentaOrigen = await _context.Cuentas
                .FirstOrDefaultAsync(c => c.NroCuenta == dto.CuentaOrigen);
            var cuentaDest = await _context.Cuentas
                .FirstOrDefaultAsync(c => c.NroCuenta == dto.CuentaDestino);

            if (cuentaOrigen == null || cuentaDest == null)
                return BadRequest(new { message = "Cuenta origen o destino no existe." });

            if (cuentaOrigen.Saldo < dto.Monto)
                return BadRequest(new { message = "Saldo insuficiente en la cuenta de origen." });

            // Actualiza saldos
            cuentaOrigen.Saldo -= dto.Monto;
            cuentaDest.Saldo += dto.Monto;

            // Registra movimiento
            var movimiento = new Movimiento
            {
                CuentaOrigen = dto.CuentaOrigen,
                CuentaDestin = dto.CuentaDestino,
                Monto = dto.Monto,
                Fecha = dto.Fecha ?? DateTime.Now
            };

            _context.Movimientos.Add(movimiento);

            await _context.SaveChangesAsync();
            await tx.CommitAsync();

            var movimientoDto = new MovimientoDto
            {
                UidMovimiento = movimiento.UidMovimiento,
                CuentaOrigen = cuentaOrigen.NroCuenta,
                CuentaDestino = cuentaDest.NroCuenta,
                Monto = movimiento.Monto,
                Fecha = movimiento.Fecha
            };

            return CreatedAtAction(nameof(GetMovimiento), new { id = movimiento.UidMovimiento }, movimientoDto);
        }
        catch (DbUpdateConcurrencyException)
        {
            await tx.RollbackAsync();
            return StatusCode(StatusCodes.Status409Conflict, new { message = "Conflicto de concurrencia. Inténtalo nuevamente." });
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync();
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error interno al procesar la transferencia.", detail = ex.Message });
        }
    }


    // DELETE: api/Movimiento/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMovimiento(int id)
    {
        var movimiento = await _context.Movimientos.FindAsync(id);
        if (movimiento == null) return NotFound();

        _context.Movimientos.Remove(movimiento);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/Movimiento/by-account/001104020123456789?from=2025-08-01&to=2025-08-31
    [HttpGet("by-account/{nroCuenta}")]
    public async Task<ActionResult<IEnumerable<MovimientoDto>>> GetByAccount(
        string nroCuenta,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        if (string.IsNullOrWhiteSpace(nroCuenta))
            return BadRequest(new { message = "El número de cuenta es requerido." });

        var q = _context.Movimientos
            .AsNoTracking()
            .Where(m => m.CuentaOrigen == nroCuenta || m.CuentaDestin == nroCuenta);

        if (from.HasValue) q = q.Where(m => m.Fecha >= from.Value);
        if (to.HasValue) q = q.Where(m => m.Fecha < to.Value.AddDays(1)); // inclusivo por día

        var items = await q
            .OrderByDescending(m => m.Fecha)
            .ThenByDescending(m => m.UidMovimiento)
            .Select(m => new MovimientoDto
            {
                UidMovimiento = m.UidMovimiento,
                CuentaOrigen = m.CuentaOrigen,
                CuentaDestino = m.CuentaDestin,
                Monto = m.Monto,
                Fecha = m.Fecha
            })
            .ToListAsync();

        return Ok(items);
    }
}
