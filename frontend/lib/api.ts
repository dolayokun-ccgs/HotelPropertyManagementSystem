import type {
  Reservation,
  Room,
  RoomType,
  CreateReservationRequest,
  UpdateReservationRequest,
  ReservationFilters,
} from './types'

const API_BASE_URL = 'http://localhost:5000/api'

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

// Reservations API
export const reservationsApi = {
  // Get all reservations with optional filters
  getAll: async (filters?: ReservationFilters): Promise<Reservation[]> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.checkInFrom) params.append('checkInFrom', filters.checkInFrom)
    if (filters?.checkInTo) params.append('checkInTo', filters.checkInTo)
    if (filters?.guestName) params.append('guestName', filters.guestName)
    if (filters?.bookingReference) params.append('bookingReference', filters.bookingReference)

    const query = params.toString()
    return apiCall<Reservation[]>(`/reservations${query ? `?${query}` : ''}`)
  },

  // Get single reservation by ID
  getById: async (id: number): Promise<Reservation> => {
    return apiCall<Reservation>(`/reservations/${id}`)
  },

  // Create new reservation
  create: async (data: CreateReservationRequest): Promise<Reservation> => {
    return apiCall<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update reservation
  update: async (id: number, data: UpdateReservationRequest): Promise<void> => {
    await apiCall<void>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete (cancel) reservation
  delete: async (id: number): Promise<void> => {
    await apiCall<void>(`/reservations/${id}`, {
      method: 'DELETE',
    })
  },
}

// Rooms API
export const roomsApi = {
  // Get all rooms
  getAll: async (): Promise<Room[]> => {
    return apiCall<Room[]>('/rooms')
  },

  // Get single room by ID
  getById: async (id: number): Promise<Room> => {
    return apiCall<Room>(`/rooms/${id}`)
  },

  // Get all room types
  getTypes: async (): Promise<RoomType[]> => {
    return apiCall<RoomType[]>('/rooms/types')
  },

  // Get available rooms for date range
  getAvailable: async (checkIn: string, checkOut: string): Promise<Room[]> => {
    return apiCall<Room[]>(`/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`)
  },
}
