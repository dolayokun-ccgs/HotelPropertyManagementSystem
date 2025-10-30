"use client"

import React from 'react'
import Link from 'next/link'
import { UserProfile } from './UserProfile'
import { NavigationTabs } from './NavigationTabs'

export function Header() {
  return (
    <header style={{ backgroundColor: 'var(--color-black)' }}>
      <div className="mx-auto">
        {/* Top bar with logo and user profile */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-white)' }}>
              Little Hotelier
            </div>
          </Link>

          {/* User Profile */}
          <UserProfile />
        </div>

        {/* Navigation Tabs */}
        <NavigationTabs />
      </div>
    </header>
  )
}
