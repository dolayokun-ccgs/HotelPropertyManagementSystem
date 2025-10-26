namespace HotelManagement.Api.DTOs;

public class RoomResponseDto
{
    public int RoomId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int FloorNumber { get; set; }
    public string Status { get; set; } = string.Empty;
    public string CleaningStatus { get; set; } = string.Empty;
    public string RoomTypeName { get; set; } = string.Empty;
    public int MaxOccupancy { get; set; }
    public string? BedType { get; set; }
}

public class RoomTypeResponseDto
{
    public int RoomTypeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int MaxOccupancy { get; set; }
    public int BaseOccupancy { get; set; }
    public string? BedType { get; set; }
    public decimal? RoomSize { get; set; }
    public int AvailableRooms { get; set; }
}
