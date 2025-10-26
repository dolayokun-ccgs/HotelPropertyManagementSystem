# Hotel Property Management System - Data Model

## Overview
This document defines the comprehensive data model for the Hotel Property Management System (HPMS), including database schemas, service models, and UI data structures.

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐
│    Property     │
│─────────────────│
│ PropertyId (PK) │
│ Name            │
│ Type            │──────┐
│ Address         │      │
│ Phone           │      │
│ Email           │      │
│ Currency        │      │
│ Timezone        │      │
│ Status          │      │
│ CreatedDate     │      │
└─────────────────┘      │
         │               │
         │ 1:N           │ 1:N
         │               │
┌─────────────────┐      │      ┌─────────────────┐
│    RoomType     │      │      │      User       │
│─────────────────│      │      │─────────────────│
│ RoomTypeId (PK) │      │      │ UserId (PK)     │
│ PropertyId (FK) │──────┘      │ PropertyId (FK) │
│ Name            │             │ Email           │
│ Description     │             │ FirstName       │
│ Category        │             │ LastName        │
│ MaxOccupancy    │             │ Role            │
│ BaseOccupancy   │             │ Phone           │
│ BedType         │             │ Status          │
│ RoomSize        │             │ CreatedDate     │
│ Bathrooms       │             └─────────────────┘
│ SmokingAllowed  │
│ IsActive        │
└─────────────────┘
         │
         │ 1:N
         │
┌─────────────────┐
│      Room       │
│─────────────────│
│ RoomId (PK)     │
│ RoomTypeId (FK) │
│ PropertyId (FK) │
│ RoomNumber      │
│ FloorNumber     │
│ Status          │──────┐
│ CleaningStatus  │      │
│ IsActive        │      │
└─────────────────┘      │
         │               │
         │ 1:N           │ 1:N
         │               │
┌─────────────────┐      │      ┌─────────────────┐
│   RatePlan      │      │      │  Reservation    │
│─────────────────│      │      │─────────────────│
│ RatePlanId (PK) │      │      │ ReservationId   │
│ PropertyId (FK) │      │      │ BookingRef      │
│ Name            │      │      │ PropertyId (FK) │
│ Description     │      │      │ RoomId (FK)     │──┐
│ IsActive        │      │      │ GuestId (FK)    │  │
│ CancellationPol │      │      │ RatePlanId (FK) │  │
│ CreatedDate     │      └──────│ ChannelId (FK)  │  │
└─────────────────┘             │ CheckInDate     │  │
         │                      │ CheckOutDate    │  │
         │ 1:N                  │ Adults          │  │
         │                      │ Children        │  │
┌─────────────────┐             │ Infants         │  │
│  RatePlanPrice  │             │ Status          │  │
│─────────────────│             │ TotalAmount     │  │
│ PriceId (PK)    │             │ PaidAmount      │  │
│ RatePlanId (FK) │             │ Currency        │  │
│ RoomTypeId (FK) │             │ Source          │  │
│ StartDate       │             │ CreatedDate     │  │
│ EndDate         │             │ ModifiedDate    │  │
│ Price           │             │ ConfirmedDate   │  │
│ DayOfWeek       │             └─────────────────┘  │
│ MinStay         │                      │            │
│ MaxStay         │                      │ 1:N        │
│ IsActive        │                      │            │
└─────────────────┘             ┌─────────────────┐  │
                                │   Payment       │  │
         ┌──────────────────────│─────────────────│  │
         │                      │ PaymentId (PK)  │  │
         │                      │ ReservationId   │──┘
         │                      │ Amount          │
         │                      │ Currency        │
┌─────────────────┐             │ PaymentMethod   │
│   Amenity       │             │ PaymentStatus   │
│─────────────────│             │ TransactionRef  │
│ AmenityId (PK)  │             │ PaymentDate     │
│ Name            │             │ ProcessorRef    │
│ Icon            │             │ CreatedDate     │
│ Category        │             └─────────────────┘
└─────────────────┘
         │
         │ M:N
         │
┌─────────────────┐
│RoomTypeAmenity  │
│─────────────────│
│ RoomTypeId (FK) │
│ AmenityId (FK)  │
└─────────────────┘


┌─────────────────┐
│     Guest       │
│─────────────────│
│ GuestId (PK)    │
│ PropertyId (FK) │
│ FirstName       │
│ LastName        │
│ Email           │
│ Phone           │
│ Address         │
│ City            │
│ Country         │
│ PostalCode      │
│ DateOfBirth     │
│ IdType          │
│ IdNumber        │
│ Nationality     │
│ Notes           │
│ CreatedDate     │
└─────────────────┘
         │
         │ 1:1
         │
┌─────────────────┐
│  GuestPreference│
│─────────────────│
│ PreferenceId    │
│ GuestId (FK)    │
│ RoomPreference  │
│ BedPreference   │
│ FloorPreference │
│ SpecialRequests │
└─────────────────┘


┌─────────────────┐
│   Channel       │
│─────────────────│
│ ChannelId (PK)  │
│ Name            │
│ Type            │
│ ApiEndpoint     │
│ IsActive        │
└─────────────────┘
         │
         │ M:N
         │
┌─────────────────┐
│PropertyChannel  │
│─────────────────│
│ PropertyId (FK) │
│ ChannelId (FK)  │
│ ConnectionStatus│
│ ApiKey          │
│ Credentials     │
│ IsActive        │
│ ConnectedDate   │
└─────────────────┘


┌─────────────────┐
│  Promotion      │
│─────────────────│
│ PromotionId (PK)│
│ PropertyId (FK) │
│ Code            │
│ Name            │
│ Description     │
│ DiscountType    │
│ DiscountValue   │
│ StartDate       │
│ EndDate         │
│ MinStay         │
│ MaxUses         │
│ CurrentUses     │
│ IsActive        │
│ CreatedDate     │
└─────────────────┘
         │
         │ M:N
         │
┌─────────────────┐
│PromotionRatePlan│
│─────────────────│
│ PromotionId (FK)│
│ RatePlanId (FK) │
└─────────────────┘


┌─────────────────┐
│   Inventory     │
│─────────────────│
│ InventoryId (PK)│
│ PropertyId (FK) │
│ RoomTypeId (FK) │
│ RatePlanId (FK) │
│ Date            │
│ Available       │
│ Rate            │
│ MinStay         │
│ MaxStay         │
│ ClosedToArrival │
│ ClosedToDeparture│
│ IsClosed        │
└─────────────────┘


┌─────────────────┐
│ Housekeeping    │
│─────────────────│
│HousekeepingId(PK)│
│ RoomId (FK)     │
│ PropertyId (FK) │
│ AssignedTo      │
│ Date            │
│ Status          │
│ Priority        │
│ StartTime       │
│ EndTime         │
│ Notes           │
│ CreatedDate     │
└─────────────────┘


┌─────────────────┐
│    Invoice      │
│─────────────────│
│ InvoiceId (PK)  │
│ ReservationId   │
│ InvoiceNumber   │
│ IssueDate       │
│ DueDate         │
│ Subtotal        │
│ TaxAmount       │
│ TotalAmount     │
│ Status          │
│ CreatedDate     │
└─────────────────┘
         │
         │ 1:N
         │
┌─────────────────┐
│  InvoiceItem    │
│─────────────────│
│ ItemId (PK)     │
│ InvoiceId (FK)  │
│ Description     │
│ Quantity        │
│ UnitPrice       │
│ TotalPrice      │
│ ItemType        │
└─────────────────┘


┌─────────────────┐
│      Tax        │
│─────────────────│
│ TaxId (PK)      │
│ PropertyId (FK) │
│ Name            │
│ TaxType         │
│ Rate            │
│ IsInclusive     │
│ IsActive        │
└─────────────────┘


┌─────────────────┐
│    Service      │
│─────────────────│
│ ServiceId (PK)  │
│ PropertyId (FK) │
│ Name            │
│ Description     │
│ Price           │
│ Category        │
│ IsActive        │
└─────────────────┘


┌─────────────────┐
│AuditLog         │
│─────────────────│
│ AuditId (PK)    │
│ PropertyId (FK) │
│ UserId (FK)     │
│ Action          │
│ EntityType      │
│ EntityId        │
│ OldValue        │
│ NewValue        │
│ IPAddress       │
│ Timestamp       │
└─────────────────┘
```

---

## Database Schema Details

### 1. Property
Represents a hotel or resort property.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| PropertyId | UNIQUEIDENTIFIER | PK | Unique identifier |
| Name | NVARCHAR(200) | NOT NULL | Property name |
| Type | NVARCHAR(50) | NOT NULL | Hotel, Resort, etc. |
| Address | NVARCHAR(500) | NULL | Full address |
| City | NVARCHAR(100) | NULL | City |
| Country | NVARCHAR(100) | NULL | Country |
| Phone | NVARCHAR(20) | NULL | Contact phone |
| Email | NVARCHAR(100) | NULL | Contact email |
| Currency | NVARCHAR(3) | NOT NULL, DEFAULT 'USD' | ISO currency code |
| Timezone | NVARCHAR(100) | NOT NULL | IANA timezone |
| Status | NVARCHAR(20) | NOT NULL | Active, Inactive |
| CreatedDate | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |
| ModifiedDate | DATETIME2 | NULL | Last modification |

### 2. RoomType
Defines different types/categories of rooms.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| RoomTypeId | UNIQUEIDENTIFIER | PK | Unique identifier |
| PropertyId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Property |
| Name | NVARCHAR(100) | NOT NULL | Room type name |
| Description | NVARCHAR(MAX) | NULL | Detailed description |
| Category | NVARCHAR(50) | NULL | Standard, Deluxe, Suite |
| MaxOccupancy | INT | NOT NULL | Maximum guests |
| BaseOccupancy | INT | NOT NULL | Standard occupancy |
| BedType | NVARCHAR(50) | NULL | King, Queen, Twin, etc. |
| RoomSize | DECIMAL(10,2) | NULL | Size in sq meters |
| Bathrooms | INT | NOT NULL, DEFAULT 1 | Number of bathrooms |
| SmokingAllowed | BIT | NOT NULL, DEFAULT 0 | Smoking permitted |
| IsActive | BIT | NOT NULL, DEFAULT 1 | Active status |
| CreatedDate | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |

### 3. Room
Individual room instances.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| RoomId | UNIQUEIDENTIFIER | PK | Unique identifier |
| RoomTypeId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to RoomType |
| PropertyId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Property |
| RoomNumber | NVARCHAR(20) | NOT NULL | Room number/name |
| FloorNumber | INT | NULL | Floor level |
| Status | NVARCHAR(20) | NOT NULL, DEFAULT 'Available' | Available, Occupied, Blocked |
| CleaningStatus | NVARCHAR(20) | NOT NULL, DEFAULT 'Clean' | Clean, Dirty, Cleaning |
| IsActive | BIT | NOT NULL, DEFAULT 1 | Active status |
| CreatedDate | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |

**Index:** Unique index on (PropertyId, RoomNumber)

### 4. RatePlan
Pricing strategies and plans.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| RatePlanId | UNIQUEIDENTIFIER | PK | Unique identifier |
| PropertyId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Property |
| Name | NVARCHAR(100) | NOT NULL | Rate plan name |
| Description | NVARCHAR(MAX) | NULL | Internal description |
| IsActive | BIT | NOT NULL, DEFAULT 1 | Active status |
| CancellationPolicy | NVARCHAR(MAX) | NULL | Cancellation terms |
| IncludesBreakfast | BIT | NOT NULL, DEFAULT 0 | Breakfast included |
| RefundableType | NVARCHAR(50) | NULL | Refundable, Non-refundable |
| CreatedDate | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |

### 5. RatePlanPrice
Daily pricing for rate plans.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| PriceId | UNIQUEIDENTIFIER | PK | Unique identifier |
| RatePlanId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to RatePlan |
| RoomTypeId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to RoomType |
| StartDate | DATE | NOT NULL | Effective start date |
| EndDate | DATE | NOT NULL | Effective end date |
| Price | DECIMAL(18,2) | NOT NULL | Price per night |
| DayOfWeek | NVARCHAR(20) | NULL | Mon-Sun or NULL for all |
| MinStay | INT | NULL | Minimum stay nights |
| MaxStay | INT | NULL | Maximum stay nights |
| IsActive | BIT | NOT NULL, DEFAULT 1 | Active status |

### 6. Guest
Guest/customer information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| GuestId | UNIQUEIDENTIFIER | PK | Unique identifier |
| PropertyId | UNIQUEIDENTIFIER | FK, NULL | Primary property |
| FirstName | NVARCHAR(100) | NOT NULL | First name |
| LastName | NVARCHAR(100) | NOT NULL | Last name |
| Email | NVARCHAR(100) | NOT NULL | Email address |
| Phone | NVARCHAR(20) | NULL | Phone number |
| Address | NVARCHAR(500) | NULL | Street address |
| City | NVARCHAR(100) | NULL | City |
| Country | NVARCHAR(100) | NULL | Country |
| PostalCode | NVARCHAR(20) | NULL | Postal/ZIP code |
| DateOfBirth | DATE | NULL | Date of birth |
| IdType | NVARCHAR(50) | NULL | Passport, Driver License |
| IdNumber | NVARCHAR(100) | NULL | ID number |
| Nationality | NVARCHAR(100) | NULL | Nationality |
| Notes | NVARCHAR(MAX) | NULL | Internal notes |
| CreatedDate | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |

**Index:** Index on Email for quick lookups

### 7. Reservation
Booking records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| ReservationId | UNIQUEIDENTIFIER | PK | Unique identifier |
| BookingReference | NVARCHAR(50) | NOT NULL, UNIQUE | Booking reference code |
| PropertyId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Property |
| RoomId | UNIQUEIDENTIFIER | FK, NULL | Assigned room |
| RoomTypeId | UNIQUEIDENTIFIER | FK, NOT NULL | Room type booked |
| GuestId | UNIQUEIDENTIFIER | FK, NOT NULL | Primary guest |
| RatePlanId | UNIQUEIDENTIFIER | FK, NOT NULL | Applied rate plan |
| ChannelId | UNIQUEIDENTIFIER | FK, NULL | Booking source channel |
| PromotionId | UNIQUEIDENTIFIER | FK, NULL | Applied promotion |
| CheckInDate | DATE | NOT NULL | Check-in date |
| CheckOutDate | DATE | NOT NULL | Check-out date |
| Adults | INT | NOT NULL, DEFAULT 1 | Number of adults |
| Children | INT | NOT NULL, DEFAULT 0 | Number of children |
| Infants | INT | NOT NULL, DEFAULT 0 | Number of infants |
| Status | NVARCHAR(20) | NOT NULL | Pending, Confirmed, Cancelled, Completed |
| TotalAmount | DECIMAL(18,2) | NOT NULL | Total booking amount |
| PaidAmount | DECIMAL(18,2) | NOT NULL, DEFAULT 0 | Amount paid |
| Currency | NVARCHAR(3) | NOT NULL | Currency code |
| Source | NVARCHAR(50) | NULL | Direct, OTA, Phone, etc. |
| SpecialRequests | NVARCHAR(MAX) | NULL | Guest requests |
| CreatedDate | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |
| ModifiedDate | DATETIME2 | NULL | Last modification |
| ConfirmedDate | DATETIME2 | NULL | Confirmation timestamp |
| CancelledDate | DATETIME2 | NULL | Cancellation timestamp |
| CancellationReason | NVARCHAR(MAX) | NULL | Cancellation reason |

**Indexes:**
- Index on BookingReference
- Index on CheckInDate, CheckOutDate
- Index on Status
- Index on GuestId

### 8. Payment
Payment transactions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| PaymentId | UNIQUEIDENTIFIER | PK | Unique identifier |
| ReservationId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Reservation |
| Amount | DECIMAL(18,2) | NOT NULL | Payment amount |
| Currency | NVARCHAR(3) | NOT NULL | Currency code |
| PaymentMethod | NVARCHAR(50) | NOT NULL | Card, Cash, Bank Transfer |
| PaymentStatus | NVARCHAR(20) | NOT NULL | Pending, Success, Failed, Refunded |
| TransactionReference | NVARCHAR(200) | NULL | External reference |
| ProcessorReference | NVARCHAR(200) | NULL | Payment gateway ref |
| PaymentDate | DATETIME2 | NOT NULL | Payment timestamp |
| RefundAmount | DECIMAL(18,2) | NULL | Refunded amount |
| RefundDate | DATETIME2 | NULL | Refund timestamp |
| Notes | NVARCHAR(MAX) | NULL | Payment notes |
| CreatedDate | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |

### 9. Channel
Distribution channels (OTAs, Direct Booking, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| ChannelId | UNIQUEIDENTIFIER | PK | Unique identifier |
| Name | NVARCHAR(100) | NOT NULL | Channel name |
| Type | NVARCHAR(50) | NOT NULL | OTA, Direct, GDS |
| Code | NVARCHAR(50) | NULL | Channel code |
| ApiEndpoint | NVARCHAR(500) | NULL | API URL |
| IsActive | BIT | NOT NULL, DEFAULT 1 | Active status |
| CreatedDate | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |

### 10. PropertyChannel
Property-specific channel connections.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| PropertyChannelId | UNIQUEIDENTIFIER | PK | Unique identifier |
| PropertyId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Property |
| ChannelId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Channel |
| ConnectionStatus | NVARCHAR(20) | NOT NULL | Connected, Disconnected |
| ApiKey | NVARCHAR(500) | NULL | Encrypted API key |
| Credentials | NVARCHAR(MAX) | NULL | Encrypted credentials JSON |
| IsActive | BIT | NOT NULL, DEFAULT 1 | Active status |
| ConnectedDate | DATETIME2 | NULL | Connection timestamp |

### 11. Promotion
Discount codes and promotions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| PromotionId | UNIQUEIDENTIFIER | PK | Unique identifier |
| PropertyId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Property |
| Code | NVARCHAR(50) | NOT NULL | Promotion code |
| Name | NVARCHAR(100) | NOT NULL | Display name |
| Description | NVARCHAR(MAX) | NULL | Description |
| DiscountType | NVARCHAR(20) | NOT NULL | Percentage, Fixed |
| DiscountValue | DECIMAL(18,2) | NOT NULL | Discount amount/percent |
| StartDate | DATE | NOT NULL | Valid from date |
| EndDate | DATE | NOT NULL | Valid until date |
| MinStay | INT | NULL | Minimum stay requirement |
| MaxUses | INT | NULL | Usage limit |
| CurrentUses | INT | NOT NULL, DEFAULT 0 | Times used |
| IsActive | BIT | NOT NULL, DEFAULT 1 | Active status |
| CreatedDate | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |

**Index:** Unique index on (PropertyId, Code)

### 12. Inventory
Daily room availability and rate management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| InventoryId | UNIQUEIDENTIFIER | PK | Unique identifier |
| PropertyId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Property |
| RoomTypeId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to RoomType |
| RatePlanId | UNIQUEIDENTIFIER | FK, NULL | Reference to RatePlan |
| Date | DATE | NOT NULL | Inventory date |
| Available | INT | NOT NULL | Available rooms |
| Rate | DECIMAL(18,2) | NULL | Override rate |
| MinStay | INT | NULL | Minimum stay |
| MaxStay | INT | NULL | Maximum stay |
| ClosedToArrival | BIT | NOT NULL, DEFAULT 0 | CTA restriction |
| ClosedToDeparture | BIT | NOT NULL, DEFAULT 0 | CTD restriction |
| IsClosed | BIT | NOT NULL, DEFAULT 0 | Completely closed |

**Index:** Unique index on (PropertyId, RoomTypeId, RatePlanId, Date)

### 13. Housekeeping
Housekeeping task management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| HousekeepingId | UNIQUEIDENTIFIER | PK | Unique identifier |
| RoomId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Room |
| PropertyId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Property |
| AssignedTo | UNIQUEIDENTIFIER | FK, NULL | Assigned staff user |
| Date | DATE | NOT NULL | Task date |
| Status | NVARCHAR(20) | NOT NULL | Pending, InProgress, Completed |
| Priority | NVARCHAR(20) | NOT NULL, DEFAULT 'Normal' | Low, Normal, High |
| StartTime | DATETIME2 | NULL | Task start time |
| EndTime | DATETIME2 | NULL | Task completion time |
| Notes | NVARCHAR(MAX) | NULL | Task notes |
| CreatedDate | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |

### 14. Invoice
Invoice records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| InvoiceId | UNIQUEIDENTIFIER | PK | Unique identifier |
| ReservationId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Reservation |
| InvoiceNumber | NVARCHAR(50) | NOT NULL, UNIQUE | Invoice number |
| IssueDate | DATE | NOT NULL | Issue date |
| DueDate | DATE | NOT NULL | Payment due date |
| Subtotal | DECIMAL(18,2) | NOT NULL | Subtotal before tax |
| TaxAmount | DECIMAL(18,2) | NOT NULL | Total tax |
| TotalAmount | DECIMAL(18,2) | NOT NULL | Total amount |
| Status | NVARCHAR(20) | NOT NULL | Draft, Issued, Paid, Overdue |
| CreatedDate | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |

### 15. InvoiceItem
Line items on invoices.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| ItemId | UNIQUEIDENTIFIER | PK | Unique identifier |
| InvoiceId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Invoice |
| Description | NVARCHAR(500) | NOT NULL | Item description |
| Quantity | DECIMAL(10,2) | NOT NULL | Quantity |
| UnitPrice | DECIMAL(18,2) | NOT NULL | Price per unit |
| TotalPrice | DECIMAL(18,2) | NOT NULL | Line total |
| ItemType | NVARCHAR(50) | NOT NULL | Room, Service, Tax |

### 16. Tax
Tax configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| TaxId | UNIQUEIDENTIFIER | PK | Unique identifier |
| PropertyId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Property |
| Name | NVARCHAR(100) | NOT NULL | Tax name |
| TaxType | NVARCHAR(50) | NOT NULL | VAT, ServiceCharge, Tourism |
| Rate | DECIMAL(10,4) | NOT NULL | Tax rate (0.15 = 15%) |
| IsInclusive | BIT | NOT NULL, DEFAULT 0 | Included in price |
| IsActive | BIT | NOT NULL, DEFAULT 1 | Active status |

### 17. Amenity
Room amenities/facilities.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| AmenityId | UNIQUEIDENTIFIER | PK | Unique identifier |
| Name | NVARCHAR(100) | NOT NULL | Amenity name |
| Icon | NVARCHAR(50) | NULL | Icon identifier |
| Category | NVARCHAR(50) | NULL | Bathroom, Technology, etc. |
| IsActive | BIT | NOT NULL, DEFAULT 1 | Active status |

### 18. RoomTypeAmenity
Many-to-many relationship between RoomType and Amenity.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| RoomTypeId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to RoomType |
| AmenityId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Amenity |

**Primary Key:** Composite (RoomTypeId, AmenityId)

### 19. User
System users (property staff).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| UserId | UNIQUEIDENTIFIER | PK | Unique identifier |
| PropertyId | UNIQUEIDENTIFIER | FK, NULL | Default property |
| Email | NVARCHAR(100) | NOT NULL, UNIQUE | Login email |
| PasswordHash | NVARCHAR(500) | NOT NULL | Hashed password |
| FirstName | NVARCHAR(100) | NOT NULL | First name |
| LastName | NVARCHAR(100) | NOT NULL | Last name |
| Phone | NVARCHAR(20) | NULL | Phone number |
| Role | NVARCHAR(50) | NOT NULL | Admin, Manager, Staff |
| Status | NVARCHAR(20) | NOT NULL | Active, Inactive, Locked |
| LastLoginDate | DATETIME2 | NULL | Last login timestamp |
| CreatedDate | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Creation timestamp |

### 20. Service
Additional services offered.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| ServiceId | UNIQUEIDENTIFIER | PK | Unique identifier |
| PropertyId | UNIQUEIDENTIFIER | FK, NOT NULL | Reference to Property |
| Name | NVARCHAR(100) | NOT NULL | Service name |
| Description | NVARCHAR(MAX) | NULL | Description |
| Price | DECIMAL(18,2) | NOT NULL | Service price |
| Category | NVARCHAR(50) | NULL | Food, Transport, etc. |
| IsActive | BIT | NOT NULL, DEFAULT 1 | Active status |

### 21. AuditLog
System audit trail.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| AuditId | UNIQUEIDENTIFIER | PK | Unique identifier |
| PropertyId | UNIQUEIDENTIFIER | FK, NULL | Reference to Property |
| UserId | UNIQUEIDENTIFIER | FK, NULL | User who performed action |
| Action | NVARCHAR(50) | NOT NULL | Create, Update, Delete |
| EntityType | NVARCHAR(100) | NOT NULL | Entity name |
| EntityId | NVARCHAR(100) | NOT NULL | Entity identifier |
| OldValue | NVARCHAR(MAX) | NULL | Previous value (JSON) |
| NewValue | NVARCHAR(MAX) | NULL | New value (JSON) |
| IPAddress | NVARCHAR(50) | NULL | Client IP address |
| Timestamp | DATETIME2 | NOT NULL, DEFAULT GETUTCDATE() | Action timestamp |

---

## Service Models (API DTOs)

### ReservationDto
```csharp
public class ReservationDto
{
    public Guid ReservationId { get; set; }
    public string BookingReference { get; set; }
    public Guid PropertyId { get; set; }
    public Guid RoomTypeId { get; set; }
    public string RoomTypeName { get; set; }
    public Guid? RoomId { get; set; }
    public string RoomNumber { get; set; }
    public GuestDto Guest { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int Nights { get; set; }
    public int Adults { get; set; }
    public int Children { get; set; }
    public int Infants { get; set; }
    public string Status { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal OutstandingAmount { get; set; }
    public string Currency { get; set; }
    public string Source { get; set; }
    public string SpecialRequests { get; set; }
    public DateTime CreatedDate { get; set; }
    public List<PaymentDto> Payments { get; set; }
}
```

### RoomTypeDto
```csharp
public class RoomTypeDto
{
    public Guid RoomTypeId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public int MaxOccupancy { get; set; }
    public int BaseOccupancy { get; set; }
    public string BedType { get; set; }
    public decimal? RoomSize { get; set; }
    public int Bathrooms { get; set; }
    public bool SmokingAllowed { get; set; }
    public List<AmenityDto> Amenities { get; set; }
    public List<string> ImageUrls { get; set; }
    public bool IsActive { get; set; }
}
```

### AvailabilityDto
```csharp
public class AvailabilityDto
{
    public Guid RoomTypeId { get; set; }
    public string RoomTypeName { get; set; }
    public DateTime Date { get; set; }
    public int TotalRooms { get; set; }
    public int AvailableRooms { get; set; }
    public int BookedRooms { get; set; }
    public decimal BaseRate { get; set; }
    public string Currency { get; set; }
    public Dictionary<Guid, decimal> RatePlanPrices { get; set; }
}
```

### CalendarEventDto
```csharp
public class CalendarEventDto
{
    public Guid EventId { get; set; }
    public string Title { get; set; }
    public string Type { get; set; } // Reservation, Block, Maintenance
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string RoomNumber { get; set; }
    public string GuestName { get; set; }
    public string Status { get; set; }
    public string Color { get; set; }
}
```

---

## UI Data Models

### Dashboard Statistics
```typescript
interface DashboardStats {
  today: {
    checkIns: number;
    checkOuts: number;
    arrivals: number;
    departures: number;
    occupancyRate: number;
  };
  occupancy: {
    available: number;
    occupied: number;
    blocked: number;
    total: number;
    percentage: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    currency: string;
  };
  recentReservations: ReservationSummary[];
}
```

### Calendar View Model
```typescript
interface CalendarViewModel {
  date: Date;
  roomTypes: {
    roomTypeId: string;
    name: string;
    rooms: {
      roomId: string;
      roomNumber: string;
      events: CalendarEvent[];
    }[];
  }[];
}
```

### Inventory Grid Model
```typescript
interface InventoryGridModel {
  roomTypes: {
    roomTypeId: string;
    name: string;
    ratePlans: {
      ratePlanId: string;
      name: string;
      dailyData: {
        date: Date;
        available: number;
        rate: number;
        minStay: number;
        restrictions: string[];
      }[];
    }[];
  }[];
}
```

### Search/Filter Models
```typescript
interface ReservationSearchFilter {
  guestName?: string;
  bookingReference?: string;
  invoiceNumber?: string;
  dateType: 'checkIn' | 'checkOut' | 'created';
  startDate?: Date;
  endDate?: Date;
  status?: ReservationStatus[];
  source?: string[];
}
```

---

## Enumerations

### ReservationStatus
- Pending
- Confirmed
- CheckedIn
- CheckedOut
- Cancelled
- NoShow

### RoomStatus
- Available
- Occupied
- Blocked
- OutOfOrder

### CleaningStatus
- Clean
- Dirty
- InProgress
- Inspected

### PaymentStatus
- Pending
- Success
- Failed
- Refunded
- PartialRefund

### PaymentMethod
- CreditCard
- DebitCard
- Cash
- BankTransfer
- MobileMoney
- Paystack
- Flutterwave

### UserRole
- SuperAdmin
- PropertyAdmin
- Manager
- Receptionist
- Housekeeping
- Accountant

---

## Business Rules

### Reservation Management
1. Check-out date must be after check-in date
2. Overlapping reservations for the same room are not allowed
3. Total occupancy cannot exceed room type maximum
4. Reservations can only be cancelled before check-in
5. Payment must be >= 0 and <= total amount

### Rate Plans
1. End date must be after start date
2. Price must be greater than 0
3. Min stay must be <= max stay (if both specified)
4. Rate plan must be associated with at least one room type

### Inventory
1. Available rooms cannot be negative
2. Available rooms cannot exceed total rooms of that type
3. Date-specific overrides take precedence over base rates
4. Closed days block all bookings regardless of availability

### Promotions
1. Promotion code must be unique per property
2. Current uses cannot exceed max uses
3. Start date must be before end date
4. Discount value must be > 0
5. For percentage discounts, value must be <= 100

---

## Indexes Strategy

### High Priority Indexes
```sql
-- Reservation lookups
CREATE INDEX IX_Reservation_CheckInDate ON Reservation(CheckInDate);
CREATE INDEX IX_Reservation_CheckOutDate ON Reservation(CheckOutDate);
CREATE INDEX IX_Reservation_Status ON Reservation(Status);
CREATE INDEX IX_Reservation_PropertyId_Status ON Reservation(PropertyId, Status);

-- Inventory queries
CREATE UNIQUE INDEX IX_Inventory_Lookup ON Inventory(PropertyId, RoomTypeId, RatePlanId, Date);

-- Guest searches
CREATE INDEX IX_Guest_Email ON Guest(Email);
CREATE INDEX IX_Guest_Phone ON Guest(Phone);

-- Audit log queries
CREATE INDEX IX_AuditLog_Timestamp ON AuditLog(Timestamp DESC);
CREATE INDEX IX_AuditLog_EntityType_EntityId ON AuditLog(EntityType, EntityId);
```

---

## Security Considerations

1. **Data Encryption**
   - Encrypt sensitive fields: PasswordHash, ApiKey, Credentials, IdNumber
   - Use Azure Key Vault for encryption keys

2. **Multi-tenancy**
   - All queries must filter by PropertyId
   - Row-level security policies on database

3. **PII Protection**
   - Guest data anonymization after configurable retention period
   - GDPR compliance for data export and deletion

4. **Audit Trail**
   - All critical operations logged in AuditLog
   - Immutable audit records

---

## Performance Optimization

1. **Caching Strategy**
   - Cache room types, rate plans, amenities (15 min TTL)
   - Cache inventory for current month (5 min TTL)
   - Cache property settings (1 hour TTL)

2. **Query Optimization**
   - Use pagination for large result sets
   - Implement database read replicas for reports
   - Use materialized views for complex dashboard queries

3. **Data Archival**
   - Archive completed reservations older than 2 years
   - Compress and store in Azure Blob Storage
   - Maintain searchable index

---

## API Endpoints Structure

### Reservations
- GET /api/reservations - List/search reservations
- GET /api/reservations/{id} - Get reservation details
- POST /api/reservations - Create reservation
- PUT /api/reservations/{id} - Update reservation
- DELETE /api/reservations/{id} - Cancel reservation
- GET /api/reservations/{id}/invoice - Get invoice
- POST /api/reservations/{id}/checkin - Check-in guest
- POST /api/reservations/{id}/checkout - Check-out guest

### Availability
- GET /api/availability - Check availability
- GET /api/availability/calendar - Calendar view
- POST /api/availability/block - Block inventory

### Rooms & Rates
- GET /api/room-types - List room types
- GET /api/rate-plans - List rate plans
- POST /api/rate-plans/{id}/prices - Bulk update prices

### Channels
- GET /api/channels - List available channels
- POST /api/channels/{id}/connect - Connect channel
- PUT /api/inventory/sync - Sync inventory to channels

---

This data model provides a comprehensive foundation for the Hotel Property Management System, designed for scalability, performance, and the specific needs of the African hotel market.
