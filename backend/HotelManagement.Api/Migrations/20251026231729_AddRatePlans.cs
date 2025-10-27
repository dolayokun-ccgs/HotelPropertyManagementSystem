using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagement.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRatePlans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RatePlans",
                columns: table => new
                {
                    RatePlanId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PropertyId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MinimumLengthOfStay = table.Column<int>(type: "int", nullable: true),
                    MaximumLengthOfStay = table.Column<int>(type: "int", nullable: true),
                    ReleasePeriod = table.Column<int>(type: "int", nullable: true),
                    Inclusions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MinimumRate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    RateManagementType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ApplicableRoomTypeIds = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false),
                    ShowOnBookingEngine = table.Column<bool>(type: "bit", nullable: false),
                    BookingEngineDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RatePlans", x => x.RatePlanId);
                    table.ForeignKey(
                        name: "FK_RatePlans_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "PropertyId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "PropertyId",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 26, 23, 17, 29, 546, DateTimeKind.Utc).AddTicks(5457));

            migrationBuilder.CreateIndex(
                name: "IX_RatePlans_PropertyId",
                table: "RatePlans",
                column: "PropertyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RatePlans");

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "PropertyId",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 26, 23, 3, 56, 911, DateTimeKind.Utc).AddTicks(7646));
        }
    }
}
