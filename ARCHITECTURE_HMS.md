# Hotel Property Management System - Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architectural Principles](#architectural-principles)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Application Layers](#application-layers)
6. [Component Architecture](#component-architecture)
7. [Azure Cloud Architecture](#azure-cloud-architecture)
8. [Security Architecture](#security-architecture)
9. [Data Architecture](#data-architecture)
10. [Integration Architecture](#integration-architecture)
11. [Frontend Architecture](#frontend-architecture)
12. [Backend Architecture](#backend-architecture)
13. [Deployment Architecture](#deployment-architecture)
14. [Scalability & Performance](#scalability--performance)
15. [Monitoring & Observability](#monitoring--observability)
16. [Disaster Recovery](#disaster-recovery)

---

## System Overview

### Purpose
The Hotel Property Management System (HPMS) is a comprehensive cloud-based solution designed for hotel and resort owners in Africa to manage their property operations, including reservations, room inventory, housekeeping, payments, channel distribution, and reporting.

### Key Objectives
- **Accessibility**: Web and mobile-friendly interface accessible from anywhere
- **Reliability**: 99.9% uptime SLA with automated failover
- **Performance**: Fast response times even on slower connections
- **Scalability**: Support from single properties to multi-property chains
- **Localization**: Support for African markets with local payment gateways
- **Integration**: Seamless connection with OTA channels and third-party services

### Target Users
1. **Property Owners**: Dashboard views, reports, analytics
2. **Hotel Managers**: Full operational control
3. **Front Desk Staff**: Reservations, check-in/out, guest management
4. **Housekeeping Staff**: Task management, room status updates
5. **Accountants**: Financial reports, invoicing, payment tracking
6. **Guests**: Direct booking, reservation management

---

## Architectural Principles

### 1. Cloud-First
- Leverage Azure PaaS services for reduced operational overhead
- Infrastructure as Code (IaC) for reproducibility
- Serverless where appropriate for cost optimization

### 2. Mobile-First Design
- Progressive Web App (PWA) for offline capabilities
- Responsive design optimized for Android devices
- Touch-friendly interfaces

### 3. API-First
- RESTful API design
- Comprehensive API documentation
- Versioned APIs for backward compatibility

### 4. Security by Design
- Zero-trust security model
- Encryption at rest and in transit
- Role-based access control (RBAC)
- Multi-tenant data isolation

### 5. Performance Optimization
- Caching strategy at multiple layers
- CDN for static assets
- Database query optimization
- Lazy loading and code splitting

### 6. Maintainability
- Clean Architecture principles
- SOLID principles
- Comprehensive testing (unit, integration, e2e)
- Clear separation of concerns

### 7. Observability
- Centralized logging
- Distributed tracing
- Real-time monitoring and alerting
- Performance metrics

---

## Technology Stack

### Frontend Layer

#### Core Framework
- **Next.js 14.x** (React 18+)
  - App Router for file-based routing
  - Server Components for performance
  - Server Actions for mutations
  - TypeScript for type safety

#### UI/UX
- **Tailwind CSS 3.x**: Utility-first styling
- **shadcn/ui**: Accessible component library
- **Radix UI**: Headless component primitives
- **Framer Motion**: Animations
- **React Hook Form**: Form management
- **Zod**: Schema validation

#### State Management
- **Zustand**: Lightweight global state
- **TanStack Query (React Query)**: Server state management
- **Context API**: Component-level state

#### Data Visualization
- **Recharts**: Charts and graphs
- **FullCalendar**: Calendar views
- **React Big Calendar**: Alternative calendar

#### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Jest + React Testing Library**: Testing

### Backend Layer

#### Core Framework
- **.NET 8.0** (LTS)
  - Minimal APIs or Controller-based APIs
  - C# 12 with nullable reference types
  - Native AOT compilation for performance

#### Architecture Patterns
- **Clean Architecture**: Clear separation of layers
- **CQRS**: Command Query Responsibility Segregation
- **MediatR**: In-process messaging
- **Repository Pattern**: Data access abstraction
- **Unit of Work**: Transaction management

#### Data Access
- **Entity Framework Core 8.0**: ORM
- **Dapper**: High-performance queries
- **FluentValidation**: Input validation
- **AutoMapper**: Object mapping

#### Authentication & Authorization
- **Azure AD B2C**: Identity management
- **Identity Server / Duende**: OAuth 2.0 / OpenID Connect
- **JWT Bearer Tokens**: API authentication

#### Real-time Communication
- **SignalR**: WebSocket connections
  - Live reservation updates
  - Room status changes
  - Multi-user notifications

#### Background Jobs
- **Hangfire**: Scheduled tasks and background jobs
  - Nightly reports
  - Inventory sync
  - Email notifications
  - Data cleanup

#### API Documentation
- **Swagger/OpenAPI 3.0**: API documentation
- **Swashbuckle**: .NET integration

#### Testing
- **xUnit**: Unit testing
- **NSubstitute/Moq**: Mocking
- **FluentAssertions**: Readable assertions
- **SpecFlow**: BDD testing

### Database Layer

#### Primary Database
- **Azure SQL Database**
  - S3 tier (development)
  - P2 tier (production)
  - Geo-replication for DR
  - Automated backups

#### Caching
- **Azure Cache for Redis**
  - Session management
  - Frequently accessed data
  - Rate limiting
  - Distributed locks

#### Storage
- **Azure Blob Storage**
  - Hot tier: Recent images, documents
  - Cool tier: Archived data
  - CDN integration

#### Search
- **Azure Cognitive Search** (optional)
  - Full-text search for guests, reservations
  - Autocomplete functionality

### DevOps & CI/CD

#### Version Control
- **Git**: Source control
- **GitHub**: Repository hosting
- **Git Flow**: Branching strategy

#### CI/CD Pipeline
- **GitHub Actions** or **Azure DevOps**
  - Automated builds
  - Automated testing
  - Code quality checks
  - Automated deployment

#### Infrastructure as Code
- **Bicep** or **Terraform**
  - Azure resource provisioning
  - Environment consistency
  - Version-controlled infrastructure

#### Containerization
- **Docker**: Container runtime
- **Docker Compose**: Local development
- **Azure Container Registry**: Image storage

#### Monitoring & Logging
- **Azure Application Insights**: APM
- **Azure Monitor**: Infrastructure monitoring
- **Serilog**: Structured logging
- **Seq** or **Azure Log Analytics**: Log aggregation

---

## System Architecture

### High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           CLIENT TIER                                     │
│                                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Desktop   │  │   Tablet    │  │   Mobile    │  │    Admin    │   │
│  │     Web     │  │     Web     │  │     PWA     │  │   Portal    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│         │                 │                 │                │           │
└─────────┼─────────────────┼─────────────────┼────────────────┼───────────┘
          │                 │                 │                │
          └─────────────────┴─────────────────┴────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        AZURE FRONT DOOR / CDN                             │
│  - SSL/TLS Termination                                                    │
│  - WAF (Web Application Firewall)                                         │
│  - Global Load Balancing                                                  │
│  - DDoS Protection                                                        │
└──────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
┌────────────────────────────────┐      ┌────────────────────────────────┐
│     FRONTEND APP SERVICE       │      │      API APP SERVICE           │
│  (Next.js Application)         │      │  (.NET 8 Web API)              │
│                                │      │                                │
│  - Server-side Rendering       │◄─────┤  - RESTful APIs                │
│  - Static Generation           │      │  - SignalR Hub                 │
│  - API Routes                  │      │  - Authentication              │
│  - PWA Service Worker          │      │  - Authorization               │
└────────────────────────────────┘      └────────────────────────────────┘
                    │                                   │
                    │                   ┌───────────────┴───────────────┐
                    │                   │                               │
                    ▼                   ▼                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     AZURE API MANAGEMENT (Optional)                    │
│  - API Gateway                                                         │
│  - Rate Limiting                                                       │
│  - API Versioning                                                      │
│  - Analytics                                                           │
└────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
┌──────────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│  Application Layer   │  │  Domain Layer    │  │  Infrastructure │
│                      │  │                  │  │     Layer       │
│  - Controllers       │  │  - Entities      │  │                 │
│  - SignalR Hubs      │  │  - Aggregates    │  │  - EF Context   │
│  - API Endpoints     │  │  - Domain Logic  │  │  - Repositories │
│  - DTOs/ViewModels   │  │  - Interfaces    │  │  - Services     │
└──────────────────────┘  └──────────────────┘  └─────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
┌────────────────────────────────┐      ┌────────────────────────────────┐
│    AZURE SQL DATABASE          │      │   AZURE CACHE FOR REDIS        │
│                                │      │                                │
│  - Primary Database            │      │  - Session Store               │
│  - Geo-Replication             │      │  - Output Cache                │
│  - Automated Backups           │      │  - Distributed Cache           │
│  - Point-in-time Restore       │      │  - Real-time Data              │
└────────────────────────────────┘      └────────────────────────────────┘
                    │
                    │
                    ▼
┌────────────────────────────────┐      ┌────────────────────────────────┐
│   AZURE BLOB STORAGE           │      │   AZURE SERVICE BUS            │
│                                │      │                                │
│  - Property Images             │      │  - Message Queue               │
│  - Guest Documents             │      │  - Event Publishing            │
│  - Invoices/Reports            │      │  - Async Processing            │
│  - Backup Archives             │      │  - Integration Events          │
└────────────────────────────────┘      └────────────────────────────────┘
                                                     │
                                                     │
                    ┌────────────────────────────────┴──────────────┐
                    │                                               │
                    ▼                                               ▼
┌────────────────────────────────┐      ┌────────────────────────────────┐
│   AZURE FUNCTIONS              │      │   BACKGROUND JOBS              │
│                                │      │   (Hangfire in App Service)    │
│  - Serverless Processing       │      │                                │
│  - Event-driven Tasks          │      │  - Scheduled Reports           │
│  - Image Processing            │      │  - Channel Sync                │
│  - Email Notifications         │      │  - Data Cleanup                │
└────────────────────────────────┘      └────────────────────────────────┘
                                                     │
                                                     │
┌──────────────────────────────────────────────────────────────────────────┐
│                      INTEGRATION SERVICES                                 │
│                                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │  Paystack/  │  │   OTA       │  │   SendGrid  │  │    SMS      │   │
│  │ Flutterwave │  │  Channels   │  │   (Email)   │  │  Provider   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                   MONITORING & LOGGING                                    │
│                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐                     │
│  │ Application Insights │  │   Azure Monitor      │                     │
│  │  - APM                │  │  - Metrics           │                     │
│  │  - Telemetry          │  │  - Alerts            │                     │
│  │  - Distributed Trace  │  │  - Dashboards        │                     │
│  └──────────────────────┘  └──────────────────────┘                     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Application Layers

### Clean Architecture Implementation

```
┌──────────────────────────────────────────────────────────────┐
│                      Presentation Layer                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  - API Controllers / Minimal APIs                      │  │
│  │  - SignalR Hubs                                        │  │
│  │  - DTOs / View Models                                  │  │
│  │  - Request/Response Models                             │  │
│  │  - Middleware (Auth, Logging, Exception Handling)      │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                      Application Layer                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  - Use Cases / Commands / Queries                      │  │
│  │  - MediatR Handlers                                    │  │
│  │  - Validators (FluentValidation)                       │  │
│  │  - Application Services                                │  │
│  │  - Mappers (AutoMapper Profiles)                       │  │
│  │  - Interfaces for Infrastructure                       │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                        Domain Layer                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  - Entities                                            │  │
│  │  - Value Objects                                       │  │
│  │  - Domain Events                                       │  │
│  │  - Aggregates                                          │  │
│  │  - Domain Services                                     │  │
│  │  - Repository Interfaces                               │  │
│  │  - Business Logic / Rules                              │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  - EF Core DbContext                                   │  │
│  │  - Repository Implementations                          │  │
│  │  - External Service Integrations                       │  │
│  │  - File Storage Services                               │  │
│  │  - Email/SMS Services                                  │  │
│  │  - Caching Services                                    │  │
│  │  - Payment Gateway Integrations                        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Dependency Flow
- **Presentation** depends on **Application**
- **Application** depends on **Domain**
- **Infrastructure** depends on **Application** and **Domain**
- **Domain** has NO dependencies (pure business logic)

---

## Component Architecture

### Backend Components

#### 1. Reservation Management Component
```
ReservationController
    ├── CreateReservationCommand
    │   ├── CreateReservationCommandValidator
    │   └── CreateReservationCommandHandler
    │       ├── IReservationRepository
    │       ├── IAvailabilityService
    │       └── IPaymentService
    ├── UpdateReservationCommand
    ├── CancelReservationCommand
    ├── GetReservationQuery
    └── SearchReservationsQuery
```

#### 2. Inventory Management Component
```
InventoryController
    ├── UpdateInventoryCommand
    ├── BulkUpdateInventoryCommand
    ├── GetAvailabilityQuery
    ├── GetCalendarViewQuery
    └── SyncChannelInventoryCommand
        └── IChannelManagerService
```

#### 3. Channel Management Component
```
ChannelController
    ├── ConnectChannelCommand
    ├── SyncInventoryCommand
    ├── PullReservationsCommand
    └── PushRatesCommand
        ├── IBookingComService
        ├── IExpediaService
        └── IGenericChannelService
```

#### 4. Payment Processing Component
```
PaymentController
    ├── ProcessPaymentCommand
    │   ├── IPaystackService
    │   └── IFlutterwaveService
    ├── RefundPaymentCommand
    ├── GetPaymentStatusQuery
    └── PaymentWebhookHandler
```

#### 5. Reporting Component
```
ReportController
    ├── GenerateOccupancyReportQuery
    ├── GenerateRevenueReportQuery
    ├── GenerateCheckInReportQuery
    └── ExportReportCommand
        └── IReportGeneratorService
```

### Frontend Components

#### 1. Dashboard Module
```
/dashboard
    ├── page.tsx (Dashboard Home)
    ├── components/
    │   ├── OccupancyWidget.tsx
    │   ├── RevenueWidget.tsx
    │   ├── CheckInOutWidget.tsx
    │   ├── RecentReservations.tsx
    │   └── QuickActions.tsx
    └── hooks/
        └── useDashboardData.ts
```

#### 2. Reservations Module
```
/reservations
    ├── page.tsx (Reservation List)
    ├── [id]/
    │   ├── page.tsx (Reservation Details)
    │   └── edit/page.tsx (Edit Reservation)
    ├── new/page.tsx (New Reservation)
    ├── components/
    │   ├── ReservationSearch.tsx
    │   ├── ReservationTable.tsx
    │   ├── ReservationForm.tsx
    │   ├── GuestSelector.tsx
    │   └── PaymentDialog.tsx
    └── hooks/
        ├── useReservations.ts
        └── useReservationMutations.ts
```

#### 3. Calendar Module
```
/calendar
    ├── page.tsx (Calendar View)
    ├── components/
    │   ├── CalendarGrid.tsx
    │   ├── RoomRow.tsx
    │   ├── ReservationBlock.tsx
    │   ├── DateNavigator.tsx
    │   └── CalendarFilters.tsx
    └── hooks/
        └── useCalendarData.ts
```

#### 4. Rooms & Rates Module
```
/rooms-and-rates
    ├── room-types/
    │   ├── page.tsx (Room Type List)
    │   ├── [id]/page.tsx (Room Type Details)
    │   └── new/page.tsx (New Room Type)
    ├── rate-plans/
    │   ├── page.tsx (Rate Plan List)
    │   ├── [id]/page.tsx (Rate Plan Details)
    │   └── new/page.tsx (New Rate Plan)
    └── components/
        ├── RoomTypeCard.tsx
        ├── RatePlanForm.tsx
        ├── PricingCalendar.tsx
        └── AmenitySelector.tsx
```

#### 5. Inventory Module
```
/inventory
    ├── page.tsx (Inventory Grid)
    ├── components/
    │   ├── InventoryGrid.tsx
    │   ├── InventoryCell.tsx
    │   ├── BulkUpdateDialog.tsx
    │   └── ChannelSyncStatus.tsx
    └── hooks/
        └── useInventory.ts
```

---

## Azure Cloud Architecture

### Resource Groups

```
HPMS-Production
    ├── App Services
    │   ├── hpms-web-app (Frontend)
    │   └── hpms-api-app (Backend)
    ├── Databases
    │   ├── hpms-sql-server
    │   └── hpms-sql-database
    ├── Storage
    │   ├── hpmsstorageacct (Blob)
    │   └── hpms-redis-cache
    ├── Networking
    │   ├── hpms-front-door
    │   └── hpms-vnet
    └── Monitoring
        └── hpms-app-insights

HPMS-Staging
    └── (Mirror of production with smaller SKUs)

HPMS-Development
    └── (Development environment)
```

### Azure Services Mapping

| Service | Purpose | SKU/Tier |
|---------|---------|----------|
| **Azure App Service** | Host frontend & backend | P1v3 (Production) |
| **Azure SQL Database** | Primary database | S3/P2 |
| **Azure Cache for Redis** | Caching layer | Standard C1 |
| **Azure Blob Storage** | File storage | Standard LRS |
| **Azure Front Door** | Global CDN & WAF | Premium |
| **Azure AD B2C** | User authentication | Pay-as-you-go |
| **Azure Service Bus** | Message queue | Standard |
| **Azure Functions** | Serverless compute | Consumption |
| **Application Insights** | APM & monitoring | Pay-as-you-go |
| **Azure Key Vault** | Secrets management | Standard |
| **Azure CDN** | Content delivery | Standard Microsoft |
| **SendGrid** | Email service | Pro tier |

### Network Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Azure Front Door                         │
│  - WAF Rules                                               │
│  - SSL/TLS Termination                                     │
│  - DDoS Protection Standard                                │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│              Virtual Network (VNet)                         │
│  Address Space: 10.0.0.0/16                                │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  App Service Subnet (10.0.1.0/24)                    │ │
│  │  - Frontend App Service                              │ │
│  │  - Backend API App Service                           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Data Subnet (10.0.2.0/24)                           │ │
│  │  - Azure SQL Database (Private Endpoint)             │ │
│  │  - Redis Cache (Private Endpoint)                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Integration Subnet (10.0.3.0/24)                    │ │
│  │  - Azure Functions                                   │ │
│  │  - Service Bus                                       │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

### Authentication Flow

```
┌──────────┐                                    ┌─────────────┐
│  Client  │                                    │  Azure AD   │
│ (Browser)│                                    │     B2C     │
└──────────┘                                    └─────────────┘
     │                                                  │
     │  1. Navigate to protected resource              │
     ├─────────────────────────────────────────────────►
     │                                                  │
     │  2. Redirect to login page                      │
     │◄─────────────────────────────────────────────────┤
     │                                                  │
     │  3. User enters credentials                     │
     ├─────────────────────────────────────────────────►
     │                                                  │
     │  4. Returns Authorization Code                  │
     │◄─────────────────────────────────────────────────┤
     │                                                  │
     │  5. Exchange code for tokens                    │
     ├─────────────────────────────────────────────────►
     │                                                  │
     │  6. Returns ID Token + Access Token             │
     │◄─────────────────────────────────────────────────┤
     │                                                  │
┌──────────┐                                    ┌─────────────┐
│  Client  │                                    │  API Server │
└──────────┘                                    └─────────────┘
     │                                                  │
     │  7. API Request with Bearer Token               │
     ├─────────────────────────────────────────────────►
     │                                                  │
     │  8. Validate Token                              │
     │                  ┌───────────────────────────────┤
     │                  │  - Verify signature           │
     │                  │  - Check expiration           │
     │                  │  - Validate claims            │
     │                  └───────────────────────────────┤
     │                                                  │
     │  9. Return protected resource                   │
     │◄─────────────────────────────────────────────────┤
     │                                                  │
```

### Authorization Model (RBAC)

```
Roles Hierarchy:

SuperAdmin (Platform)
    └── Can manage all properties
        │
        ├── PropertyAdmin
        │   └── Full access to assigned property
        │       │
        │       ├── Manager
        │       │   └── Operational management
        │       │       │
        │       │       ├── Receptionist
        │       │       │   └── Reservations, check-in/out, guests
        │       │       │
        │       │       ├── Housekeeping
        │       │       │   └── Room status, cleaning tasks
        │       │       │
        │       │       └── Accountant
        │       │           └── Payments, invoices, reports
        │       │
        │       └── ViewOnly
        │           └── Read-only access
```

### Security Measures

#### 1. Data Encryption
- **In Transit**: TLS 1.2+ for all connections
- **At Rest**:
  - SQL Database: Transparent Data Encryption (TDE)
  - Blob Storage: Server-side encryption (SSE)
  - Redis: Encryption at rest enabled

#### 2. Secrets Management
```
Azure Key Vault
    ├── ConnectionStrings
    │   ├── SqlDatabase
    │   └── RedisCache
    ├── API Keys
    │   ├── Paystack
    │   ├── Flutterwave
    │   ├── SendGrid
    │   └── OTA Channels
    ├── Certificates
    │   └── SSL/TLS Certificates
    └── Encryption Keys
        └── Data Encryption Keys
```

#### 3. Network Security
- **Azure Front Door WAF**: OWASP Top 10 protection
- **Private Endpoints**: Database access only from VNet
- **NSGs**: Network Security Groups for subnet isolation
- **DDoS Protection**: Standard tier

#### 4. Application Security
- **Input Validation**: FluentValidation on all inputs
- **XSS Prevention**: Content Security Policy headers
- **CSRF Protection**: Anti-forgery tokens
- **SQL Injection**: Parameterized queries via EF Core
- **Rate Limiting**: API throttling per user/IP

#### 5. Audit & Compliance
- **Audit Logging**: All critical operations logged
- **GDPR Compliance**: Data export and deletion capabilities
- **PCI DSS**: Payment data handled by certified gateways
- **Data Residency**: Geo-specific data storage

---

## Data Architecture

### Database Design Principles

1. **Normalization**: 3NF for transactional tables
2. **Denormalization**: Strategic for reporting/analytics
3. **Indexing Strategy**: Covering indexes for frequent queries
4. **Partitioning**: Date-based partitioning for large tables
5. **Archival**: Historical data moved to cheaper storage

### Read/Write Separation

```
┌────────────────────┐
│  Application       │
│                    │
│  ┌──────────────┐  │
│  │  CQRS        │  │
│  │  Pattern     │  │
│  └──────────────┘  │
└────────┬───────┬───┘
         │       │
    Write│       │Read
         │       │
         ▼       ▼
┌─────────────────────────────┐
│   Primary Database          │
│   (Read-Write)              │
└─────────────┬───────────────┘
              │
              │ Replication
              │
              ▼
┌─────────────────────────────┐
│   Read Replica              │
│   (Read-Only)               │
│   - Reports                 │
│   - Analytics               │
│   - Complex Queries         │
└─────────────────────────────┘
```

### Caching Strategy

```
Layer 1: Client-Side Cache
    └── Browser cache, Service Worker

Layer 2: CDN Cache
    └── Static assets (images, CSS, JS)

Layer 3: Application Cache (Redis)
    ├── Session data (15 min TTL)
    ├── Room types (1 hour TTL)
    ├── Rate plans (1 hour TTL)
    ├── Property settings (1 hour TTL)
    └── User permissions (30 min TTL)

Layer 4: Database Cache
    └── SQL query plan cache
```

### Data Retention Policy

| Data Type | Retention Period | Archive Location |
|-----------|------------------|------------------|
| Active Reservations | Indefinite | SQL Database |
| Completed Reservations | 2 years active, then archive | Blob Storage (Cool) |
| Audit Logs | 7 years | Blob Storage (Archive) |
| Payment Records | 7 years | SQL + Archive |
| Guest PII | Until deletion request | SQL Database |
| System Logs | 90 days | Log Analytics |
| Performance Metrics | 13 months | Application Insights |

---

## Integration Architecture

### Channel Manager Integration

```
┌───────────────────────────────────────────────────────────────┐
│                    HPMS Channel Manager                        │
└───────────────┬───────────────────────────────────────────────┘
                │
        ┌───────┴───────┬───────────┬───────────┬──────────┐
        │               │           │           │          │
        ▼               ▼           ▼           ▼          ▼
┌─────────────┐  ┌──────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│ Booking.com │  │ Expedia  │  │ Airbnb │  │ Agoda  │  │ Direct │
│             │  │          │  │        │  │        │  │Booking │
└─────────────┘  └──────────┘  └────────┘  └────────┘  └────────┘

Integration Protocol: REST APIs / SOAP
Data Sync: Bi-directional
    ├── Inventory Push (HPMS → OTAs)
    ├── Rate Push (HPMS → OTAs)
    ├── Reservation Pull (OTAs → HPMS)
    └── Status Updates (Bi-directional)
```

### Payment Gateway Integration

```
┌─────────────────────────────────────────────────────────┐
│             Payment Processing Flow                      │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Paystack    │    │ Flutterwave  │    │   Stripe     │
│  (Primary)   │    │  (Secondary) │    │ (Int'l Card) │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┴───────────────────┘
                            │
                            ▼
                ┌──────────────────────┐
                │  Webhook Handler     │
                │  - Payment Success   │
                │  - Payment Failed    │
                │  - Refund Processed  │
                └──────────────────────┘
```

### Communication Services

```
┌─────────────────────────────────────────────────────────┐
│              Notification Service                        │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴─────────┬──────────────┐
        │                   │              │
        ▼                   ▼              ▼
┌──────────────┐    ┌──────────────┐  ┌────────────┐
│   SendGrid   │    │   Twilio /   │  │ Push       │
│   (Email)    │    │   Africa's   │  │Notification│
│              │    │   Talking    │  │  (PWA)     │
└──────────────┘    └──────────────┘  └────────────┘
                         (SMS)
```

---

## Frontend Architecture

### Next.js App Structure

```
hpms-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── reservations/
│   │   ├── calendar/
│   │   ├── rooms-and-rates/
│   │   ├── inventory/
│   │   ├── channels/
│   │   ├── housekeeping/
│   │   ├── payments/
│   │   ├── guests/
│   │   ├── reports/
│   │   ├── setup/
│   │   └── layout.tsx
│   ├── api/
│   │   └── [...proxy routes to backend]
│   ├── layout.tsx
│   ├── page.tsx
│   └── error.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── forms/
│   ├── tables/
│   ├── charts/
│   └── shared/
├── lib/
│   ├── api-client.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── constants.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useReservations.ts
│   └── useInventory.ts
├── stores/
│   ├── authStore.ts
│   ├── propertyStore.ts
│   └── uiStore.ts
├── types/
│   ├── reservation.ts
│   ├── room.ts
│   └── guest.ts
└── public/
    ├── manifest.json (PWA)
    ├── service-worker.js
    └── icons/
```

### State Management Strategy

```
┌─────────────────────────────────────────────────────────┐
│                   State Management                       │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Server      │    │   Global     │    │    Local     │
│  State       │    │   State      │    │    State     │
│              │    │              │    │              │
│ TanStack     │    │   Zustand    │    │  React       │
│ Query        │    │              │    │  useState    │
│              │    │ - Auth       │    │  - UI        │
│ - API Data   │    │ - Property   │    │  - Forms     │
│ - Caching    │    │ - Theme      │    │  - Dialogs   │
│ - Mutations  │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

### PWA Configuration

```json
{
  "name": "Hotel Property Management System",
  "short_name": "HPMS",
  "description": "Manage your hotel operations",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0066cc",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "offline_fallback": "/offline.html"
}
```

---

## Backend Architecture

### Solution Structure

```
HPMS.Backend/
├── src/
│   ├── HPMS.API/
│   │   ├── Controllers/
│   │   ├── Hubs/ (SignalR)
│   │   ├── Middleware/
│   │   ├── Filters/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   ├── HPMS.Application/
│   │   ├── Commands/
│   │   │   ├── Reservations/
│   │   │   ├── Inventory/
│   │   │   └── Payments/
│   │   ├── Queries/
│   │   │   ├── Reservations/
│   │   │   ├── Reports/
│   │   │   └── Dashboard/
│   │   ├── DTOs/
│   │   ├── Validators/
│   │   ├── Mappers/
│   │   └── Interfaces/
│   ├── HPMS.Domain/
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   ├── Enums/
│   │   ├── Events/
│   │   ├── Exceptions/
│   │   └── Interfaces/
│   ├── HPMS.Infrastructure/
│   │   ├── Persistence/
│   │   │   ├── Configurations/
│   │   │   ├── Repositories/
│   │   │   └── ApplicationDbContext.cs
│   │   ├── Services/
│   │   │   ├── Email/
│   │   │   ├── SMS/
│   │   │   ├── Payment/
│   │   │   └── Channel/
│   │   ├── Caching/
│   │   └── Storage/
│   └── HPMS.Shared/
│       ├── Constants/
│       ├── Utilities/
│       └── Extensions/
├── tests/
│   ├── HPMS.UnitTests/
│   ├── HPMS.IntegrationTests/
│   └── HPMS.E2ETests/
└── HPMS.sln
```

### CQRS Pattern Implementation

```csharp
// Command Example
public class CreateReservationCommand : IRequest<Result<ReservationDto>>
{
    public Guid PropertyId { get; set; }
    public Guid RoomTypeId { get; set; }
    public Guid GuestId { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    // ... other properties
}

public class CreateReservationCommandHandler
    : IRequestHandler<CreateReservationCommand, Result<ReservationDto>>
{
    private readonly IReservationRepository _repository;
    private readonly IAvailabilityService _availabilityService;

    public async Task<Result<ReservationDto>> Handle(
        CreateReservationCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Validate availability
        var availability = await _availabilityService
            .CheckAvailability(request.PropertyId, request.RoomTypeId,
                              request.CheckInDate, request.CheckOutDate);

        if (!availability.IsAvailable)
            return Result<ReservationDto>.Failure("Room not available");

        // 2. Create reservation entity
        var reservation = Reservation.Create(/* ... */);

        // 3. Save to repository
        await _repository.AddAsync(reservation);
        await _repository.SaveChangesAsync();

        // 4. Return DTO
        return Result<ReservationDto>.Success(
            _mapper.Map<ReservationDto>(reservation));
    }
}

// Query Example
public class GetReservationQuery : IRequest<Result<ReservationDto>>
{
    public Guid ReservationId { get; set; }
}

public class GetReservationQueryHandler
    : IRequestHandler<GetReservationQuery, Result<ReservationDto>>
{
    private readonly IReservationRepository _repository;
    private readonly IMapper _mapper;

    public async Task<Result<ReservationDto>> Handle(
        GetReservationQuery request,
        CancellationToken cancellationToken)
    {
        var reservation = await _repository
            .GetByIdAsync(request.ReservationId);

        return reservation == null
            ? Result<ReservationDto>.Failure("Reservation not found")
            : Result<ReservationDto>.Success(
                _mapper.Map<ReservationDto>(reservation));
    }
}
```

---

## Deployment Architecture

### Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                   GitHub Repository                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Push to branch
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              GitHub Actions / Azure DevOps                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Build Stage                                           │ │
│  │  - Restore dependencies                                │ │
│  │  - Build solution                                      │ │
│  │  - Run unit tests                                      │ │
│  │  - Code quality checks (SonarQube)                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Test Stage                                            │ │
│  │  - Integration tests                                   │ │
│  │  - E2E tests (Playwright)                              │ │
│  │  - Security scanning                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Package Stage                                         │ │
│  │  - Build Docker images                                 │ │
│  │  - Push to Azure Container Registry                    │ │
│  │  - Create deployment artifacts                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┬──────────────┐
        │                   │              │
        ▼                   ▼              ▼
┌──────────────┐    ┌──────────────┐  ┌────────────┐
│  Development │    │   Staging    │  │ Production │
│  Environment │    │  Environment │  │Environment │
│              │    │              │  │            │
│ Auto-deploy  │    │ Auto-deploy  │  │  Manual    │
│              │    │ + Smoke Tests│  │  Approval  │
└──────────────┘    └──────────────┘  └────────────┘
```

### Environment Configuration

```yaml
# Development
Environment: Development
App Service Plan: B1
SQL Database: S0
Redis Cache: C0
Auto-scale: Disabled

# Staging
Environment: Staging
App Service Plan: S1
SQL Database: S3
Redis Cache: C1
Auto-scale: Disabled

# Production
Environment: Production
App Service Plan: P1v3
SQL Database: P2
Redis Cache: Standard C2
Auto-scale: Enabled (2-10 instances)
```

### Blue-Green Deployment

```
Production Traffic
        │
        ▼
┌──────────────────┐
│  Azure Front     │
│     Door         │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ Blue   │ │ Green  │
│ (Live) │ │ (Idle) │
└────────┘ └────────┘

Deployment Process:
1. Deploy to Green (idle)
2. Run smoke tests on Green
3. Switch traffic to Green
4. Monitor for issues
5. Rollback to Blue if needed
6. Blue becomes new idle
```

---

## Scalability & Performance

### Horizontal Scaling

```
┌────────────────────────────────────────────────────────────┐
│              Azure Front Door (Global)                      │
└────────────────┬───────────────────────────────────────────┘
                 │
        ┌────────┴────────┬───────────────┐
        │                 │               │
        ▼                 ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Region 1   │  │   Region 2   │  │   Region 3   │
│  (Primary)   │  │ (Secondary)  │  │  (Failover)  │
│              │  │              │  │              │
│  App Service │  │  App Service │  │  App Service │
│  Scale Set   │  │  Scale Set   │  │  Scale Set   │
│  (2-10 inst) │  │  (2-10 inst) │  │  (1-5 inst)  │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Auto-scaling Rules

```yaml
Scale Out Triggers:
  - CPU > 70% for 5 minutes
  - Memory > 80% for 5 minutes
  - HTTP Queue Length > 100
  - Response time > 2 seconds

Scale In Triggers:
  - CPU < 30% for 10 minutes
  - Memory < 40% for 10 minutes
  - HTTP Queue Length < 20

Limits:
  Minimum Instances: 2
  Maximum Instances: 10
  Cool-down period: 5 minutes
```

### Performance Optimizations

1. **Frontend**
   - Code splitting by route
   - Image optimization (Next.js Image)
   - Static generation for public pages
   - Service worker caching
   - Lazy loading components

2. **Backend**
   - Response compression (Gzip/Brotli)
   - Output caching for GET endpoints
   - Database connection pooling
   - Async/await throughout
   - Bulk operations for batch updates

3. **Database**
   - Covering indexes on frequent queries
   - Query optimization (execution plans)
   - Read replicas for reporting
   - Partitioning large tables
   - Materialized views for complex aggregations

4. **Caching**
   - Redis for distributed cache
   - Memory cache for in-process
   - CDN for static assets
   - Browser caching headers

---

## Monitoring & Observability

### Application Insights Integration

```
┌─────────────────────────────────────────────────────────────┐
│              Application Insights                            │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Telemetry   │    │    Logs      │    │   Metrics    │
│              │    │              │    │              │
│ - Requests   │    │ - Errors     │    │ - CPU        │
│ - Dependencies│   │ - Warnings   │    │ - Memory     │
│ - Exceptions │    │ - Info       │    │ - Requests/s │
│ - Page Views │    │ - Traces     │    │ - Response   │
│              │    │              │    │   Time       │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Key Metrics to Monitor

| Category | Metric | Threshold | Alert |
|----------|--------|-----------|-------|
| **Performance** | Avg Response Time | > 2s | Warning |
| | P95 Response Time | > 5s | Critical |
| | Failed Requests | > 1% | Critical |
| **Availability** | Uptime | < 99.9% | Critical |
| | Health Check Failures | > 3 | Warning |
| **Resources** | CPU Usage | > 80% | Warning |
| | Memory Usage | > 85% | Warning |
| | Database DTU | > 80% | Warning |
| **Business** | Reservations/hour | < 5 (peak) | Info |
| | Payment Failures | > 5% | Critical |

### Logging Strategy

```csharp
// Structured Logging with Serilog
Log.Information(
    "Reservation created: {ReservationId} for Property {PropertyId} " +
    "by User {UserId}",
    reservation.Id,
    reservation.PropertyId,
    currentUser.Id);

Log.Error(
    exception,
    "Payment processing failed for Reservation {ReservationId}. " +
    "Gateway: {Gateway}, Amount: {Amount}",
    reservationId,
    gateway,
    amount);
```

### Distributed Tracing

```
HTTP Request → Frontend
    ├── Trace ID: abc123
    │
    └── API Call → Backend
        ├── Trace ID: abc123
        ├── Span: ReservationController.Create
        │
        ├── Database Query
        │   ├── Span: CheckAvailability
        │   └── Duration: 45ms
        │
        ├── External API Call
        │   ├── Span: PaymentGateway.Process
        │   └── Duration: 320ms
        │
        └── Response
            └── Total Duration: 425ms
```

---

## Disaster Recovery

### Backup Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Backup Schedule                           │
└─────────────────────────────────────────────────────────────┘

Database:
  - Automated Daily Backups (Azure SQL)
  - Retention: 35 days
  - Point-in-time restore (7 days)
  - Geo-redundant storage

Application Code:
  - Git repository (GitHub)
  - Multiple clones/forks
  - Tagged releases

Blob Storage:
  - Geo-redundant replication (RA-GRS)
  - Soft delete enabled (14 days)
  - Versioning enabled

Configuration:
  - Azure Key Vault backups
  - Infrastructure as Code (Git)
  - Documented in runbooks
```

### Recovery Time Objectives (RTO)

| Component | RTO | RPO | Strategy |
|-----------|-----|-----|----------|
| Web Application | 15 min | 0 | Multi-region deployment |
| API Application | 15 min | 0 | Multi-region deployment |
| Database | 1 hour | 5 min | Geo-replication + Failover |
| Blob Storage | 30 min | 0 | Geo-redundant storage |
| Redis Cache | 10 min | 0 | Rebuild from source |

### Disaster Recovery Plan

```
Failure Scenario: Primary Region Outage

Step 1: Detection (Automated)
    └── Health checks fail
    └── Alert triggered

Step 2: Validation (Manual - 5 min)
    └── Confirm outage scope
    └── Assess impact

Step 3: Failover (Automated - 10 min)
    ├── DNS switch to secondary region
    ├── Database failover to secondary
    └── Traffic routed to backup region

Step 4: Verification (Manual - 15 min)
    ├── Test core functionality
    ├── Verify data integrity
    └── Monitor error rates

Step 5: Communication
    └── Notify stakeholders
    └── Update status page

Recovery: Primary Region Restored
    ├── Sync data changes
    ├── Failback to primary
    └── Post-mortem analysis
```

---

## Conclusion

This architecture provides a robust, scalable, and secure foundation for the Hotel Property Management System. Key highlights:

✅ **Cloud-Native**: Leverages Azure PaaS services for reduced operational overhead
✅ **Scalable**: Auto-scaling and multi-region deployment
✅ **Secure**: Multiple layers of security with zero-trust model
✅ **Performant**: Optimized for African markets with slower connections
✅ **Maintainable**: Clean architecture with clear separation of concerns
✅ **Observable**: Comprehensive monitoring and logging
✅ **Resilient**: Disaster recovery and backup strategies in place

The system is designed to grow from supporting single properties to multi-property hotel chains while maintaining performance and reliability.

---

## Next Steps

1. **Phase 1**: Core infrastructure setup
   - Provision Azure resources
   - Set up CI/CD pipelines
   - Database schema creation

2. **Phase 2**: MVP Development
   - Reservation management
   - Basic calendar view
   - Payment integration

3. **Phase 3**: Advanced Features
   - Channel management
   - Housekeeping module
   - Reporting & analytics

4. **Phase 4**: Optimization
   - Performance tuning
   - User feedback implementation
   - Mobile app (native)
