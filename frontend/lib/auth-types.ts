// Authentication types
export interface User {
  userId: number
  firstName: string
  lastName: string
  email: string
  role: string | null
  propertyId: number | null
  isActive: boolean
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  propertyId?: number | null
}

export interface LoginResponse {
  token: string
  expiresAt: string
  user: User
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}
