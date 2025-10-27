using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Api.Data;
using HotelManagement.Api.Models;

namespace HotelManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromotionsController : ControllerBase
{
    private readonly HotelDbContext _context;

    public PromotionsController(HotelDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Promotion>>> GetAll([FromQuery] bool? isActive = null)
    {
        var query = _context.Promotions.AsQueryable();

        if (isActive.HasValue)
        {
            query = query.Where(p => p.IsActive == isActive.Value);
        }

        var promotions = await query
            .OrderByDescending(p => p.CreatedDate)
            .ToListAsync();

        return Ok(promotions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Promotion>> GetById(int id)
    {
        var promotion = await _context.Promotions.FindAsync(id);

        if (promotion == null)
        {
            return NotFound();
        }

        return Ok(promotion);
    }

    [HttpPost]
    public async Task<ActionResult<Promotion>> Create([FromBody] Promotion promotion)
    {
        // Assign to first property if not specified
        if (promotion.PropertyId == 0)
        {
            promotion.PropertyId = 1;
        }

        promotion.CreatedDate = DateTime.UtcNow;
        promotion.IsActive = true;

        _context.Promotions.Add(promotion);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = promotion.PromotionId }, promotion);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Promotion>> Update(int id, [FromBody] Promotion promotion)
    {
        if (id != promotion.PromotionId)
        {
            return BadRequest("ID mismatch");
        }

        var existingPromotion = await _context.Promotions.FindAsync(id);
        if (existingPromotion == null)
        {
            return NotFound();
        }

        existingPromotion.Code = promotion.Code;
        existingPromotion.Description = promotion.Description;
        existingPromotion.DefaultDiscount = promotion.DefaultDiscount;
        existingPromotion.Currency = promotion.Currency;
        existingPromotion.ShowDiscountToGuests = promotion.ShowDiscountToGuests;
        existingPromotion.StayAnyDate = promotion.StayAnyDate;
        existingPromotion.StayStartDate = promotion.StayStartDate;
        existingPromotion.StayEndDate = promotion.StayEndDate;
        existingPromotion.SellAnyDate = promotion.SellAnyDate;
        existingPromotion.SellStartDate = promotion.SellStartDate;
        existingPromotion.SellEndDate = promotion.SellEndDate;
        existingPromotion.AssignedRoomRateIds = promotion.AssignedRoomRateIds;
        existingPromotion.ModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(existingPromotion);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var promotion = await _context.Promotions.FindAsync(id);

        if (promotion == null)
        {
            return NotFound();
        }

        // Soft delete
        promotion.IsActive = false;
        promotion.ModifiedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
