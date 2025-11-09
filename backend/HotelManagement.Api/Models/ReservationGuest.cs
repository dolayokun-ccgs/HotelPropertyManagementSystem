namespace HotelManagement.Api.Models;

public class ReservationGuest
{
    public int ReservationGuestId { get; set; }
    public int ReservationId { get; set; }
    public int GuestId { get; set; }
    public bool IsPrimaryGuest { get; set; } = false;
    public DateTime AddedDate { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Reservation? Reservation { get; set; }
    public Guest? Guest { get; set; }
}
