// API Response Types
export interface Reservation {
  reservationId: number
  bookingReference: string
  guestName: string
  guestEmail: string
  roomNumber: string | null
  roomType: string | null
  checkInDate: string
  checkOutDate: string
  adults: number
  children: number
  status: string
  totalAmount: number
  paidAmount: number
  outstanding: number
  source: string
  specialRequests: string | null
  createdDate: string
}

export interface Room {
  roomId: number
  roomNumber: string
  floorNumber: number
  status: string
  cleaningStatus: string
  roomTypeName: string
  maxOccupancy: number
  bedType: string | null
}

export interface RoomType {
  roomTypeId: number
  name: string
  description: string | null
  maxOccupancy: number
  baseOccupancy: number
  bedType: string | null
  roomSize: number | null
  availableRooms: number
}

// API Request Types
export interface CreateReservationRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  checkInDate: string
  checkOutDate: string
  adults: number
  children: number
  roomId?: number
  roomTypeId?: number
  source: string
  specialRequests?: string
  totalAmount: number
  depositAmount: number
}

export interface UpdateReservationRequest {
  checkInDate?: string
  checkOutDate?: string
  adults?: number
  children?: number
  roomId?: number
  status?: string
  totalAmount?: number
  paidAmount?: number
  specialRequests?: string
}

export interface ReservationFilters {
  status?: string
  checkInFrom?: string
  checkInTo?: string
  guestName?: string
  bookingReference?: string
}
