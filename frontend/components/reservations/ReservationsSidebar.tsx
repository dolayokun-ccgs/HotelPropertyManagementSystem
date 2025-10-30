"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { name: 'Reservations', href: '/reservations' },
  { name: 'Housekeeping', href: '/housekeeping' },
]

export function ReservationsSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-48 border-r border-gray-200" style={{ backgroundColor: 'var(--color-gray-light)' }}>
      <nav className="py-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "block px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-gray-900 border-l-4 border-primary"
                  : "text-gray-600"
              )}
              style={isActive ? { backgroundColor: 'var(--color-white)' } : undefined}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-peach-light)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = ''
              }}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
