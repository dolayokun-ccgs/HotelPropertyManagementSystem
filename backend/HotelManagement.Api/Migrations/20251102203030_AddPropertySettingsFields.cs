using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManagement.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPropertySettingsFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AlternativePhone",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AutoReplenishment",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "BaseLanguage",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "CheckInTime",
                table: "Properties",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "CheckOutTime",
                table: "Properties",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CurrencyConversion",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Facebook",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Instagram",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InstructionsToLocationEnglish",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Latitude",
                table: "Properties",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitude",
                table: "Properties",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MinimumRate",
                table: "Properties",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Parking",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentPolicyEnglish",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropertyDescriptionEnglish",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropertyFacilities",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropertyRating",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublicEmail",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublicPhone",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReservationDeliveryFailureEmail",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SmokingPolicy",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxId",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TermsAndConditionsEnglish",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Transport",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Twitter",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UnitsOfMeasurement",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UpdatePeriod",
                table: "Properties",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WeekendStartsOn",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "YouTube",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "PropertyId",
                keyValue: 1,
                columns: new[] { "AlternativePhone", "AutoReplenishment", "BaseLanguage", "CheckInTime", "CheckOutTime", "CreatedDate", "CurrencyConversion", "Facebook", "Instagram", "InstructionsToLocationEnglish", "Latitude", "Longitude", "MinimumRate", "Parking", "PaymentPolicyEnglish", "PropertyDescriptionEnglish", "PropertyFacilities", "PropertyRating", "PublicEmail", "PublicPhone", "ReservationDeliveryFailureEmail", "SmokingPolicy", "TaxId", "TermsAndConditionsEnglish", "Transport", "Twitter", "UnitsOfMeasurement", "UpdatePeriod", "Website", "WeekendStartsOn", "YouTube" },
                values: new object[] { null, false, "English", null, null, new DateTime(2025, 11, 2, 20, 30, 30, 42, DateTimeKind.Utc).AddTicks(1843), false, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "Metric", 400, null, "Saturday", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlternativePhone",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "AutoReplenishment",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "BaseLanguage",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "CheckInTime",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "CheckOutTime",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "CurrencyConversion",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Facebook",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Instagram",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "InstructionsToLocationEnglish",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "MinimumRate",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Parking",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PaymentPolicyEnglish",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PropertyDescriptionEnglish",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PropertyFacilities",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PropertyRating",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PublicEmail",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PublicPhone",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "ReservationDeliveryFailureEmail",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "SmokingPolicy",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "TaxId",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "TermsAndConditionsEnglish",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Transport",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Twitter",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "UnitsOfMeasurement",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "UpdatePeriod",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Website",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "WeekendStartsOn",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "YouTube",
                table: "Properties");

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "PropertyId",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2025, 10, 30, 10, 34, 21, 806, DateTimeKind.Utc).AddTicks(7657));
        }
    }
}
