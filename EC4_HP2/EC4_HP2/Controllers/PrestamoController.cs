using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EC4_HP2.Data;
using EC4_HP2.Models;
using EC4_HP2.Dtos;

namespace EC4_HP2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrestamoController : ControllerBase
    {
        private readonly BancoContext _context;

        public PrestamoController(BancoContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrestamoDto>>> GetPrestamos()
        {
            var prestamos = await _context.Prestamos.ToListAsync();

            var prestamosDto = prestamos.Select(p => new PrestamoDto
            {
                UidPrestamo = p.UidPrestamo,
                TipoPrestamo = p.TipoPrestamo,
                MontoPrestamo = p.MontoPrestamo,
                Fecha = p.Fecha,
            }).ToList();

            return prestamosDto;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PrestamoDto>> GetPrestamo(int id)
        {
            var prestamo = await _context.Prestamos.FindAsync(id);
            if (prestamo == null) return NotFound();

            var dto = new PrestamoDto
            {
                UidPrestamo = prestamo.UidPrestamo,
                TipoPrestamo = prestamo.TipoPrestamo,
                MontoPrestamo = prestamo.MontoPrestamo,
                Fecha = prestamo.Fecha,
            };

            return dto;
        }

        [HttpPost]
        public async Task<ActionResult<PrestamoDto>> PostPrestamo(PrestamoDto dto)
        {
            var prestamo = new Prestamo
            {
                TipoPrestamo = dto.TipoPrestamo,
                MontoPrestamo = dto.MontoPrestamo,
                Fecha = dto.Fecha
            };

            _context.Prestamos.Add(prestamo);
            await _context.SaveChangesAsync();

            dto.UidPrestamo = prestamo.UidPrestamo;
            return CreatedAtAction(nameof(GetPrestamo), new { id = prestamo.UidPrestamo }, dto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<PrestamoDto>> PutPrestamo(int id, PrestamoDto dto)
        {
            var prestamo = await _context.Prestamos.FindAsync(id);
            if (prestamo == null) return NotFound();

            prestamo.TipoPrestamo = dto.TipoPrestamo;
            prestamo.MontoPrestamo = dto.MontoPrestamo;
            prestamo.Fecha = dto.Fecha;

            _context.Entry(prestamo).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            dto.UidPrestamo = prestamo.UidPrestamo;
            return dto;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrestamo(int id)
        {
            var prestamo = await _context.Prestamos.FindAsync(id);
            if (prestamo == null) return NotFound();

            _context.Prestamos.Remove(prestamo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
