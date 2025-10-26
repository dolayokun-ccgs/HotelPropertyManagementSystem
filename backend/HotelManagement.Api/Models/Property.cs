namespace HotelManagement.Api.Models;

public class Property
{
    public int PropertyId { get; set; }
    public required string Name { get; set; }
    public required string Type { get; set; }
    public required string Address { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string Currency { get; set; } = "USD";
    public string Timezone { get; set; } = "UTC";
    public string Status { get; set; } = "Active";
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<RoomType> RoomTypes { get; set; } = new List<RoomType>();
    public ICollection<Room> Rooms { get; set; } = new List<Room>();
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}
