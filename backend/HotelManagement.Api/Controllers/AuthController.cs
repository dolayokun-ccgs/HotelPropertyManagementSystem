using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using HotelManagement.Api.Data;
using HotelManagement.Api.Models;
using HotelManagement.Api.DTOs;
using HotelManagement.Api.Services;

namespace HotelManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly HotelDbContext _context;
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _configuration;

    public AuthController(
        HotelDbContext context,
        IAuthService authService,
        ILogger<AuthController> logger,
        IConfiguration configuration)
    {
        _context = context;
        _authService = authService;
        _logger = logger;
        _configuration = configuration;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            // Find user by email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Verify password using AuthService
            if (!_authService.VerifyPassword(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Update remember email preference and last login
            user.RememberEmail = request.RememberMe;
            user.LastLoginDate = DateTime.UtcNow;
            user.ModifiedDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Generate JWT token using AuthService
            var token = _authService.GenerateJwtToken(
                user.UserId,
                user.Email,
                user.Role,
                user.PropertyId
            );

            var response = new LoginResponse
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                User = new UserResponseDto
                {
                    UserId = user.UserId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role,
                    PropertyId = user.PropertyId,
                    IsActive = user.IsActive
                }
            };

            _logger.LogInformation("User {Email} logged in successfully", user.Email);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "User with this email already exists" });
            }

            // Hash password using AuthService
            var passwordHash = _authService.HashPassword(request.Password);

            // Create new user
            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = passwordHash,
                PropertyId = request.PropertyId,
                Role = "User",
                IsActive = true,
                CreatedDate = DateTime.UtcNow,
                LastLoginDate = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate JWT token using AuthService
            var token = _authService.GenerateJwtToken(
                user.UserId,
                user.Email,
                user.Role,
                user.PropertyId
            );

            var response = new LoginResponse
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                User = new UserResponseDto
                {
                    UserId = user.UserId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role,
                    PropertyId = user.PropertyId,
                    IsActive = user.IsActive
                }
            };

            _logger.LogInformation("User {Email} registered successfully", user.Email);

            return CreatedAtAction(nameof(GetCurrentUser), new { }, response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { message = "An error occurred during registration" });
        }
    }

    // GET: api/auth/me
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserResponseDto>> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId && u.IsActive);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var response = new UserResponseDto
            {
                UserId = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                PropertyId = user.PropertyId,
                IsActive = user.IsActive
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
            return StatusCode(500, new { message = "An error occurred while fetching user data" });
        }
    }

    // POST: api/auth/logout
    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        _logger.LogInformation("User logged out");
        return Ok(new { message = "Logged out successfully" });
    }

    // POST: api/auth/refresh
    [HttpPost("refresh")]
    [Authorize]
    public async Task<ActionResult<LoginResponse>> RefreshToken()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId && u.IsActive);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var token = _authService.GenerateJwtToken(
                user.UserId,
                user.Email,
                user.Role,
                user.PropertyId
            );

            var response = new LoginResponse
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                User = new UserResponseDto
                {
                    UserId = user.UserId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role,
                    PropertyId = user.PropertyId,
                    IsActive = user.IsActive
                }
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return StatusCode(500, new { message = "An error occurred while refreshing token" });
        }
    }
}
