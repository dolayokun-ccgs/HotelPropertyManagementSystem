namespace HotelManagement.Api.DTOs;

public class PaymentResponseDto
{
    public int PaymentId { get; set; }
    public int ReservationId { get; set; }
    public string BookingReference { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal Surcharge { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string? CardNumber { get; set; }
    public string? CardName { get; set; }
    public string? TransactionReference { get; set; }
    public string? Notes { get; set; }
    public DateTime PaymentDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public int? ProcessedBy { get; set; }
    public string? ProcessedByName { get; set; }
    public DateTime CreatedDate { get; set; }
}

public class CreatePaymentDto
{
    public int ReservationId { get; set; }
    public decimal Amount { get; set; }
    public decimal Surcharge { get; set; } = 0;
    public required string PaymentMethod { get; set; }
    public string? CardNumber { get; set; }
    public string? CardName { get; set; }
    public string? TransactionReference { get; set; }
    public string? Notes { get; set; }
    public DateTime? PaymentDate { get; set; }
}

public class UpdatePaymentDto
{
    public decimal? Amount { get; set; }
    public decimal? Surcharge { get; set; }
    public string? PaymentMethod { get; set; }
    public string? CardNumber { get; set; }
    public string? CardName { get; set; }
    public string? TransactionReference { get; set; }
    public string? Notes { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? Status { get; set; }
}
