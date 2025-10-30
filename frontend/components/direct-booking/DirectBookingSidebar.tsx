"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DirectBookingSidebar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Direct booking rates', href: '/direct-booking/rates' },
    { label: 'Promotion codes', href: '/direct-booking/promotions' },
    { label: 'Extras', href: '/direct-booking/extras' },
    { label: 'Configuration', href: '/direct-booking/configuration', expandable: true },
  ]

  return (
    <div className="w-48 border-r border-gray-200 py-4" style={{ backgroundColor: 'var(--color-gray-light)' }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-6 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'text-gray-900 border-l-4 border-primary'
                : 'text-gray-600 border-l-4 border-transparent'
            }`}
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
    </div>
  )
}
