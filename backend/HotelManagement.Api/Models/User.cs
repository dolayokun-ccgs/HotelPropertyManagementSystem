using System.ComponentModel.DataAnnotations;

namespace HotelManagement.Api.Models;

public class User
{
    public int UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public int? PropertyId { get; set; }

    [MaxLength(50)]
    public string? Role { get; set; } = "User"; // User, Admin, Manager, etc.

    public bool IsActive { get; set; } = true;

    public bool RememberEmail { get; set; } = false;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public DateTime? LastLoginDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    // Navigation property
    public Property? Property { get; set; }
}
