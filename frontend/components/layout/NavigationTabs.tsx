"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { name: 'Calendar', href: '/calendar' },
  { name: 'Reservations', href: '/reservations' },
  { name: 'Rooms and rates', href: '/rooms-and-rates' },
  { name: 'Distribution', href: '/distribution' },
  { name: 'Direct booking', href: '/direct-booking' },
  { name: 'Payments', href: '/payments' },
  { name: 'Guests', href: '/guests' },
  { name: 'Reports', href: '/reports' },
  { name: 'Setup', href: '/setup' },
]

export function NavigationTabs() {
  const pathname = usePathname()

  return (
    <nav className="border-t border-gray-200" style={{ backgroundColor: 'var(--color-white)' }}>
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = pathname?.startsWith(tab.href)

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              )}
            >
              {tab.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
