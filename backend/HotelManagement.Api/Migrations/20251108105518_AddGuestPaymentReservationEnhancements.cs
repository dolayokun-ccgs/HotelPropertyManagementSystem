using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagement.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddGuestPaymentReservationEnhancements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PaidAmount",
                table: "Reservations",
                newName: "TotalReceived");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Guests",
                newName: "State");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Reservations",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "ArrivalTime",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CardExpiry",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CardName",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CardNumber",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CheckInTime",
                table: "Reservations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CheckOutTime",
                table: "Reservations",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Reservations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CreditCardSurcharges",
                table: "Reservations",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "DepositAmount",
                table: "Reservations",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountTotal",
                table: "Reservations",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ExtraPersonTotal",
                table: "Reservations",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ExtrasTotal",
                table: "Reservations",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "GuestComments",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InternalNotes",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ModifiedBy",
                table: "Reservations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RatePlanId",
                table: "Reservations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Referral",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RoomTotal",
                table: "Reservations",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "RoomTypeId",
                table: "Reservations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AddressLine1",
                table: "Guests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AddressLine2",
                table: "Guests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Comments",
                table: "Guests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Guests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "Guests",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Organisation",
                table: "Guests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReservationId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Surcharge = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CardNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CardName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransactionReference = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProcessedBy = table.Column<int>(type: "int", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.PaymentId);
                    table.ForeignKey(
                        name: "FK_Payments_Reservations_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "ReservationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payments_Users_ProcessedBy",
                        column: x => x.ProcessedBy,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ReservationGuests",
                columns: table => new
                {
                    ReservationGuestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReservationId = table.Column<int>(type: "int", nullable: false),
                    GuestId = table.Column<int>(type: "int", nullable: false),
                    IsPrimaryGuest = table.Column<bool>(type: "bit", nullable: false),
                    AddedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationGuests", x => x.ReservationGuestId);
                    table.ForeignKey(
                        name: "FK_ReservationGuests_Guests_GuestId",
                        column: x => x.GuestId,
                        principalTable: "Guests",
                        principalColumn: "GuestId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReservationGuests_Reservations_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "ReservationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "PropertyId",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 11, 8, 10, 55, 18, 347, DateTimeKind.Utc).AddTicks(9504));

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_CheckInDate_CheckOutDate",
                table: "Reservations",
                columns: new[] { "CheckInDate", "CheckOutDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_CreatedBy",
                table: "Reservations",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_ModifiedBy",
                table: "Reservations",
                column: "ModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_RatePlanId",
                table: "Reservations",
                column: "RatePlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_RoomTypeId",
                table: "Reservations",
                column: "RoomTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Status",
                table: "Reservations",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_PaymentDate",
                table: "Payments",
                column: "PaymentDate");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_ProcessedBy",
                table: "Payments",
                column: "ProcessedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_ReservationId",
                table: "Payments",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationGuests_GuestId",
                table: "ReservationGuests",
                column: "GuestId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationGuests_ReservationId_GuestId",
                table: "ReservationGuests",
                columns: new[] { "ReservationId", "GuestId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_RatePlans_RatePlanId",
                table: "Reservations",
                column: "RatePlanId",
                principalTable: "RatePlans",
                principalColumn: "RatePlanId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_RoomTypes_RoomTypeId",
                table: "Reservations",
                column: "RoomTypeId",
                principalTable: "RoomTypes",
                principalColumn: "RoomTypeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Users_CreatedBy",
                table: "Reservations",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Users_ModifiedBy",
                table: "Reservations",
                column: "ModifiedBy",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_RatePlans_RatePlanId",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_RoomTypes_RoomTypeId",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Users_CreatedBy",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Users_ModifiedBy",
                table: "Reservations");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "ReservationGuests");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_CheckInDate_CheckOutDate",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_CreatedBy",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_ModifiedBy",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_RatePlanId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_RoomTypeId",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_Status",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ArrivalTime",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "CardExpiry",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "CardName",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "CardNumber",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "CheckInTime",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "CheckOutTime",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "CreditCardSurcharges",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "DepositAmount",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "DiscountTotal",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ExtraPersonTotal",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ExtrasTotal",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "GuestComments",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "InternalNotes",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "RatePlanId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Referral",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "RoomTotal",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "RoomTypeId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "AddressLine1",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "AddressLine2",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "Comments",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "Organisation",
                table: "Guests");

            migrationBuilder.RenameColumn(
                name: "TotalReceived",
                table: "Reservations",
                newName: "PaidAmount");

            migrationBuilder.RenameColumn(
                name: "State",
                table: "Guests",
                newName: "Address");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "PropertyId",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 11, 2, 20, 30, 30, 42, DateTimeKind.Utc).AddTicks(1843));
        }
    }
}
