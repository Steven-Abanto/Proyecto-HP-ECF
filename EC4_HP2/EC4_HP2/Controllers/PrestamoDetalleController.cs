using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EC4_HP2.Data;
using EC4_HP2.Models;
using EC4_HP2.Dtos;

namespace EC4_HP2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrestamoDetalleController : ControllerBase
    {
        private readonly BancoContext _context;

        public PrestamoDetalleController(BancoContext context)
        {
            _context = context;
        }

        // GET: api/PrestamoDetalle
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrestamoDetalleDto>>> GetDetalles()
        {
            var detalles = await _context.PrestamoDetalles.ToListAsync();

            var dtoList = detalles.Select(d => new PrestamoDetalleDto
            {
                UidDetalle = d.UidDetalle,
                NroCuenta = d.NroCuenta,
                MontoPrestamo = d.MontoPrestamo,
                TasaInt = d.TasaInt,
                Cuotas = d.Cuotas,
                DeudaCuota = d.DeudaCuota,
                DeudaTotal = d.DeudaTotal,
                Fecha = d.Fecha
            }).ToList();

            return dtoList;
        }

        // GET: api/PrestamoDetalle/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PrestamoDetalleDto>> GetDetalle(int id)
        {
            var detalle = await _context.PrestamoDetalles.FindAsync(id);
            if (detalle == null) return NotFound();

            var dto = new PrestamoDetalleDto
            {
                UidDetalle = detalle.UidDetalle,
                NroCuenta = detalle.NroCuenta,
                MontoPrestamo = detalle.MontoPrestamo,
                TasaInt = detalle.TasaInt,
                Cuotas = detalle.Cuotas,
                DeudaCuota = detalle.DeudaCuota,
                DeudaTotal = detalle.DeudaTotal,
                Fecha = detalle.Fecha
            };

            return dto;
        }

        // POST: api/PrestamoDetalle
        [HttpPost]
        public async Task<ActionResult<PrestamoDetalleDto>> PostDetalle([FromBody] PrestamoDetalleDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            await using var tx = await _context.Database.BeginTransactionAsync();
            try
            {
                //Carga la cuenta para sumar el préstamo
                var cuenta = await _context.Cuentas
                    .SingleOrDefaultAsync(c => c.NroCuenta == dto.NroCuenta);

                if (cuenta is null)
                    return BadRequest(new { message = "La cuenta destino no existe." });

                //Crea el detalle 
                var detalle = new PrestamoDetalle
                {
                    UidPrestamo = dto.UidPrestamo,
                    NroCuenta = dto.NroCuenta,
                    MontoPrestamo = dto.MontoPrestamo,
                    TasaInt = dto.TasaInt,
                    Cuotas = dto.Cuotas,
                    DeudaCuota = dto.DeudaCuota,
                    DeudaTotal = dto.DeudaTotal,
                    Fecha = dto.Fecha
                };

                //Suma préstamo
                cuenta.Saldo += dto.MontoPrestamo;

                _context.PrestamoDetalles.Add(detalle);

                await _context.SaveChangesAsync();
                await tx.CommitAsync();

                dto.UidDetalle = detalle.UidDetalle;
                return CreatedAtAction(nameof(GetDetalle), new { id = detalle.UidDetalle }, dto);
            }
            catch (DbUpdateException ex)
            {
                await tx.RollbackAsync();
                return BadRequest(new { message = "No se pudo registrar el detalle del préstamo.", detail = ex.Message });
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "Error interno al procesar el préstamo.", detail = ex.Message });
            }
        }

        // PUT: api/PrestamoDetalle/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PrestamoDetalleDto>> PutDetalle(int id, PrestamoDetalleDto dto)
        {
            var detalle = await _context.PrestamoDetalles.FindAsync(id);
            if (detalle == null) return NotFound();

            detalle.NroCuenta = dto.NroCuenta;
            detalle.MontoPrestamo = dto.MontoPrestamo;
            detalle.TasaInt = dto.TasaInt;
            detalle.Cuotas = dto.Cuotas;
            detalle.DeudaCuota = dto.DeudaCuota;
            detalle.DeudaTotal = dto.DeudaTotal;
            detalle.Fecha = dto.Fecha;

            _context.Entry(detalle).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return dto;
        }

        // DELETE: api/PrestamoDetalle/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetalle(int id)
        {
            var detalle = await _context.PrestamoDetalles.FindAsync(id);
            if (detalle == null) return NotFound();

            _context.PrestamoDetalles.Remove(detalle);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
