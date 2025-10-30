"use client"

import React from 'react'
import { Header } from './Header'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1" style={{ backgroundColor: 'var(--color-blue-light)' }}>
        {children}
      </main>
    </div>
  )
}
