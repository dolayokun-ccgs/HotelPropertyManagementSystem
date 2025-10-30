namespace HotelManagement.Api.Models;

public class Media
{
    public int MediaId { get; set; }
    public int PropertyId { get; set; }
    public required string FileName { get; set; }
    public required string StoredFileName { get; set; }
    public required string FilePath { get; set; }
    public long FileSize { get; set; }
    public required string MimeType { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    public string? Caption { get; set; }
    public required string Category { get; set; } // Property, RoomTypes, Extras, GuestCommunications, FloorPlans
    public int UploadedBy { get; set; }
    public DateTime UploadedDate { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Property? Property { get; set; }
    public User? UploadedByUser { get; set; }
    public ICollection<RoomTypeMedia> RoomTypeMedia { get; set; } = new List<RoomTypeMedia>();
}
