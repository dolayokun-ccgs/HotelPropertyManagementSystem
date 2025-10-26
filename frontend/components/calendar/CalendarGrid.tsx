"use client"

import React, { useState } from 'react'
import { CalendarHeader } from './CalendarHeader'
import { RoomRow } from './RoomRow'

interface CalendarGridProps {
  viewDays: number
  currentDate: Date
  searchQuery: string
}

// Sample room data - will be replaced with API data
const roomTypes = [
  {
    id: '1',
    name: 'Apartment with Balcony',
    rooms: [
      { id: '1-1', name: 'Apartment with', status: 'unallocated' }
    ],
    expanded: true
  },
  {
    id: '2',
    name: 'Basic Double Room',
    rooms: [
      { id: '2-1', name: 'Unallocated', status: 'unallocated' }
    ],
    expanded: true
  }
]

export function CalendarGrid({ viewDays, currentDate, searchQuery }: CalendarGridProps) {
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(
    new Set(roomTypes.filter(r => r.expanded).map(r => r.id))
  )

  // Generate date range
  const generateDateRange = () => {
    const dates = []
    const startDate = new Date(currentDate)

    for (let i = 0; i < viewDays; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  const dates = generateDateRange()

  const toggleRoomExpanded = (roomId: string) => {
    const newExpanded = new Set(expandedRooms)
    if (newExpanded.has(roomId)) {
      newExpanded.delete(roomId)
    } else {
      newExpanded.add(roomId)
    }
    setExpandedRooms(newExpanded)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Header */}
      <CalendarHeader dates={dates} currentDate={currentDate} />

      {/* Room Rows */}
      <div className="divide-y divide-gray-200 overflow-auto">
        {roomTypes.map((roomType) => (
          <RoomRow
            key={roomType.id}
            roomType={roomType}
            dates={dates}
            expanded={expandedRooms.has(roomType.id)}
            onToggleExpand={() => toggleRoomExpanded(roomType.id)}
          />
        ))}
      </div>
    </div>
  )
}
