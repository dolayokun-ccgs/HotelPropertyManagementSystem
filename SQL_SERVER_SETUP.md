# SQL Server Setup Guide

## Current Status

The backend API has been successfully configured to use MS SQL Server:
- ✅ SQL Server NuGet packages installed
- ✅ Connection strings configured in appsettings files
- ✅ Program.cs updated to use SQL Server
- ✅ EF Core migration created (`InitialCreate`)
- ❌ SQL Server LocalDB not installed on system

## Options for SQL Server

You have several options to get SQL Server running:

### Option 1: Install SQL Server LocalDB (Recommended for Development)

SQL Server LocalDB is a lightweight version of SQL Server Express designed for development.

**Installation Steps:**

1. Download SQL Server Express from Microsoft:
   - Visit: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   - Click "Download now" under "Express" edition

2. Run the installer and choose "Custom" installation

3. In the installation wizard, make sure to select:
   - ✅ Database Engine Services
   - ✅ LocalDB (under "Database Engine Services")

4. Follow the installation wizard to completion

5. Verify installation by opening a new terminal and running:
   ```bash
   sqllocaldb info
   ```
   You should see a list of LocalDB instances.

6. Create a LocalDB instance:
   ```bash
   sqllocaldb create MSSQLLocalDB
   sqllocaldb start MSSQLLocalDB
   ```

7. Apply the EF Core migration:
   ```bash
   cd backend/HotelManagement.Api
   dotnet ef database update
   ```

### Option 2: Use SQL Server in Docker

If you have Docker Desktop installed, you can run SQL Server in a container:

1. Pull and run SQL Server container:
   ```bash
   docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
   ```

2. Update `appsettings.Development.json` with this connection string:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost,1433;Database=HotelManagementDB_Dev;User ID=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;"
     }
   }
   ```

3. Apply the EF Core migration:
   ```bash
   cd backend/HotelManagement.Api
   dotnet ef database update
   ```

### Option 3: Use SQL Server Express (Full Installation)

SQL Server Express is the full version with more features than LocalDB.

1. Download from: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
2. Install SQL Server Express with default settings
3. Update connection string in `appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=HotelManagementDB_Dev;Trusted_Connection=true;TrustServerCertificate=true;"
     }
   }
   ```
4. Apply migrations

### Option 4: Use Azure SQL Database (Cloud)

For production or if you want a cloud database:

1. Create an Azure SQL Database (requires Azure account)
2. Update the connection string in `appsettings.Production.json` with your Azure SQL credentials
3. Use the Azure SQL connection string template already in the file

## Current Connection Strings

### Development (`appsettings.Development.json`):
```
Server=(localdb)\\mssqllocaldb;Database=HotelManagementDB_Dev;Trusted_Connection=true;TrustServerCertificate=true;
```

### Production (`appsettings.Production.json`):
```
Server=tcp:{your-server}.database.windows.net,1433;Initial Catalog=HotelManagementDB;Persist Security Info=False;User ID={your-username};Password={your-password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

## Database Schema

The migration includes the following tables:
- **Properties** - Hotel property information
- **RoomTypes** - Room type definitions (Standard, Deluxe, Suite, etc.)
- **Rooms** - Individual room records
- **Guests** - Guest information
- **Reservations** - Booking records with guest and room relationships

## Seed Data

The database will be seeded with:
- 1 Property: "Luwa Resort"
- 2 Room Types: "Apartment with Balcony" and "Basic Double Room"
- 4 Rooms: 2 of each room type (Room numbers: 101, 102, 201, 202)

## Next Steps After Installation

Once you have SQL Server installed and running:

1. **Apply the migration:**
   ```bash
   cd backend/HotelManagement.Api
   dotnet ef database update
   ```

2. **Restart the backend API:**
   - If it's currently running, stop it (Ctrl+C)
   - Run: `dotnet run --urls "http://localhost:5000"`

3. **Test the connection:**
   - Open your browser to: http://localhost:5000/swagger
   - Try the `/api/rooms` endpoint to verify data is loading from SQL Server

4. **Verify data in SQL Server:**
   - Use SQL Server Management Studio (SSMS) or Azure Data Studio to connect
   - Connection: `(localdb)\\mssqllocaldb`
   - Check that tables are created and seed data is present

## Troubleshooting

### Error: "Cannot connect to server"
- Ensure SQL Server service is running
- Verify the server name in your connection string matches your installation

### Error: "Login failed for user"
- Check if Windows Authentication is enabled (for LocalDB/Express)
- Verify username/password for SQL Server Authentication

### Error: "Migration already applied"
- This is normal if you run `dotnet ef database update` multiple times
- The migration will only be applied once

## Migration Commands Reference

```bash
# Create a new migration
dotnet ef migrations add MigrationName

# Apply pending migrations
dotnet ef database update

# Revert to a specific migration
dotnet ef database update PreviousMigrationName

# Remove last migration (only if not applied)
dotnet ef migrations remove

# Generate SQL script for migrations
dotnet ef migrations script
```

## Contact

If you encounter any issues during setup, please refer to the official Microsoft documentation:
- SQL Server Express: https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb
- EF Core Migrations: https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/
