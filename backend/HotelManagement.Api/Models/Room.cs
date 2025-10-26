namespace HotelManagement.Api.Models;

public class Room
{
    public int RoomId { get; set; }
    public int RoomTypeId { get; set; }
    public int PropertyId { get; set; }
    public required string RoomNumber { get; set; }
    public int? FloorNumber { get; set; }
    public string Status { get; set; } = "Available"; // Available, Occupied, Maintenance
    public string CleaningStatus { get; set; } = "Clean"; // Clean, Dirty, InProgress
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public RoomType? RoomType { get; set; }
    public Property? Property { get; set; }
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
