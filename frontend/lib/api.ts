import type {
  Reservation,
  Room,
  RoomType,
  RatePlan,
  CreateReservationRequest,
  UpdateReservationRequest,
  ReservationFilters,
  CreateRatePlanRequest,
  UpdateRatePlanRequest,
} from './types'
import type { LoginRequest, RegisterRequest, LoginResponse, User } from './auth-types'
import type { Guest, CreateGuestRequest, UpdateGuestRequest } from './guest-types'

const API_BASE_URL = 'http://localhost:5000/api'

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  })

  if (!response.ok) {
    // Handle 401 Unauthorized by clearing token
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      window.location.href = '/login'
    }
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

// Room Types API
export const roomTypesApi = {
  // Get all room types
  getAll: async (isActive?: boolean): Promise<RoomType[]> => {
    const params = isActive !== undefined ? `?isActive=${isActive}` : ''
    return apiCall<RoomType[]>(`/roomtypes${params}`)
  },

  // Get single room type by ID
  getById: async (id: number): Promise<RoomType> => {
    return apiCall<RoomType>(`/roomtypes/${id}`)
  },

  // Create room type
  create: async (data: Partial<RoomType>): Promise<RoomType> => {
    return apiCall<RoomType>('/roomtypes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update room type
  update: async (id: number, data: Partial<RoomType>): Promise<void> => {
    await apiCall<void>(`/roomtypes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete room type
  delete: async (id: number): Promise<void> => {
    await apiCall<void>(`/roomtypes/${id}`, {
      method: 'DELETE',
    })
  },
}

// Rate Plans API
export const ratePlansApi = {
  // Get all rate plans
  getAll: async (isActive?: boolean): Promise<RatePlan[]> => {
    const params = isActive !== undefined ? `?isActive=${isActive}` : ''
    return apiCall<RatePlan[]>(`/rateplans${params}`)
  },

  // Get single rate plan by ID
  getById: async (id: number): Promise<RatePlan> => {
    return apiCall<RatePlan>(`/rateplans/${id}`)
  },

  // Create rate plan
  create: async (data: CreateRatePlanRequest): Promise<RatePlan> => {
    return apiCall<RatePlan>('/rateplans', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update rate plan
  update: async (id: number, data: UpdateRatePlanRequest): Promise<void> => {
    await apiCall<void>(`/rateplans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete rate plan
  delete: async (id: number): Promise<void> => {
    await apiCall<void>(`/rateplans/${id}`, {
      method: 'DELETE',
    })
  },

  // Set as default rate plan
  setAsDefault: async (id: number): Promise<void> => {
    await apiCall<void>(`/rateplans/${id}/set-default`, {
      method: 'POST',
    })
  },
}

// Authentication API
export const authApi = {
  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiCall<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Register
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    return apiCall<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get current user
  me: async (): Promise<User> => {
    return apiCall<User>('/auth/me')
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiCall<void>('/auth/logout', {
      method: 'POST',
    })
  },

  // Refresh token
  refresh: async (): Promise<LoginResponse> => {
    return apiCall<LoginResponse>('/auth/refresh', {
      method: 'POST',
    })
  },
}

// Guests API
export const guestsApi = {
  // Get all guests
  getAll: async (params?: { search?: string; isActive?: boolean }): Promise<Guest[]> => {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString())

    const url = `/guests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiCall<Guest[]>(url)
  },

  // Get guest by ID
  getById: async (id: number): Promise<Guest> => {
    return apiCall<Guest>(`/guests/${id}`)
  },

  // Create guest
  create: async (data: CreateGuestRequest): Promise<Guest> => {
    return apiCall<Guest>('/guests', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update guest
  update: async (id: number, data: UpdateGuestRequest): Promise<void> => {
    await apiCall<void>(`/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete guest (soft delete)
  delete: async (id: number): Promise<void> => {
    await apiCall<void>(`/guests/${id}`, {
      method: 'DELETE',
    })
  },

  // Get guest reservations
  getReservations: async (id: number): Promise<Reservation[]> => {
    return apiCall<Reservation[]>(`/guests/${id}/reservations`)
  },
}
