namespace HotelManagement.Api.DTOs;

public class RatePlanResponseDto
{
    public int RatePlanId { get; set; }
    public int PropertyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? MinimumLengthOfStay { get; set; }
    public int? MaximumLengthOfStay { get; set; }
    public int? ReleasePeriod { get; set; }
    public string? Inclusions { get; set; }
    public decimal? MinimumRate { get; set; }
    public string RateManagementType { get; set; } = "Manual";
    public string? ApplicableRoomTypeIds { get; set; }
    public bool IsActive { get; set; }
    public bool IsDefault { get; set; }
    public bool ShowOnBookingEngine { get; set; }
    public string? BookingEngineDescription { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
}

public class CreateRatePlanDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? MinimumLengthOfStay { get; set; }
    public int? MaximumLengthOfStay { get; set; }
    public int? ReleasePeriod { get; set; }
    public string? Inclusions { get; set; }
    public decimal? MinimumRate { get; set; }
    public string RateManagementType { get; set; } = "Manual";
    public string? ApplicableRoomTypeIds { get; set; }
    public bool ShowOnBookingEngine { get; set; } = true;
    public string? BookingEngineDescription { get; set; }
}

public class UpdateRatePlanDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int? MinimumLengthOfStay { get; set; }
    public int? MaximumLengthOfStay { get; set; }
    public int? ReleasePeriod { get; set; }
    public string? Inclusions { get; set; }
    public decimal? MinimumRate { get; set; }
    public string? RateManagementType { get; set; }
    public string? ApplicableRoomTypeIds { get; set; }
    public bool? IsActive { get; set; }
    public bool? IsDefault { get; set; }
    public bool? ShowOnBookingEngine { get; set; }
    public string? BookingEngineDescription { get; set; }
}
