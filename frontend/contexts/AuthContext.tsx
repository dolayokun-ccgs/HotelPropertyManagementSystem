'use client'

import React, { createContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '@/lib/api'
import type { User, AuthContextType, RegisterRequest } from '@/lib/auth-types'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('authToken')
        const storedUser = localStorage.getItem('authUser')

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  // Login function
  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await authApi.login({ email, password, rememberMe })

      // Store token and user in state and localStorage
      setToken(response.token)
      setUser(response.user)

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('authUser', JSON.stringify(response.user))
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }, [])

  // Register function
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await authApi.register(data)

      // Store token and user in state and localStorage
      setToken(response.token)
      setUser(response.user)

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('authUser', JSON.stringify(response.user))
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    // Call logout API (optional, can be silent if it fails)
    authApi.logout().catch((error) => {
      console.error('Logout API call failed:', error)
    })

    // Clear state and localStorage
    setToken(null)
    setUser(null)

    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      window.location.href = '/login'
    }
  }, [])

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      if (!token) {
        throw new Error('No token available')
      }

      const userData = await authApi.me()
      setUser(userData)

      if (typeof window !== 'undefined') {
        localStorage.setItem('authUser', JSON.stringify(userData))
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
      // If refresh fails, logout the user
      logout()
    }
  }, [token, logout])

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
