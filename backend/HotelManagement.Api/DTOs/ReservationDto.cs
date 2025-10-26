namespace HotelManagement.Api.DTOs;

public class CreateReservationDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int Adults { get; set; }
    public int Children { get; set; }
    public int? RoomId { get; set; }
    public int? RoomTypeId { get; set; }
    public string Source { get; set; } = "Direct";
    public string? SpecialRequests { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DepositAmount { get; set; }
}

public class ReservationResponseDto
{
    public int ReservationId { get; set; }
    public string BookingReference { get; set; } = string.Empty;
    public string GuestName { get; set; } = string.Empty;
    public string GuestEmail { get; set; } = string.Empty;
    public string? RoomNumber { get; set; }
    public string? RoomType { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int Adults { get; set; }
    public int Children { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal Outstanding { get; set; }
    public string Source { get; set; } = string.Empty;
    public string? SpecialRequests { get; set; }
    public DateTime CreatedDate { get; set; }
}

public class UpdateReservationDto
{
    public DateTime? CheckInDate { get; set; }
    public DateTime? CheckOutDate { get; set; }
    public int? Adults { get; set; }
    public int? Children { get; set; }
    public int? RoomId { get; set; }
    public string? Status { get; set; }
    public decimal? TotalAmount { get; set; }
    public decimal? PaidAmount { get; set; }
    public string? SpecialRequests { get; set; }
}
