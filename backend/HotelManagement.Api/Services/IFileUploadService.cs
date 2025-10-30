namespace HotelManagement.Api.Services;

public interface IFileUploadService
{
    Task<FileUploadResult> UploadImageAsync(IFormFile file, string category);
    Task<bool> DeleteFileAsync(string filePath);
    FileValidationResult ValidateImageFile(IFormFile file);
}

public class FileUploadResult
{
    public bool Success { get; set; }
    public string? StoredFileName { get; set; }
    public string? RelativePath { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    public string? ErrorMessage { get; set; }
}

public class FileValidationResult
{
    public bool IsValid { get; set; }
    public string? ErrorMessage { get; set; }
}
