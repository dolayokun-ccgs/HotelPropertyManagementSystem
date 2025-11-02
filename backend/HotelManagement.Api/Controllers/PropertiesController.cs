using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Api.Data;
using HotelManagement.Api.Models;

namespace HotelManagement.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly HotelDbContext _context;
    private readonly ILogger<PropertiesController> _logger;

    public PropertiesController(HotelDbContext context, ILogger<PropertiesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/properties/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Property>> GetProperty(int id)
    {
        try
        {
            var property = await _context.Properties.FindAsync(id);

            if (property == null)
            {
                return NotFound(new { message = $"Property with ID {id} not found" });
            }

            return Ok(property);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching property with ID {PropertyId}", id);
            return StatusCode(500, new { message = "An error occurred while fetching the property" });
        }
    }

    // GET: api/properties
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Property>>> GetProperties()
    {
        try
        {
            var properties = await _context.Properties
                .OrderBy(p => p.Name)
                .ToListAsync();

            return Ok(properties);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching properties");
            return StatusCode(500, new { message = "An error occurred while fetching properties" });
        }
    }

    // PUT: api/properties/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProperty(int id, Property property)
    {
        if (id != property.PropertyId)
        {
            return BadRequest(new { message = "Property ID mismatch" });
        }

        try
        {
            var existingProperty = await _context.Properties.FindAsync(id);

            if (existingProperty == null)
            {
                return NotFound(new { message = $"Property with ID {id} not found" });
            }

            // Update property fields
            existingProperty.Name = property.Name;
            existingProperty.Type = property.Type;
            existingProperty.Address = property.Address;
            existingProperty.Phone = property.Phone;
            existingProperty.Email = property.Email;
            existingProperty.Currency = property.Currency;
            existingProperty.Timezone = property.Timezone;
            existingProperty.Status = property.Status;

            // General Information
            existingProperty.CurrencyConversion = property.CurrencyConversion;
            existingProperty.MinimumRate = property.MinimumRate;
            existingProperty.UpdatePeriod = property.UpdatePeriod;
            existingProperty.WeekendStartsOn = property.WeekendStartsOn;
            existingProperty.AutoReplenishment = property.AutoReplenishment;
            existingProperty.ReservationDeliveryFailureEmail = property.ReservationDeliveryFailureEmail;
            existingProperty.BaseLanguage = property.BaseLanguage;
            existingProperty.UnitsOfMeasurement = property.UnitsOfMeasurement;

            // Property Details
            existingProperty.Latitude = property.Latitude;
            existingProperty.Longitude = property.Longitude;
            existingProperty.PublicEmail = property.PublicEmail;
            existingProperty.Website = property.Website;
            existingProperty.PublicPhone = property.PublicPhone;
            existingProperty.AlternativePhone = property.AlternativePhone;
            existingProperty.Facebook = property.Facebook;
            existingProperty.Instagram = property.Instagram;
            existingProperty.Twitter = property.Twitter;
            existingProperty.YouTube = property.YouTube;
            existingProperty.PropertyRating = property.PropertyRating;
            existingProperty.TaxId = property.TaxId;

            // Services
            existingProperty.PropertyDescriptionEnglish = property.PropertyDescriptionEnglish;
            existingProperty.PropertyFacilities = property.PropertyFacilities;
            existingProperty.Parking = property.Parking;
            existingProperty.Transport = property.Transport;
            existingProperty.InstructionsToLocationEnglish = property.InstructionsToLocationEnglish;

            // Policies
            existingProperty.CheckInTime = property.CheckInTime;
            existingProperty.CheckOutTime = property.CheckOutTime;
            existingProperty.SmokingPolicy = property.SmokingPolicy;
            existingProperty.TermsAndConditionsEnglish = property.TermsAndConditionsEnglish;
            existingProperty.PaymentPolicyEnglish = property.PaymentPolicyEnglish;

            await _context.SaveChangesAsync();

            return Ok(existingProperty);
        }
        catch (DbUpdateConcurrencyException ex)
        {
            _logger.LogError(ex, "Concurrency error updating property {PropertyId}", id);
            return StatusCode(409, new { message = "The property was modified by another user. Please refresh and try again." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating property {PropertyId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the property" });
        }
    }
}
