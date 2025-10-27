using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Api.Models;

public class RatePlan
{
    public int RatePlanId { get; set; }

    [Required]
    public int PropertyId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    // Restrictions
    public int? MinimumLengthOfStay { get; set; }
    public int? MaximumLengthOfStay { get; set; }
    public int? ReleasePeriod { get; set; } // Days in advance required for booking

    // Inclusions
    public string? Inclusions { get; set; } // Comma-separated list: Breakfast, Lunch, Dinner

    // Pricing
    public decimal? MinimumRate { get; set; }
    public string RateManagementType { get; set; } = "Manual"; // Manual, Derived, etc.

    // Applicable Room Types (stored as comma-separated IDs)
    public string? ApplicableRoomTypeIds { get; set; }

    // Status
    public bool IsActive { get; set; } = true;
    public bool IsDefault { get; set; } = false;

    // Direct Booking Controls
    public bool ShowOnBookingEngine { get; set; } = true;
    public string? BookingEngineDescription { get; set; }

    // Audit
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ModifiedDate { get; set; }

    // Navigation properties
    public Property? Property { get; set; }
}
