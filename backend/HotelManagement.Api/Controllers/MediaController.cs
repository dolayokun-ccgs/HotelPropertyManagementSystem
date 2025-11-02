using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManagement.Api.Data;
using HotelManagement.Api.Models;
using HotelManagement.Api.Services;

namespace HotelManagement.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MediaController : ControllerBase
{
    private readonly HotelDbContext _context;
    private readonly ILogger<MediaController> _logger;
    private readonly IFileUploadService _fileUploadService;

    public MediaController(HotelDbContext context, ILogger<MediaController> logger, IFileUploadService fileUploadService)
    {
        _context = context;
        _logger = logger;
        _fileUploadService = fileUploadService;
    }

    // GET: api/media
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetMedia(
        [FromQuery] int? propertyId,
        [FromQuery] string? category,
        [FromQuery] string? caption,
        [FromQuery] bool? isActive)
    {
        try
        {
            var query = _context.Media.AsQueryable();

            if (propertyId.HasValue)
            {
                query = query.Where(m => m.PropertyId == propertyId.Value);
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(m => m.Category == category);
            }

            if (!string.IsNullOrEmpty(caption))
            {
                query = query.Where(m => m.Caption != null && m.Caption.Contains(caption));
            }

            if (isActive.HasValue)
            {
                query = query.Where(m => m.IsActive == isActive.Value);
            }

            var media = await query
                .OrderByDescending(m => m.UploadedDate)
                .Select(m => new
                {
                    m.MediaId,
                    m.PropertyId,
                    m.FileName,
                    m.StoredFileName,
                    m.FilePath,
                    m.FileSize,
                    m.MimeType,
                    m.Width,
                    m.Height,
                    m.Caption,
                    m.Category,
                    m.UploadedBy,
                    m.UploadedDate,
                    m.IsActive,
                    Url = $"/uploads/{m.FilePath.Replace("\\", "/")}"
                })
                .ToListAsync();

            return Ok(media);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving media");
            return StatusCode(500, "An error occurred while retrieving media");
        }
    }

    // GET: api/media/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetMedia(int id)
    {
        try
        {
            var media = await _context.Media
                .Where(m => m.MediaId == id)
                .Select(m => new
                {
                    m.MediaId,
                    m.PropertyId,
                    m.FileName,
                    m.StoredFileName,
                    m.FilePath,
                    m.FileSize,
                    m.MimeType,
                    m.Width,
                    m.Height,
                    m.Caption,
                    m.Category,
                    m.UploadedBy,
                    m.UploadedDate,
                    m.IsActive,
                    Url = $"/uploads/{m.FilePath.Replace("\\", "/")}"
                })
                .FirstOrDefaultAsync();

            if (media == null)
            {
                return NotFound();
            }

            return Ok(media);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving media {MediaId}", id);
            return StatusCode(500, "An error occurred while retrieving the media");
        }
    }

    // POST: api/media/upload
    [HttpPost("upload")]
    public async Task<ActionResult<object>> UploadMedia(
        [FromForm] IFormFile file,
        [FromForm] int propertyId,
        [FromForm] string category,
        [FromForm] string? caption,
        [FromForm] int uploadedBy)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            // Validate file
            var validationResult = _fileUploadService.ValidateImageFile(file);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.ErrorMessage);
            }

            // Upload file
            var uploadResult = await _fileUploadService.UploadImageAsync(file, category);
            if (!uploadResult.Success)
            {
                return BadRequest(uploadResult.ErrorMessage);
            }

            // Create media record
            var media = new Media
            {
                PropertyId = propertyId,
                FileName = file.FileName,
                StoredFileName = uploadResult.StoredFileName!,
                FilePath = uploadResult.RelativePath!,
                FileSize = file.Length,
                MimeType = file.ContentType,
                Width = uploadResult.Width,
                Height = uploadResult.Height,
                Caption = caption,
                Category = category,
                UploadedBy = uploadedBy,
                UploadedDate = DateTime.UtcNow,
                IsActive = true
            };

            _context.Media.Add(media);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMedia), new { id = media.MediaId }, new
            {
                media.MediaId,
                media.PropertyId,
                media.FileName,
                media.StoredFileName,
                media.FilePath,
                media.FileSize,
                media.MimeType,
                media.Width,
                media.Height,
                media.Caption,
                media.Category,
                media.UploadedBy,
                media.UploadedDate,
                media.IsActive,
                Url = $"/uploads/{media.FilePath.Replace("\\", "/")}"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading media");
            return StatusCode(500, "An error occurred while uploading the media");
        }
    }

    // PUT: api/media/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMedia(int id, [FromBody] UpdateMediaRequest request)
    {
        try
        {
            var media = await _context.Media.FindAsync(id);
            if (media == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(request.Caption))
            {
                media.Caption = request.Caption;
            }

            if (!string.IsNullOrEmpty(request.Category))
            {
                media.Category = request.Category;
            }

            if (request.IsActive.HasValue)
            {
                media.IsActive = request.IsActive.Value;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating media {MediaId}", id);
            return StatusCode(500, "An error occurred while updating the media");
        }
    }

    // DELETE: api/media/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedia(int id)
    {
        try
        {
            var media = await _context.Media.FindAsync(id);
            if (media == null)
            {
                return NotFound();
            }

            // Delete physical file
            await _fileUploadService.DeleteFileAsync(media.FilePath);

            // Delete database record
            _context.Media.Remove(media);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting media {MediaId}", id);
            return StatusCode(500, "An error occurred while deleting the media");
        }
    }

    // POST: api/media/roomtypes/{roomTypeId}/assign
    [HttpPost("roomtypes/{roomTypeId}/assign")]
    public async Task<ActionResult<object>> AssignMediaToRoomType(int roomTypeId, [FromBody] AssignMediaRequest request)
    {
        try
        {
            var roomType = await _context.RoomTypes.FindAsync(roomTypeId);
            if (roomType == null)
            {
                return NotFound("Room type not found");
            }

            var media = await _context.Media.FindAsync(request.MediaId);
            if (media == null)
            {
                return NotFound("Media not found");
            }

            // Check if already assigned
            var existing = await _context.RoomTypeMedia
                .FirstOrDefaultAsync(rtm => rtm.RoomTypeId == roomTypeId && rtm.MediaId == request.MediaId);

            if (existing != null)
            {
                return BadRequest("Media already assigned to this room type");
            }

            // If this is primary, unset other primary images
            if (request.IsPrimary)
            {
                var existingPrimary = await _context.RoomTypeMedia
                    .Where(rtm => rtm.RoomTypeId == roomTypeId && rtm.IsPrimary)
                    .ToListAsync();

                foreach (var item in existingPrimary)
                {
                    item.IsPrimary = false;
                }
            }

            var roomTypeMedia = new RoomTypeMedia
            {
                RoomTypeId = roomTypeId,
                MediaId = request.MediaId,
                DisplayOrder = request.DisplayOrder,
                IsPrimary = request.IsPrimary,
                AssignedDate = DateTime.UtcNow
            };

            _context.RoomTypeMedia.Add(roomTypeMedia);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoomTypeMedia), new { roomTypeId }, new
            {
                roomTypeMedia.RoomTypeMediaId,
                roomTypeMedia.RoomTypeId,
                roomTypeMedia.MediaId,
                roomTypeMedia.DisplayOrder,
                roomTypeMedia.IsPrimary,
                roomTypeMedia.AssignedDate
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning media to room type");
            return StatusCode(500, "An error occurred while assigning media");
        }
    }

    // GET: api/media/roomtypes/{roomTypeId}
    [HttpGet("roomtypes/{roomTypeId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetRoomTypeMedia(int roomTypeId)
    {
        try
        {
            var media = await _context.RoomTypeMedia
                .Include(rtm => rtm.Media)
                .Where(rtm => rtm.RoomTypeId == roomTypeId)
                .OrderBy(rtm => rtm.DisplayOrder)
                .Select(rtm => new
                {
                    rtm.RoomTypeMediaId,
                    rtm.RoomTypeId,
                    rtm.MediaId,
                    rtm.DisplayOrder,
                    rtm.IsPrimary,
                    Media = new
                    {
                        rtm.Media!.MediaId,
                        rtm.Media.FileName,
                        rtm.Media.StoredFileName,
                        rtm.Media.FilePath,
                        rtm.Media.FileSize,
                        rtm.Media.MimeType,
                        rtm.Media.Width,
                        rtm.Media.Height,
                        rtm.Media.Caption,
                        rtm.Media.Category,
                        Url = $"/uploads/{rtm.Media.FilePath.Replace("\\", "/")}"
                    }
                })
                .ToListAsync();

            return Ok(media);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving room type media");
            return StatusCode(500, "An error occurred while retrieving room type media");
        }
    }

    // DELETE: api/media/roomtypes/{roomTypeId}/media/{mediaId}
    [HttpDelete("roomtypes/{roomTypeId}/media/{mediaId}")]
    public async Task<IActionResult> UnassignMediaFromRoomType(int roomTypeId, int mediaId)
    {
        try
        {
            var roomTypeMedia = await _context.RoomTypeMedia
                .FirstOrDefaultAsync(rtm => rtm.RoomTypeId == roomTypeId && rtm.MediaId == mediaId);

            if (roomTypeMedia == null)
            {
                return NotFound();
            }

            _context.RoomTypeMedia.Remove(roomTypeMedia);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unassigning media from room type");
            return StatusCode(500, "An error occurred while unassigning media");
        }
    }
}

// DTOs
public class UpdateMediaRequest
{
    public string? Caption { get; set; }
    public string? Category { get; set; }
    public bool? IsActive { get; set; }
}

public class AssignMediaRequest
{
    public int MediaId { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsPrimary { get; set; } = false;
}
