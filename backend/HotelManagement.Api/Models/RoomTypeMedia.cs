namespace HotelManagement.Api.Models;

public class RoomTypeMedia
{
    public int RoomTypeMediaId { get; set; }
    public int RoomTypeId { get; set; }
    public int MediaId { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsPrimary { get; set; } = false;
    public DateTime AssignedDate { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public RoomType? RoomType { get; set; }
    public Media? Media { get; set; }
}
