namespace HotelManagement.Api.Models;

public class Reservation
{
    public int ReservationId { get; set; }
    public required string BookingReference { get; set; }
    public int PropertyId { get; set; }
    public int? RoomId { get; set; }
    public int? RoomTypeId { get; set; }
    public int? RatePlanId { get; set; }
    public int GuestId { get; set; } // Primary guest
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int Adults { get; set; } = 1;
    public int Children { get; set; } = 0;
    public int Infants { get; set; } = 0;

    // Status and booking details
    public string Status { get; set; } = "New booking"; // New booking, Confirmed, CheckedIn, CheckedOut, Cancelled
    public string Source { get; set; } = "Direct"; // Direct, Extranet, Booking.com, Expedia, Airbnb, etc.
    public string? ArrivalTime { get; set; }
    public string? Referral { get; set; }

    // Pricing details
    public decimal RoomTotal { get; set; } = 0;
    public decimal ExtraPersonTotal { get; set; } = 0;
    public decimal ExtrasTotal { get; set; } = 0;
    public decimal DiscountTotal { get; set; } = 0;
    public decimal CreditCardSurcharges { get; set; } = 0;
    public decimal TotalAmount { get; set; }
    public decimal TotalReceived { get; set; } = 0;
    public decimal DepositAmount { get; set; } = 0;
    public string Currency { get; set; } = "GBP";

    // Payment details
    public string? PaymentMethod { get; set; } // Card, Cash, Bank Transfer
    public string? CardNumber { get; set; } // Last 4 digits or masked
    public string? CardName { get; set; }
    public string? CardExpiry { get; set; }

    // Guest details (from primary contact)
    public string? GuestComments { get; set; }
    public string? SpecialRequests { get; set; }
    public string? InternalNotes { get; set; }

    // Timestamps
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ModifiedDate { get; set; }
    public DateTime? ConfirmedDate { get; set; }
    public DateTime? CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
    public int? CreatedBy { get; set; }
    public int? ModifiedBy { get; set; }

    // Navigation properties
    public Property? Property { get; set; }
    public Room? Room { get; set; }
    public RoomType? RoomType { get; set; }
    public RatePlan? RatePlan { get; set; }
    public Guest? Guest { get; set; }
    public User? CreatedByUser { get; set; }
    public User? ModifiedByUser { get; set; }
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public ICollection<ReservationGuest> ReservationGuests { get; set; } = new List<ReservationGuest>();
}
