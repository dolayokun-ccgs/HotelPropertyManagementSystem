"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const setupNavItems = [
  { label: 'General information', href: '/setup/general-information' },
  { label: 'Property details', href: '/setup/property-details' },
  { label: 'Services', href: '/setup/services' },
  { label: 'Policies', href: '/setup/policies' },
  { label: 'Media library', href: '/setup/media-library' },
]

export function SetupSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-48 border-r border-gray-200" style={{ backgroundColor: 'var(--color-gray-light)' }}>
      <nav className="py-4">
        {setupNavItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
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
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
