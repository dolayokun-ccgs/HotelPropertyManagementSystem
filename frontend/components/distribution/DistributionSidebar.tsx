"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DistributionSidebar() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Inventory', href: '/distribution/inventory' },
    { label: 'Channels', href: '/distribution/channels' },
  ]

  return (
    <div className="w-48 bg-gray-50 border-r border-gray-200 py-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-6 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-white text-gray-900 border-l-4 border-primary'
                : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
