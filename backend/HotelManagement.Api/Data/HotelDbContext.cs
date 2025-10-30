using Microsoft.EntityFrameworkCore;
using HotelManagement.Api.Models;

namespace HotelManagement.Api.Data;

public class HotelDbContext : DbContext
{
    public HotelDbContext(DbContextOptions<HotelDbContext> options) : base(options)
    {
    }

    public DbSet<Property> Properties { get; set; }
    public DbSet<RoomType> RoomTypes { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<Guest> Guests { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<RatePlan> RatePlans { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Promotion> Promotions { get; set; }
    public DbSet<Media> Media { get; set; }
    public DbSet<RoomTypeMedia> RoomTypeMedia { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Property configuration
        modelBuilder.Entity<Property>(entity =>
        {
            entity.HasKey(e => e.PropertyId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Currency).HasMaxLength(3);
        });

        // RoomType configuration
        modelBuilder.Entity<RoomType>(entity =>
        {
            entity.HasKey(e => e.RoomTypeId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasOne(e => e.Property)
                  .WithMany(p => p.RoomTypes)
                  .HasForeignKey(e => e.PropertyId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Room configuration
        modelBuilder.Entity<Room>(entity =>
        {
            entity.HasKey(e => e.RoomId);
            entity.Property(e => e.RoomNumber).IsRequired().HasMaxLength(20);
            entity.HasOne(e => e.RoomType)
                  .WithMany(rt => rt.Rooms)
                  .HasForeignKey(e => e.RoomTypeId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Property)
                  .WithMany(p => p.Rooms)
                  .HasForeignKey(e => e.PropertyId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Guest configuration
        modelBuilder.Entity<Guest>(entity =>
        {
            entity.HasKey(e => e.GuestId);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => e.Email);
        });

        // Reservation configuration
        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId);
            entity.Property(e => e.BookingReference).IsRequired().HasMaxLength(50);
            entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            entity.Property(e => e.PaidAmount).HasPrecision(18, 2);
            entity.HasOne(e => e.Property)
                  .WithMany(p => p.Reservations)
                  .HasForeignKey(e => e.PropertyId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Room)
                  .WithMany(r => r.Reservations)
                  .HasForeignKey(e => e.RoomId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Guest)
                  .WithMany(g => g.Reservations)
                  .HasForeignKey(e => e.GuestId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(e => e.BookingReference).IsUnique();
        });

        // RatePlan configuration
        modelBuilder.Entity<RatePlan>(entity =>
        {
            entity.HasKey(e => e.RatePlanId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.MinimumRate).HasPrecision(18, 2);
            entity.HasOne(e => e.Property)
                  .WithMany()
                  .HasForeignKey(e => e.PropertyId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasOne(e => e.Property)
                  .WithMany()
                  .HasForeignKey(e => e.PropertyId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Promotion configuration
        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.PromotionId);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(200);
            entity.Property(e => e.DefaultDiscount).HasPrecision(18, 2);
            entity.Property(e => e.Currency).IsRequired().HasMaxLength(10);
            entity.HasOne(e => e.Property)
                  .WithMany()
                  .HasForeignKey(e => e.PropertyId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Media configuration
        modelBuilder.Entity<Media>(entity =>
        {
            entity.HasKey(e => e.MediaId);
            entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.StoredFileName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FilePath).IsRequired().HasMaxLength(500);
            entity.Property(e => e.MimeType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Caption).HasMaxLength(500);
            entity.HasOne(e => e.Property)
                  .WithMany()
                  .HasForeignKey(e => e.PropertyId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.UploadedByUser)
                  .WithMany()
                  .HasForeignKey(e => e.UploadedBy)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.StoredFileName).IsUnique();
        });

        // RoomTypeMedia configuration
        modelBuilder.Entity<RoomTypeMedia>(entity =>
        {
            entity.HasKey(e => e.RoomTypeMediaId);
            entity.HasOne(e => e.RoomType)
                  .WithMany(rt => rt.RoomTypeMedia)
                  .HasForeignKey(e => e.RoomTypeId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Media)
                  .WithMany(m => m.RoomTypeMedia)
                  .HasForeignKey(e => e.MediaId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(e => new { e.RoomTypeId, e.MediaId }).IsUnique();
        });

        // Seed initial data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Property
        modelBuilder.Entity<Property>().HasData(
            new Property
            {
                PropertyId = 1,
                Name = "Luwa Resort",
                Type = "Resort",
                Address = "123 Beach Road, Lagos",
                Phone = "+234-xxx-xxxx",
                Email = "info@luwaresort.com",
                Currency = "NGN",
                Timezone = "Africa/Lagos",
                Status = "Active",
                CreatedDate = DateTime.UtcNow
            }
        );

        // Seed RoomTypes
        modelBuilder.Entity<RoomType>().HasData(
            new RoomType
            {
                RoomTypeId = 1,
                PropertyId = 1,
                Name = "Apartment with Balcony",
                Description = "Spacious apartment with a private balcony",
                Category = "Premium",
                MaxOccupancy = 4,
                BaseOccupancy = 2,
                BedType = "King",
                RoomSize = 45.5m,
                Bathrooms = 2,
                SmokingAllowed = false,
                IsActive = true
            },
            new RoomType
            {
                RoomTypeId = 2,
                PropertyId = 1,
                Name = "Basic Double Room",
                Description = "Comfortable double room",
                Category = "Standard",
                MaxOccupancy = 2,
                BaseOccupancy = 2,
                BedType = "Double",
                RoomSize = 25.0m,
                Bathrooms = 1,
                SmokingAllowed = false,
                IsActive = true
            }
        );

        // Seed Rooms
        modelBuilder.Entity<Room>().HasData(
            new Room { RoomId = 1, RoomTypeId = 1, PropertyId = 1, RoomNumber = "101", FloorNumber = 1, Status = "Available", CleaningStatus = "Clean", IsActive = true },
            new Room { RoomId = 2, RoomTypeId = 1, PropertyId = 1, RoomNumber = "102", FloorNumber = 1, Status = "Available", CleaningStatus = "Clean", IsActive = true },
            new Room { RoomId = 3, RoomTypeId = 2, PropertyId = 1, RoomNumber = "201", FloorNumber = 2, Status = "Available", CleaningStatus = "Clean", IsActive = true },
            new Room { RoomId = 4, RoomTypeId = 2, PropertyId = 1, RoomNumber = "202", FloorNumber = 2, Status = "Available", CleaningStatus = "Clean", IsActive = true }
        );
    }
}
