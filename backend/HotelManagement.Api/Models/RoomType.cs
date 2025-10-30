namespace HotelManagement.Api.Models;

public class RoomType
{
    public int RoomTypeId { get; set; }
    public int PropertyId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public int MaxOccupancy { get; set; }
    public int BaseOccupancy { get; set; }
    public string? BedType { get; set; }
    public decimal? RoomSize { get; set; }
    public int Bathrooms { get; set; } = 1;
    public bool SmokingAllowed { get; set; } = false;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Property? Property { get; set; }
    public ICollection<Room> Rooms { get; set; } = new List<Room>();
    public ICollection<RoomTypeMedia> RoomTypeMedia { get; set; } = new List<RoomTypeMedia>();
}
