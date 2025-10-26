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
    <div className="w-48 bg-gray-100 border-r border-gray-200">
      <nav className="py-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "block px-4 py-3 text-sm font-medium",
                isActive
                  ? "bg-white text-gray-900 border-l-4 border-primary"
                  : "text-gray-600 hover:bg-gray-200"
              )}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
