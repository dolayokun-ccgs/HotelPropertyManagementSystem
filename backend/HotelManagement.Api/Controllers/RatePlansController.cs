using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Api.Data;
using HotelManagement.Api.Models;
using HotelManagement.Api.DTOs;

namespace HotelManagement.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RatePlansController : ControllerBase
{
    private readonly HotelDbContext _context;
    private readonly ILogger<RatePlansController> _logger;

    public RatePlansController(HotelDbContext context, ILogger<RatePlansController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/rateplans
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RatePlanResponseDto>>> GetRatePlans([FromQuery] bool? isActive)
    {
        try
        {
            var query = _context.RatePlans.AsQueryable();

            // Filter by active status if provided
            if (isActive.HasValue)
            {
                query = query.Where(r => r.IsActive == isActive.Value);
            }

            var ratePlans = await query
                .OrderByDescending(r => r.IsDefault)
                .ThenBy(r => r.Name)
                .ToListAsync();

            var ratePlanDtos = ratePlans.Select(r => new RatePlanResponseDto
            {
                RatePlanId = r.RatePlanId,
                PropertyId = r.PropertyId,
                Name = r.Name,
                Description = r.Description,
                MinimumLengthOfStay = r.MinimumLengthOfStay,
                MaximumLengthOfStay = r.MaximumLengthOfStay,
                ReleasePeriod = r.ReleasePeriod,
                Inclusions = r.Inclusions,
                MinimumRate = r.MinimumRate,
                RateManagementType = r.RateManagementType,
                ApplicableRoomTypeIds = r.ApplicableRoomTypeIds,
                IsActive = r.IsActive,
                IsDefault = r.IsDefault,
                ShowOnBookingEngine = r.ShowOnBookingEngine,
                BookingEngineDescription = r.BookingEngineDescription,
                CreatedDate = r.CreatedDate,
                ModifiedDate = r.ModifiedDate
            }).ToList();

            return Ok(ratePlanDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving rate plans");
            return StatusCode(500, "Internal server error while retrieving rate plans");
        }
    }

    // GET: api/rateplans/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<RatePlanResponseDto>> GetRatePlan(int id)
    {
        try
        {
            var ratePlan = await _context.RatePlans.FindAsync(id);

            if (ratePlan == null)
            {
                return NotFound($"Rate plan with ID {id} not found");
            }

            var ratePlanDto = new RatePlanResponseDto
            {
                RatePlanId = ratePlan.RatePlanId,
                PropertyId = ratePlan.PropertyId,
                Name = ratePlan.Name,
                Description = ratePlan.Description,
                MinimumLengthOfStay = ratePlan.MinimumLengthOfStay,
                MaximumLengthOfStay = ratePlan.MaximumLengthOfStay,
                ReleasePeriod = ratePlan.ReleasePeriod,
                Inclusions = ratePlan.Inclusions,
                MinimumRate = ratePlan.MinimumRate,
                RateManagementType = ratePlan.RateManagementType,
                ApplicableRoomTypeIds = ratePlan.ApplicableRoomTypeIds,
                IsActive = ratePlan.IsActive,
                IsDefault = ratePlan.IsDefault,
                ShowOnBookingEngine = ratePlan.ShowOnBookingEngine,
                BookingEngineDescription = ratePlan.BookingEngineDescription,
                CreatedDate = ratePlan.CreatedDate,
                ModifiedDate = ratePlan.ModifiedDate
            };

            return Ok(ratePlanDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving rate plan with ID {RatePlanId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // POST: api/rateplans
    [HttpPost]
    public async Task<ActionResult<RatePlanResponseDto>> CreateRatePlan(CreateRatePlanDto dto)
    {
        try
        {
            // Get the first property (assuming single property for now)
            var property = await _context.Properties.FirstOrDefaultAsync();
            if (property == null)
            {
                return BadRequest("No property found. Please create a property first.");
            }

            var ratePlan = new RatePlan
            {
                PropertyId = property.PropertyId,
                Name = dto.Name,
                Description = dto.Description,
                MinimumLengthOfStay = dto.MinimumLengthOfStay,
                MaximumLengthOfStay = dto.MaximumLengthOfStay,
                ReleasePeriod = dto.ReleasePeriod,
                Inclusions = dto.Inclusions,
                MinimumRate = dto.MinimumRate,
                RateManagementType = dto.RateManagementType,
                ApplicableRoomTypeIds = dto.ApplicableRoomTypeIds,
                ShowOnBookingEngine = dto.ShowOnBookingEngine,
                BookingEngineDescription = dto.BookingEngineDescription,
                IsActive = true,
                IsDefault = false,
                CreatedDate = DateTime.UtcNow
            };

            _context.RatePlans.Add(ratePlan);
            await _context.SaveChangesAsync();

            var responseDto = new RatePlanResponseDto
            {
                RatePlanId = ratePlan.RatePlanId,
                PropertyId = ratePlan.PropertyId,
                Name = ratePlan.Name,
                Description = ratePlan.Description,
                MinimumLengthOfStay = ratePlan.MinimumLengthOfStay,
                MaximumLengthOfStay = ratePlan.MaximumLengthOfStay,
                ReleasePeriod = ratePlan.ReleasePeriod,
                Inclusions = ratePlan.Inclusions,
                MinimumRate = ratePlan.MinimumRate,
                RateManagementType = ratePlan.RateManagementType,
                ApplicableRoomTypeIds = ratePlan.ApplicableRoomTypeIds,
                IsActive = ratePlan.IsActive,
                IsDefault = ratePlan.IsDefault,
                ShowOnBookingEngine = ratePlan.ShowOnBookingEngine,
                BookingEngineDescription = ratePlan.BookingEngineDescription,
                CreatedDate = ratePlan.CreatedDate,
                ModifiedDate = ratePlan.ModifiedDate
            };

            return CreatedAtAction(nameof(GetRatePlan), new { id = ratePlan.RatePlanId }, responseDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating rate plan");
            return StatusCode(500, "Internal server error while creating rate plan");
        }
    }

    // PUT: api/rateplans/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRatePlan(int id, UpdateRatePlanDto dto)
    {
        try
        {
            var ratePlan = await _context.RatePlans.FindAsync(id);
            if (ratePlan == null)
            {
                return NotFound($"Rate plan with ID {id} not found");
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(dto.Name))
                ratePlan.Name = dto.Name;
            if (dto.Description != null)
                ratePlan.Description = dto.Description;
            if (dto.MinimumLengthOfStay.HasValue)
                ratePlan.MinimumLengthOfStay = dto.MinimumLengthOfStay;
            if (dto.MaximumLengthOfStay.HasValue)
                ratePlan.MaximumLengthOfStay = dto.MaximumLengthOfStay;
            if (dto.ReleasePeriod.HasValue)
                ratePlan.ReleasePeriod = dto.ReleasePeriod;
            if (dto.Inclusions != null)
                ratePlan.Inclusions = dto.Inclusions;
            if (dto.MinimumRate.HasValue)
                ratePlan.MinimumRate = dto.MinimumRate;
            if (!string.IsNullOrEmpty(dto.RateManagementType))
                ratePlan.RateManagementType = dto.RateManagementType;
            if (dto.ApplicableRoomTypeIds != null)
                ratePlan.ApplicableRoomTypeIds = dto.ApplicableRoomTypeIds;
            if (dto.IsActive.HasValue)
                ratePlan.IsActive = dto.IsActive.Value;
            if (dto.IsDefault.HasValue)
                ratePlan.IsDefault = dto.IsDefault.Value;
            if (dto.ShowOnBookingEngine.HasValue)
                ratePlan.ShowOnBookingEngine = dto.ShowOnBookingEngine.Value;
            if (dto.BookingEngineDescription != null)
                ratePlan.BookingEngineDescription = dto.BookingEngineDescription;

            ratePlan.ModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating rate plan with ID {RatePlanId}", id);
            return StatusCode(500, "Internal server error while updating rate plan");
        }
    }

    // DELETE: api/rateplans/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRatePlan(int id)
    {
        try
        {
            var ratePlan = await _context.RatePlans.FindAsync(id);
            if (ratePlan == null)
            {
                return NotFound($"Rate plan with ID {id} not found");
            }

            // Soft delete: just set as inactive
            ratePlan.IsActive = false;
            ratePlan.ModifiedDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting rate plan with ID {RatePlanId}", id);
            return StatusCode(500, "Internal server error while deleting rate plan");
        }
    }

    // POST: api/rateplans/{id}/set-default
    [HttpPost("{id}/set-default")]
    public async Task<IActionResult> SetAsDefaultRatePlan(int id)
    {
        try
        {
            var ratePlan = await _context.RatePlans.FindAsync(id);
            if (ratePlan == null)
            {
                return NotFound($"Rate plan with ID {id} not found");
            }

            // Remove default status from all other rate plans
            var allRatePlans = await _context.RatePlans
                .Where(r => r.PropertyId == ratePlan.PropertyId)
                .ToListAsync();

            foreach (var plan in allRatePlans)
            {
                plan.IsDefault = (plan.RatePlanId == id);
                plan.ModifiedDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting rate plan {RatePlanId} as default", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
