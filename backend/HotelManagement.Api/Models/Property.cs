namespace HotelManagement.Api.Models;

public class Property
{
    public int PropertyId { get; set; }
    public required string Name { get; set; }
    public required string Type { get; set; }
    public required string Address { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string Currency { get; set; } = "USD";  // Base currency (existing column)
    public string Timezone { get; set; } = "UTC";  // Time zone (existing column)
    public string Status { get; set; } = "Active";
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    // General Information
    public bool CurrencyConversion { get; set; } = false;
    public decimal? MinimumRate { get; set; }
    public int UpdatePeriod { get; set; } = 400;
    public string WeekendStartsOn { get; set; } = "Saturday";
    public bool AutoReplenishment { get; set; } = false;
    public string? ReservationDeliveryFailureEmail { get; set; }
    public string BaseLanguage { get; set; } = "English";
    public string UnitsOfMeasurement { get; set; } = "Metric";

    // Property Details
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? PublicEmail { get; set; }
    public string? Website { get; set; }
    public string? PublicPhone { get; set; }
    public string? AlternativePhone { get; set; }
    public string? Facebook { get; set; }
    public string? Instagram { get; set; }
    public string? Twitter { get; set; }
    public string? YouTube { get; set; }
    public string? PropertyRating { get; set; }
    public string? TaxId { get; set; }

    // Services
    public string? PropertyDescriptionEnglish { get; set; }
    public string? PropertyFacilities { get; set; }
    public string? Parking { get; set; }
    public string? Transport { get; set; }
    public string? InstructionsToLocationEnglish { get; set; }

    // Policies
    public TimeSpan? CheckInTime { get; set; }
    public TimeSpan? CheckOutTime { get; set; }
    public string? SmokingPolicy { get; set; }
    public string? TermsAndConditionsEnglish { get; set; }
    public string? PaymentPolicyEnglish { get; set; }

    // Navigation properties
    public ICollection<RoomType> RoomTypes { get; set; } = new List<RoomType>();
    public ICollection<Room> Rooms { get; set; } = new List<Room>();
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
