namespace HotelManagement.Api.Models;

public class Guest
{
    public int GuestId { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }

    // Address fields
    public string? Organisation { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }

    // Identification
    public string? IdType { get; set; } // Driver's license, Passport, etc.
    public string? IdNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Nationality { get; set; }

    // Additional fields
    public string? Comments { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ModifiedDate { get; set; }

    // Navigation properties
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public ICollection<ReservationGuest> ReservationGuests { get; set; } = new List<ReservationGuest>();
}
