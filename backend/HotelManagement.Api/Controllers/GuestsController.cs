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
public class GuestsController : ControllerBase
{
    private readonly HotelDbContext _context;

    public GuestsController(HotelDbContext context)
    {
        _context = context;
    }

    // GET: api/guests
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GuestResponseDto>>> GetGuests(
        [FromQuery] string? search = null,
        [FromQuery] bool? isActive = null)
    {
        var query = _context.Guests
            .Include(g => g.Reservations)
            .AsQueryable();

        // Search by name, email, phone, or booking number
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(g =>
                g.FirstName.Contains(search) ||
                g.LastName.Contains(search) ||
                g.Email.Contains(search) ||
                (g.Phone != null && g.Phone.Contains(search)) ||
                g.Reservations.Any(r => r.BookingReference.Contains(search)));
        }

        if (isActive.HasValue)
        {
            query = query.Where(g => g.IsActive == isActive.Value);
        }

        var guests = await query
            .OrderByDescending(g => g.CreatedDate)
            .Select(g => new GuestResponseDto
            {
                GuestId = g.GuestId,
                FirstName = g.FirstName,
                LastName = g.LastName,
                Email = g.Email,
                Phone = g.Phone,
                Organisation = g.Organisation,
                AddressLine1 = g.AddressLine1,
                AddressLine2 = g.AddressLine2,
                City = g.City,
                State = g.State,
                PostalCode = g.PostalCode,
                Country = g.Country,
                IdType = g.IdType,
                IdNumber = g.IdNumber,
                DateOfBirth = g.DateOfBirth,
                Nationality = g.Nationality,
                Comments = g.Comments,
                IsActive = g.IsActive,
                CreatedDate = g.CreatedDate,
                TotalReservations = g.Reservations.Count,
                LastStayDate = g.Reservations
                    .Where(r => r.Status == "CheckedOut")
                    .OrderByDescending(r => r.CheckOutDate)
                    .Select(r => (DateTime?)r.CheckOutDate)
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(guests);
    }

    // GET: api/guests/5
    [HttpGet("{id}")]
    public async Task<ActionResult<GuestResponseDto>> GetGuest(int id)
    {
        var guest = await _context.Guests
            .Include(g => g.Reservations)
            .Where(g => g.GuestId == id)
            .Select(g => new GuestResponseDto
            {
                GuestId = g.GuestId,
                FirstName = g.FirstName,
                LastName = g.LastName,
                Email = g.Email,
                Phone = g.Phone,
                Organisation = g.Organisation,
                AddressLine1 = g.AddressLine1,
                AddressLine2 = g.AddressLine2,
                City = g.City,
                State = g.State,
                PostalCode = g.PostalCode,
                Country = g.Country,
                IdType = g.IdType,
                IdNumber = g.IdNumber,
                DateOfBirth = g.DateOfBirth,
                Nationality = g.Nationality,
                Comments = g.Comments,
                IsActive = g.IsActive,
                CreatedDate = g.CreatedDate,
                TotalReservations = g.Reservations.Count,
                LastStayDate = g.Reservations
                    .Where(r => r.Status == "CheckedOut")
                    .OrderByDescending(r => r.CheckOutDate)
                    .Select(r => (DateTime?)r.CheckOutDate)
                    .FirstOrDefault()
            })
            .FirstOrDefaultAsync();

        if (guest == null)
        {
            return NotFound();
        }

        return Ok(guest);
    }

    // POST: api/guests
    [HttpPost]
    public async Task<ActionResult<GuestResponseDto>> CreateGuest(CreateGuestDto dto)
    {
        // Check if guest with same email already exists
        var existingGuest = await _context.Guests
            .FirstOrDefaultAsync(g => g.Email == dto.Email);

        if (existingGuest != null)
        {
            return Conflict(new { message = "A guest with this email already exists" });
        }

        var guest = new Guest
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            Organisation = dto.Organisation,
            AddressLine1 = dto.AddressLine1,
            AddressLine2 = dto.AddressLine2,
            City = dto.City,
            State = dto.State,
            PostalCode = dto.PostalCode,
            Country = dto.Country,
            IdType = dto.IdType,
            IdNumber = dto.IdNumber,
            DateOfBirth = dto.DateOfBirth,
            Nationality = dto.Nationality,
            Comments = dto.Comments,
            IsActive = true,
            CreatedDate = DateTime.UtcNow
        };

        _context.Guests.Add(guest);
        await _context.SaveChangesAsync();

        var createdGuest = await GetGuest(guest.GuestId);
        return CreatedAtAction(nameof(GetGuest), new { id = guest.GuestId }, createdGuest.Value);
    }

    // PUT: api/guests/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGuest(int id, UpdateGuestDto dto)
    {
        var guest = await _context.Guests.FindAsync(id);

        if (guest == null)
        {
            return NotFound();
        }

        // Check if email is being changed to an existing email
        if (!string.IsNullOrEmpty(dto.Email) && dto.Email != guest.Email)
        {
            var existingGuest = await _context.Guests
                .FirstOrDefaultAsync(g => g.Email == dto.Email && g.GuestId != id);

            if (existingGuest != null)
            {
                return Conflict(new { message = "A guest with this email already exists" });
            }

            guest.Email = dto.Email;
        }

        if (!string.IsNullOrEmpty(dto.FirstName))
            guest.FirstName = dto.FirstName;

        if (!string.IsNullOrEmpty(dto.LastName))
            guest.LastName = dto.LastName;

        if (dto.Phone != null)
            guest.Phone = dto.Phone;

        if (dto.Organisation != null)
            guest.Organisation = dto.Organisation;

        if (dto.AddressLine1 != null)
            guest.AddressLine1 = dto.AddressLine1;

        if (dto.AddressLine2 != null)
            guest.AddressLine2 = dto.AddressLine2;

        if (dto.City != null)
            guest.City = dto.City;

        if (dto.State != null)
            guest.State = dto.State;

        if (dto.PostalCode != null)
            guest.PostalCode = dto.PostalCode;

        if (dto.Country != null)
            guest.Country = dto.Country;

        if (dto.IdType != null)
            guest.IdType = dto.IdType;

        if (dto.IdNumber != null)
            guest.IdNumber = dto.IdNumber;

        if (dto.DateOfBirth.HasValue)
            guest.DateOfBirth = dto.DateOfBirth;

        if (dto.Nationality != null)
            guest.Nationality = dto.Nationality;

        if (dto.Comments != null)
            guest.Comments = dto.Comments;

        if (dto.IsActive.HasValue)
            guest.IsActive = dto.IsActive.Value;

        guest.ModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/guests/5 (Soft delete)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGuest(int id)
    {
        var guest = await _context.Guests.FindAsync(id);

        if (guest == null)
        {
            return NotFound();
        }

        // Soft delete by marking as inactive
        guest.IsActive = false;
        guest.ModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/guests/5/reservations
    [HttpGet("{id}/reservations")]
    public async Task<ActionResult<IEnumerable<ReservationResponseDto>>> GetGuestReservations(int id)
    {
        var guest = await _context.Guests.FindAsync(id);
        if (guest == null)
        {
            return NotFound();
        }

        var reservations = await _context.Reservations
            .Include(r => r.Guest)
            .Include(r => r.Room)
                .ThenInclude(room => room!.RoomType)
            .Where(r => r.GuestId == id)
            .OrderByDescending(r => r.CheckInDate)
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
                PaidAmount = r.TotalReceived,
                Outstanding = r.TotalAmount - r.TotalReceived,
                Source = r.Source,
                SpecialRequests = r.SpecialRequests,
                CreatedDate = r.CreatedDate
            })
            .ToListAsync();

        return Ok(reservations);
    }
}
