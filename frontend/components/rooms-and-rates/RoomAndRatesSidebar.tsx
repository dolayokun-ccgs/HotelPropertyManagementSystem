"use client"

import React from 'react'

interface RoomAndRatesSidebarProps {
  activeTab: 'rates' | 'rooms'
  onChange: (tab: 'rates' | 'rooms') => void
}

export function RoomAndRatesSidebar({ activeTab, onChange }: RoomAndRatesSidebarProps) {
  const menuItems = [
    { id: 'rates' as const, label: 'Rate plans' },
    { id: 'rooms' as const, label: 'Room types' },
  ]

  return (
    <div className="w-48 border-r border-gray-200" style={{ backgroundColor: 'var(--color-gray-light)' }}>
      <nav className="py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === item.id
                ? 'border-l-4 border-primary text-gray-900'
                : 'text-gray-600'
            }`}
            style={activeTab === item.id ? { backgroundColor: 'var(--color-white)' } : undefined}
            onMouseEnter={(e) => {
              if (activeTab !== item.id) e.currentTarget.style.backgroundColor = 'var(--color-peach-light)'
            }}
            onMouseLeave={(e) => {
              if (activeTab !== item.id) e.currentTarget.style.backgroundColor = ''
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
