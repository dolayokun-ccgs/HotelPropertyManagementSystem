"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, User, FileText, HelpCircle, LogOut, Users, CreditCard } from 'lucide-react'

export function UserProfile() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const displayName = user ? `${user.firstName} ${user.lastName}`.toUpperCase() : 'USER'

  return (
    <div className="flex items-center gap-3">
      {/* Property/Hotel Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors" style={{ color: 'var(--color-white)' }}>
            <span>Luwa Resort</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[200px] bg-white rounded-md shadow-lg border border-gray-200 p-1 z-50"
            sideOffset={5}
          >
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer outline-none"
              onSelect={() => router.push('/users')}
            >
              <Users className="w-4 h-4" />
              <span>User management</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer outline-none">
              <CreditCard className="w-4 h-4" />
              <span>Billing</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* User Dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors" style={{ color: 'var(--color-white)' }}>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : 'LH'}
            </div>
            <span>{displayName}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[200px] bg-white rounded-md shadow-lg border border-gray-200 p-1 z-50"
            sideOffset={5}
          >
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer outline-none"
              onSelect={() => router.push('/my-account')}
            >
              <User className="w-4 h-4" />
              <span>My account</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer outline-none">
              <FileText className="w-4 h-4" />
              <span>Terms and conditions</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer outline-none">
              <HelpCircle className="w-4 h-4" />
              <span>Get support code</span>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer outline-none"
              onSelect={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}
