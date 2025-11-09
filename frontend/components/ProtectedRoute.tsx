'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireRole?: string
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login')
    } else if (!isLoading && requireRole && user?.role !== requireRole) {
      // Redirect to unauthorized page if user doesn't have required role
      router.push('/unauthorized')
    }
  }, [isAuthenticated, isLoading, requireRole, user, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Don't render children if role is required but user doesn't have it
  if (requireRole && user?.role !== requireRole) {
    return null
  }

  return <>{children}</>
}
