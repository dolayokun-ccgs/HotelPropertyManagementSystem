namespace HotelManagement.Api.Models;

public class Reservation
{
    public int ReservationId { get; set; }
    public required string BookingReference { get; set; }
    public int PropertyId { get; set; }
    public int? RoomId { get; set; }
    public int GuestId { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int Adults { get; set; } = 1;
    public int Children { get; set; } = 0;
    public int Infants { get; set; } = 0;
    public string Status { get; set; } = "Confirmed"; // Confirmed, CheckedIn, CheckedOut, Cancelled
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; } = 0;
    public string Currency { get; set; } = "USD";
    public string Source { get; set; } = "Direct"; // Direct, Booking.com, Expedia, Airbnb, etc.
    public string? SpecialRequests { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ModifiedDate { get; set; }
    public DateTime? ConfirmedDate { get; set; }

    // Navigation properties
    public Property? Property { get; set; }
    public Room? Room { get; set; }
    public Guest? Guest { get; set; }
}
