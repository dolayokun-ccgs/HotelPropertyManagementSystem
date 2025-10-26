"use client"

import React from 'react'

const legendItems = [
  { label: 'Confirmed', color: 'bg-red-700' },
  { label: 'Checked in', color: 'bg-green-500' },
  { label: 'Checked out', color: 'bg-gray-400' },
  { label: 'Room closure', color: 'bg-red-900' },
  { label: 'Unallocated', color: 'bg-blue-300' },
  { label: 'Incomplete Arrival', color: 'bg-gray-300' },
]

export function CalendarLegend() {
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-end gap-6">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${item.color}`} />
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
