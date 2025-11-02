using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Api.Data;
using HotelManagement.Api.Models;

namespace HotelManagement.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RoomTypesController : ControllerBase
{
    private readonly HotelDbContext _context;
    private readonly ILogger<RoomTypesController> _logger;

    public RoomTypesController(HotelDbContext context, ILogger<RoomTypesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/roomtypes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetRoomTypes([FromQuery] bool? isActive)
    {
        try
        {
            var query = _context.RoomTypes
                .Include(rt => rt.Rooms)
                .AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(rt => rt.IsActive == isActive.Value);
            }

            var roomTypes = await query
                .OrderBy(rt => rt.Name)
                .ToListAsync();

            var roomTypeDtos = roomTypes.Select(rt => new
            {
                rt.RoomTypeId,
                rt.PropertyId,
                rt.Name,
                rt.Description,
                rt.Category,
                rt.MaxOccupancy,
                rt.BaseOccupancy,
                rt.BedType,
                rt.RoomSize,
                rt.Bathrooms,
                rt.SmokingAllowed,
                rt.IsActive,
                RoomCount = rt.Rooms?.Count ?? 0,
                AvailableRoomCount = rt.Rooms?.Count(r => r.Status == "Available") ?? 0
            }).ToList();

            return Ok(roomTypeDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving room types");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/roomtypes/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<RoomType>> GetRoomType(int id)
    {
        try
        {
            var roomType = await _context.RoomTypes
                .Include(rt => rt.Rooms)
                .FirstOrDefaultAsync(rt => rt.RoomTypeId == id);

            if (roomType == null)
            {
                return NotFound($"Room type with ID {id} not found");
            }

            return Ok(roomType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving room type with ID {RoomTypeId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // POST: api/roomtypes
    [HttpPost]
    public async Task<ActionResult<RoomType>> CreateRoomType(RoomType roomType)
    {
        try
        {
            // Get the first property (assuming single property for now)
            var property = await _context.Properties.FirstOrDefaultAsync();
            if (property == null)
            {
                return BadRequest("No property found. Please create a property first.");
            }

            roomType.PropertyId = property.PropertyId;
            roomType.IsActive = true;

            _context.RoomTypes.Add(roomType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoomType), new { id = roomType.RoomTypeId }, roomType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating room type");
            return StatusCode(500, "Internal server error");
        }
    }

    // PUT: api/roomtypes/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRoomType(int id, RoomType roomType)
    {
        if (id != roomType.RoomTypeId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            _context.Entry(roomType).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await RoomTypeExists(id))
            {
                return NotFound();
            }
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating room type");
            return StatusCode(500, "Internal server error");
        }
    }

    // DELETE: api/roomtypes/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRoomType(int id)
    {
        try
        {
            var roomType = await _context.RoomTypes.FindAsync(id);
            if (roomType == null)
            {
                return NotFound();
            }

            // Soft delete: set as inactive
            roomType.IsActive = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting room type");
            return StatusCode(500, "Internal server error");
        }
    }

    private async Task<bool> RoomTypeExists(int id)
    {
        return await _context.RoomTypes.AnyAsync(rt => rt.RoomTypeId == id);
    }
}
