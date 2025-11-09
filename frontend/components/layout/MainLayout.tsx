"use client"

import React from 'react'
import { Header } from './Header'
import ProtectedRoute from '@/components/ProtectedRoute'

interface MainLayoutProps {
  children: React.ReactNode
  requireRole?: string
}

export function MainLayout({ children, requireRole }: MainLayoutProps) {
  return (
    <ProtectedRoute requireRole={requireRole}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1" style={{ backgroundColor: 'var(--color-blue-light)' }}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
