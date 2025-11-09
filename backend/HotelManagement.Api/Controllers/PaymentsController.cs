using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Api.Data;
using HotelManagement.Api.Models;
using HotelManagement.Api.DTOs;
using System.Security.Claims;

namespace HotelManagement.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly HotelDbContext _context;

    public PaymentsController(HotelDbContext context)
    {
        _context = context;
    }

    // GET: api/payments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PaymentResponseDto>>> GetPayments(
        [FromQuery] int? reservationId = null,
        [FromQuery] string? paymentMethod = null,
        [FromQuery] DateTime? from = null,
        [FromQuery] DateTime? to = null)
    {
        var query = _context.Payments
            .Include(p => p.Reservation)
            .Include(p => p.ProcessedByUser)
            .AsQueryable();

        if (reservationId.HasValue)
        {
            query = query.Where(p => p.ReservationId == reservationId.Value);
        }

        if (!string.IsNullOrEmpty(paymentMethod))
        {
            query = query.Where(p => p.PaymentMethod == paymentMethod);
        }

        if (from.HasValue)
        {
            query = query.Where(p => p.PaymentDate >= from.Value);
        }

        if (to.HasValue)
        {
            query = query.Where(p => p.PaymentDate <= to.Value);
        }

        var payments = await query
            .OrderByDescending(p => p.PaymentDate)
            .Select(p => new PaymentResponseDto
            {
                PaymentId = p.PaymentId,
                ReservationId = p.ReservationId,
                BookingReference = p.Reservation!.BookingReference,
                Amount = p.Amount,
                Surcharge = p.Surcharge,
                PaymentMethod = p.PaymentMethod,
                CardNumber = p.CardNumber,
                CardName = p.CardName,
                TransactionReference = p.TransactionReference,
                Notes = p.Notes,
                PaymentDate = p.PaymentDate,
                Status = p.Status,
                ProcessedBy = p.ProcessedBy,
                ProcessedByName = p.ProcessedByUser != null
                    ? $"{p.ProcessedByUser.FirstName} {p.ProcessedByUser.LastName}"
                    : null,
                CreatedDate = p.CreatedDate
            })
            .ToListAsync();

        return Ok(payments);
    }

    // GET: api/payments/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PaymentResponseDto>> GetPayment(int id)
    {
        var payment = await _context.Payments
            .Include(p => p.Reservation)
            .Include(p => p.ProcessedByUser)
            .Where(p => p.PaymentId == id)
            .Select(p => new PaymentResponseDto
            {
                PaymentId = p.PaymentId,
                ReservationId = p.ReservationId,
                BookingReference = p.Reservation!.BookingReference,
                Amount = p.Amount,
                Surcharge = p.Surcharge,
                PaymentMethod = p.PaymentMethod,
                CardNumber = p.CardNumber,
                CardName = p.CardName,
                TransactionReference = p.TransactionReference,
                Notes = p.Notes,
                PaymentDate = p.PaymentDate,
                Status = p.Status,
                ProcessedBy = p.ProcessedBy,
                ProcessedByName = p.ProcessedByUser != null
                    ? $"{p.ProcessedByUser.FirstName} {p.ProcessedByUser.LastName}"
                    : null,
                CreatedDate = p.CreatedDate
            })
            .FirstOrDefaultAsync();

        if (payment == null)
        {
            return NotFound();
        }

        return Ok(payment);
    }

    // POST: api/payments
    [HttpPost]
    public async Task<ActionResult<PaymentResponseDto>> CreatePayment(CreatePaymentDto dto)
    {
        // Verify reservation exists
        var reservation = await _context.Reservations.FindAsync(dto.ReservationId);
        if (reservation == null)
        {
            return NotFound(new { message = "Reservation not found" });
        }

        // Get current user ID from claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int? processedBy = userIdClaim != null ? int.Parse(userIdClaim) : null;

        var payment = new Payment
        {
            ReservationId = dto.ReservationId,
            Amount = dto.Amount,
            Surcharge = dto.Surcharge,
            PaymentMethod = dto.PaymentMethod,
            CardNumber = dto.CardNumber,
            CardName = dto.CardName,
            TransactionReference = dto.TransactionReference,
            Notes = dto.Notes,
            PaymentDate = dto.PaymentDate ?? DateTime.UtcNow,
            Status = "Completed",
            ProcessedBy = processedBy,
            CreatedDate = DateTime.UtcNow
        };

        _context.Payments.Add(payment);

        // Update reservation TotalReceived
        reservation.TotalReceived += (dto.Amount + dto.Surcharge);
        reservation.ModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var createdPayment = await GetPayment(payment.PaymentId);
        return CreatedAtAction(nameof(GetPayment), new { id = payment.PaymentId }, createdPayment.Value);
    }

    // PUT: api/payments/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePayment(int id, UpdatePaymentDto dto)
    {
        var payment = await _context.Payments
            .Include(p => p.Reservation)
            .FirstOrDefaultAsync(p => p.PaymentId == id);

        if (payment == null)
        {
            return NotFound();
        }

        // Calculate the difference to update reservation total
        decimal oldTotal = payment.Amount + payment.Surcharge;

        if (dto.Amount.HasValue)
            payment.Amount = dto.Amount.Value;

        if (dto.Surcharge.HasValue)
            payment.Surcharge = dto.Surcharge.Value;

        if (!string.IsNullOrEmpty(dto.PaymentMethod))
            payment.PaymentMethod = dto.PaymentMethod;

        if (dto.CardNumber != null)
            payment.CardNumber = dto.CardNumber;

        if (dto.CardName != null)
            payment.CardName = dto.CardName;

        if (dto.TransactionReference != null)
            payment.TransactionReference = dto.TransactionReference;

        if (dto.Notes != null)
            payment.Notes = dto.Notes;

        if (dto.PaymentDate.HasValue)
            payment.PaymentDate = dto.PaymentDate.Value;

        if (!string.IsNullOrEmpty(dto.Status))
            payment.Status = dto.Status;

        payment.ModifiedDate = DateTime.UtcNow;

        // Update reservation TotalReceived if amount changed
        decimal newTotal = payment.Amount + payment.Surcharge;
        if (oldTotal != newTotal && payment.Reservation != null)
        {
            payment.Reservation.TotalReceived = payment.Reservation.TotalReceived - oldTotal + newTotal;
            payment.Reservation.ModifiedDate = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/payments/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePayment(int id)
    {
        var payment = await _context.Payments
            .Include(p => p.Reservation)
            .FirstOrDefaultAsync(p => p.PaymentId == id);

        if (payment == null)
        {
            return NotFound();
        }

        // Update reservation TotalReceived
        if (payment.Reservation != null)
        {
            payment.Reservation.TotalReceived -= (payment.Amount + payment.Surcharge);
            payment.Reservation.ModifiedDate = DateTime.UtcNow;
        }

        _context.Payments.Remove(payment);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/payments/reservation/5
    [HttpGet("reservation/{reservationId}")]
    public async Task<ActionResult<IEnumerable<PaymentResponseDto>>> GetReservationPayments(int reservationId)
    {
        var reservation = await _context.Reservations.FindAsync(reservationId);
        if (reservation == null)
        {
            return NotFound(new { message = "Reservation not found" });
        }

        var payments = await _context.Payments
            .Include(p => p.Reservation)
            .Include(p => p.ProcessedByUser)
            .Where(p => p.ReservationId == reservationId)
            .OrderByDescending(p => p.PaymentDate)
            .Select(p => new PaymentResponseDto
            {
                PaymentId = p.PaymentId,
                ReservationId = p.ReservationId,
                BookingReference = p.Reservation!.BookingReference,
                Amount = p.Amount,
                Surcharge = p.Surcharge,
                PaymentMethod = p.PaymentMethod,
                CardNumber = p.CardNumber,
                CardName = p.CardName,
                TransactionReference = p.TransactionReference,
                Notes = p.Notes,
                PaymentDate = p.PaymentDate,
                Status = p.Status,
                ProcessedBy = p.ProcessedBy,
                ProcessedByName = p.ProcessedByUser != null
                    ? $"{p.ProcessedByUser.FirstName} {p.ProcessedByUser.LastName}"
                    : null,
                CreatedDate = p.CreatedDate
            })
            .ToListAsync();

        return Ok(payments);
    }
}
