using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Api.Models;

public class Promotion
{
    public int PromotionId { get; set; }

    [Required]
    public int PropertyId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Code { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public decimal DefaultDiscount { get; set; }

    [Required]
    [MaxLength(10)]
    public string Currency { get; set; } = "GBP";

    public bool ShowDiscountToGuests { get; set; } = false;

    // Stay dates (when guests can use this promotion)
    public bool StayAnyDate { get; set; } = false;
    public DateTime? StayStartDate { get; set; }
    public DateTime? StayEndDate { get; set; }

    // Sell dates (when promotion is advertised)
    public bool SellAnyDate { get; set; } = false;
    public DateTime? SellStartDate { get; set; }
    public DateTime? SellEndDate { get; set; }

    // Assigned room rates (comma-separated IDs)
    public string? AssignedRoomRateIds { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ModifiedDate { get; set; }

    // Navigation property
    public Property? Property { get; set; }
}
