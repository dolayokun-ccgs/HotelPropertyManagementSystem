// Payment types
export interface Payment {
  paymentId: number
  reservationId: number
  bookingReference: string
  amount: number
  surcharge: number
  paymentMethod: string
  cardNumber?: string
  cardName?: string
  transactionReference?: string
  notes?: string
  paymentDate: string
  status: string
  processedBy?: number
  processedByName?: string
  createdDate: string
}

export interface CreatePaymentRequest {
  reservationId: number
  amount: number
  surcharge?: number
  paymentMethod: string
  cardNumber?: string
  cardName?: string
  transactionReference?: string
  notes?: string
  paymentDate?: string
}

// Reservation Room (for multi-room bookings)
export interface ReservationRoom {
  id?: string  // Temporary ID for UI
  roomTypeId?: number
  roomTypeName?: string
  ratePlanId?: number
  ratePlanName?: string
  roomId?: number
  roomNumber?: string
  adults: number
  children: number
  infants: number
  roomRate: number
  extraPersonRate: number
  discount: number
}

// Enhanced Reservation Request
export interface EnhancedCreateReservationRequest {
  // Guest information (primary contact)
  guestId?: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  organisation?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string

  // ID Document
  idType?: string
  idNumber?: string

  // Booking details
  checkInDate: string
  checkOutDate: string
  arrivalTime?: string
  source: string
  referral?: string

  // Rooms (can be multiple)
  rooms: ReservationRoom[]

  // Payment information
  paymentMethod?: string
  cardNumber?: string
  cardName?: string
  cardExpiry?: string

  // Pricing
  roomTotal: number
  extraPersonTotal: number
  extrasTotal: number
  discountTotal: number
  creditCardSurcharges: number
  totalAmount: number
  depositAmount: number

  // Comments
  guestComments?: string
  specialRequests?: string
  internalNotes?: string

  // Status
  status?: string
}

// Booking Summary for display
export interface BookingSummary {
  roomTotal: number
  extraPersonTotal: number
  extrasTotal: number
  discountTotal: number
  creditCardSurcharges: number
  total: number
  totalReceived: number
  totalOutstanding: number
}
