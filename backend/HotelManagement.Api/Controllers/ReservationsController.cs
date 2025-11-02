using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Api.Data;
using HotelManagement.Api.Models;
using HotelManagement.Api.DTOs;

namespace HotelManagement.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private readonly HotelDbContext _context;

    public ReservationsController(HotelDbContext context)
    {
        _context = context;
    }

    // GET: api/reservations
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReservationResponseDto>>> GetReservations(
        [FromQuery] string? status = null,
        [FromQuery] DateTime? checkInFrom = null,
        [FromQuery] DateTime? checkInTo = null,
        [FromQuery] string? guestName = null,
        [FromQuery] string? bookingReference = null)
    {
        var query = _context.Reservations
            .Include(r => r.Guest)
            .Include(r => r.Room)
                .ThenInclude(room => room!.RoomType)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status) && status != "all")
        {
            query = query.Where(r => r.Status.ToLower() == status.ToLower());
        }

        if (checkInFrom.HasValue)
        {
            query = query.Where(r => r.CheckInDate >= checkInFrom.Value);
        }

        if (checkInTo.HasValue)
        {
            query = query.Where(r => r.CheckInDate <= checkInTo.Value);
        }

        if (!string.IsNullOrEmpty(guestName))
        {
            query = query.Where(r =>
                r.Guest!.LastName.Contains(guestName) ||
                r.Guest!.FirstName.Contains(guestName));
        }

        if (!string.IsNullOrEmpty(bookingReference))
        {
            query = query.Where(r => r.BookingReference.Contains(bookingReference));
        }

        var reservations = await query
            .OrderByDescending(r => r.CreatedDate)
            .Select(r => new ReservationResponseDto
            {
                ReservationId = r.ReservationId,
                BookingReference = r.BookingReference,
                GuestName = $"{r.Guest!.FirstName} {r.Guest.LastName}",
                GuestEmail = r.Guest.Email,
                RoomNumber = r.Room != null ? r.Room.RoomNumber : null,
                RoomType = r.Room != null && r.Room.RoomType != null ? r.Room.RoomType.Name : null,
                CheckInDate = r.CheckInDate,
                CheckOutDate = r.CheckOutDate,
                Adults = r.Adults,
                Children = r.Children,
                Status = r.Status,
                TotalAmount = r.TotalAmount,
                PaidAmount = r.PaidAmount,
                Outstanding = r.TotalAmount - r.PaidAmount,
                Source = r.Source,
                SpecialRequests = r.SpecialRequests,
                CreatedDate = r.CreatedDate
            })
            .ToListAsync();

        return Ok(reservations);
    }

    // GET: api/reservations/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ReservationResponseDto>> GetReservation(int id)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Guest)
            .Include(r => r.Room)
                .ThenInclude(room => room!.RoomType)
            .Where(r => r.ReservationId == id)
            .Select(r => new ReservationResponseDto
            {
                ReservationId = r.ReservationId,
                BookingReference = r.BookingReference,
                GuestName = $"{r.Guest!.FirstName} {r.Guest.LastName}",
                GuestEmail = r.Guest.Email,
                RoomNumber = r.Room != null ? r.Room.RoomNumber : null,
                RoomType = r.Room != null && r.Room.RoomType != null ? r.Room.RoomType.Name : null,
                CheckInDate = r.CheckInDate,
                CheckOutDate = r.CheckOutDate,
                Adults = r.Adults,
                Children = r.Children,
                Status = r.Status,
                TotalAmount = r.TotalAmount,
                PaidAmount = r.PaidAmount,
                Outstanding = r.TotalAmount - r.PaidAmount,
                Source = r.Source,
                SpecialRequests = r.SpecialRequests,
                CreatedDate = r.CreatedDate
            })
            .FirstOrDefaultAsync();

        if (reservation == null)
        {
            return NotFound();
        }

        return Ok(reservation);
    }

    // POST: api/reservations
    [HttpPost]
    public async Task<ActionResult<ReservationResponseDto>> CreateReservation(CreateReservationDto dto)
    {
        // Check or create guest
        var guest = await _context.Guests
            .FirstOrDefaultAsync(g => g.Email == dto.Email);

        if (guest == null)
        {
            guest = new Guest
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone
            };
            _context.Guests.Add(guest);
            await _context.SaveChangesAsync();
        }

        // Generate booking reference
        var bookingRef = $"BK{DateTime.UtcNow.Ticks.ToString().Substring(8)}";

        // Assign room if RoomTypeId is provided but not RoomId
        int? assignedRoomId = dto.RoomId;
        if (!dto.RoomId.HasValue && dto.RoomTypeId.HasValue)
        {
            var availableRoom = await _context.Rooms
                .Where(r => r.RoomTypeId == dto.RoomTypeId.Value
                       && r.Status == "Available"
                       && r.IsActive)
                .FirstOrDefaultAsync();

            if (availableRoom != null)
            {
                assignedRoomId = availableRoom.RoomId;
            }
        }

        var reservation = new Reservation
        {
            BookingReference = bookingRef,
            PropertyId = 1, // Default property
            RoomId = assignedRoomId,
            GuestId = guest.GuestId,
            CheckInDate = dto.CheckInDate,
            CheckOutDate = dto.CheckOutDate,
            Adults = dto.Adults,
            Children = dto.Children,
            Status = "Confirmed",
            TotalAmount = dto.TotalAmount,
            PaidAmount = dto.DepositAmount,
            Source = dto.Source,
            SpecialRequests = dto.SpecialRequests,
            ConfirmedDate = DateTime.UtcNow
        };

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        // Fetch the created reservation with all related data
        var createdReservation = await _context.Reservations
            .Include(r => r.Guest)
            .Include(r => r.Room)
                .ThenInclude(room => room!.RoomType)
            .Where(r => r.ReservationId == reservation.ReservationId)
            .Select(r => new ReservationResponseDto
            {
                ReservationId = r.ReservationId,
                BookingReference = r.BookingReference,
                GuestName = $"{r.Guest!.FirstName} {r.Guest.LastName}",
                GuestEmail = r.Guest.Email,
                RoomNumber = r.Room != null ? r.Room.RoomNumber : null,
                RoomType = r.Room != null && r.Room.RoomType != null ? r.Room.RoomType.Name : null,
                CheckInDate = r.CheckInDate,
                CheckOutDate = r.CheckOutDate,
                Adults = r.Adults,
                Children = r.Children,
                Status = r.Status,
                TotalAmount = r.TotalAmount,
                PaidAmount = r.PaidAmount,
                Outstanding = r.TotalAmount - r.PaidAmount,
                Source = r.Source,
                SpecialRequests = r.SpecialRequests,
                CreatedDate = r.CreatedDate
            })
            .FirstAsync();

        return CreatedAtAction(nameof(GetReservation), new { id = reservation.ReservationId }, createdReservation);
    }

    // PUT: api/reservations/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReservation(int id, UpdateReservationDto dto)
    {
        var reservation = await _context.Reservations.FindAsync(id);

        if (reservation == null)
        {
            return NotFound();
        }

        if (dto.CheckInDate.HasValue)
            reservation.CheckInDate = dto.CheckInDate.Value;

        if (dto.CheckOutDate.HasValue)
            reservation.CheckOutDate = dto.CheckOutDate.Value;

        if (dto.Adults.HasValue)
            reservation.Adults = dto.Adults.Value;

        if (dto.Children.HasValue)
            reservation.Children = dto.Children.Value;

        if (dto.RoomId.HasValue)
            reservation.RoomId = dto.RoomId.Value;

        if (!string.IsNullOrEmpty(dto.Status))
            reservation.Status = dto.Status;

        if (dto.TotalAmount.HasValue)
            reservation.TotalAmount = dto.TotalAmount.Value;

        if (dto.PaidAmount.HasValue)
            reservation.PaidAmount = dto.PaidAmount.Value;

        if (dto.SpecialRequests != null)
            reservation.SpecialRequests = dto.SpecialRequests;

        reservation.ModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/reservations/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReservation(int id)
    {
        var reservation = await _context.Reservations.FindAsync(id);

        if (reservation == null)
        {
            return NotFound();
        }

        // Soft delete by setting status to Cancelled
        reservation.Status = "Cancelled";
        reservation.ModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
