namespace HotelManagement.Api.Models;

public class Payment
{
    public int PaymentId { get; set; }
    public int ReservationId { get; set; }
    public decimal Amount { get; set; }
    public decimal Surcharge { get; set; } = 0;
    public string PaymentMethod { get; set; } = "Cash"; // Cash, Card, Bank Transfer, etc.
    public string? CardNumber { get; set; } // Last 4 digits
    public string? CardName { get; set; }
    public string? TransactionReference { get; set; }
    public string? Notes { get; set; }
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Completed"; // Completed, Pending, Failed, Refunded
    public int? ProcessedBy { get; set; } // UserId who processed the payment
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ModifiedDate { get; set; }

    // Navigation properties
    public Reservation? Reservation { get; set; }
    public User? ProcessedByUser { get; set; }
}
