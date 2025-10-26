using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Api.Data;
using HotelManagement.Api.DTOs;

namespace HotelManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly HotelDbContext _context;

    public RoomsController(HotelDbContext context)
    {
        _context = context;
    }

    // GET: api/rooms
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoomResponseDto>>> GetRooms()
    {
        var rooms = await _context.Rooms
            .Include(r => r.RoomType)
            .Where(r => r.IsActive)
            .Select(r => new RoomResponseDto
            {
                RoomId = r.RoomId,
                RoomNumber = r.RoomNumber,
                FloorNumber = r.FloorNumber ?? 0,
                Status = r.Status,
                CleaningStatus = r.CleaningStatus,
                RoomTypeName = r.RoomType!.Name,
                MaxOccupancy = r.RoomType.MaxOccupancy,
                BedType = r.RoomType.BedType
            })
            .OrderBy(r => r.RoomNumber)
            .ToListAsync();

        return Ok(rooms);
    }

    // GET: api/rooms/types
    [HttpGet("types")]
    public async Task<ActionResult<IEnumerable<RoomTypeResponseDto>>> GetRoomTypes()
    {
        var roomTypes = await _context.RoomTypes
            .Include(rt => rt.Rooms)
            .Where(rt => rt.IsActive)
            .Select(rt => new RoomTypeResponseDto
            {
                RoomTypeId = rt.RoomTypeId,
                Name = rt.Name,
                Description = rt.Description,
                MaxOccupancy = rt.MaxOccupancy,
                BaseOccupancy = rt.BaseOccupancy,
                BedType = rt.BedType,
                RoomSize = rt.RoomSize,
                AvailableRooms = rt.Rooms.Count(r => r.Status == "Available" && r.IsActive)
            })
            .ToListAsync();

        return Ok(roomTypes);
    }

    // GET: api/rooms/5
    [HttpGet("{id}")]
    public async Task<ActionResult<RoomResponseDto>> GetRoom(int id)
    {
        var room = await _context.Rooms
            .Include(r => r.RoomType)
            .Where(r => r.RoomId == id)
            .Select(r => new RoomResponseDto
            {
                RoomId = r.RoomId,
                RoomNumber = r.RoomNumber,
                FloorNumber = r.FloorNumber ?? 0,
                Status = r.Status,
                CleaningStatus = r.CleaningStatus,
                RoomTypeName = r.RoomType!.Name,
                MaxOccupancy = r.RoomType.MaxOccupancy,
                BedType = r.RoomType.BedType
            })
            .FirstOrDefaultAsync();

        if (room == null)
        {
            return NotFound();
        }

        return Ok(room);
    }

    // GET: api/rooms/available?checkIn=2025-10-26&checkOut=2025-10-28
    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<RoomResponseDto>>> GetAvailableRooms(
        [FromQuery] DateTime checkIn,
        [FromQuery] DateTime checkOut)
    {
        // Get rooms that don't have overlapping reservations
        var availableRooms = await _context.Rooms
            .Include(r => r.RoomType)
            .Where(r => r.IsActive
                && r.Status == "Available"
                && !r.Reservations.Any(res =>
                    res.Status != "Cancelled"
                    && ((checkIn >= res.CheckInDate && checkIn < res.CheckOutDate)
                    || (checkOut > res.CheckInDate && checkOut <= res.CheckOutDate)
                    || (checkIn <= res.CheckInDate && checkOut >= res.CheckOutDate))))
            .Select(r => new RoomResponseDto
            {
                RoomId = r.RoomId,
                RoomNumber = r.RoomNumber,
                FloorNumber = r.FloorNumber ?? 0,
                Status = r.Status,
                CleaningStatus = r.CleaningStatus,
                RoomTypeName = r.RoomType!.Name,
                MaxOccupancy = r.RoomType.MaxOccupancy,
                BedType = r.RoomType.BedType
            })
            .ToListAsync();

        return Ok(availableRooms);
    }
}
