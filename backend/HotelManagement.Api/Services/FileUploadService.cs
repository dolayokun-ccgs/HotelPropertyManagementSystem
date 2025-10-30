using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace HotelManagement.Api.Services;

public class FileUploadService : IFileUploadService
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<FileUploadService> _logger;
    private readonly long _maxFileSize = 10 * 1024 * 1024; // 10MB
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private readonly string[] _allowedMimeTypes = { "image/jpeg", "image/png", "image/gif", "image/webp" };

    public FileUploadService(IWebHostEnvironment environment, ILogger<FileUploadService> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    public FileValidationResult ValidateImageFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return new FileValidationResult
            {
                IsValid = false,
                ErrorMessage = "File is required"
            };
        }

        if (file.Length > _maxFileSize)
        {
            return new FileValidationResult
            {
                IsValid = false,
                ErrorMessage = $"File size exceeds maximum allowed size of {_maxFileSize / (1024 * 1024)}MB"
            };
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(extension))
        {
            return new FileValidationResult
            {
                IsValid = false,
                ErrorMessage = $"File type {extension} is not allowed. Allowed types: {string.Join(", ", _allowedExtensions)}"
            };
        }

        if (!_allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
        {
            return new FileValidationResult
            {
                IsValid = false,
                ErrorMessage = $"MIME type {file.ContentType} is not allowed"
            };
        }

        return new FileValidationResult { IsValid = true };
    }

    public async Task<FileUploadResult> UploadImageAsync(IFormFile file, string category)
    {
        try
        {
            // Validate category
            var validCategories = new[] { "property", "room-types", "extras", "guest-communications", "floor-plans" };
            var categoryPath = category.ToLowerInvariant().Replace(" ", "-");

            if (!validCategories.Contains(categoryPath))
            {
                categoryPath = "property"; // Default to property if invalid category
            }

            // Generate unique filename
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var storedFileName = $"{Guid.NewGuid()}{extension}";

            // Create directory path
            var uploadPath = Path.Combine("uploads", "media-library", categoryPath);
            var fullUploadPath = Path.Combine(_environment.ContentRootPath, "wwwroot", uploadPath);

            // Ensure directory exists
            Directory.CreateDirectory(fullUploadPath);

            // Full file path
            var filePath = Path.Combine(fullUploadPath, storedFileName);
            var relativePath = Path.Combine(uploadPath, storedFileName);

            // Get image dimensions and save file
            int? width = null;
            int? height = null;

            using (var stream = file.OpenReadStream())
            {
                try
                {
                    using (var image = await Image.LoadAsync(stream))
                    {
                        width = image.Width;
                        height = image.Height;

                        // Save the image
                        await image.SaveAsync(filePath);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing image");

                    // Fallback: save without processing if Image.Load fails
                    stream.Position = 0;
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await stream.CopyToAsync(fileStream);
                    }
                }
            }

            return new FileUploadResult
            {
                Success = true,
                StoredFileName = storedFileName,
                RelativePath = relativePath.Replace("\\", "/"),
                Width = width,
                Height = height
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file");
            return new FileUploadResult
            {
                Success = false,
                ErrorMessage = "An error occurred while uploading the file"
            };
        }
    }

    public async Task<bool> DeleteFileAsync(string filePath)
    {
        try
        {
            var fullPath = Path.Combine(_environment.ContentRootPath, "wwwroot", filePath);

            if (File.Exists(fullPath))
            {
                await Task.Run(() => File.Delete(fullPath));
                return true;
            }

            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file {FilePath}", filePath);
            return false;
        }
    }
}
