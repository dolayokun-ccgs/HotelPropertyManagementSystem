"use client"

import React from 'react'
import { ChevronDown, ChevronRight, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Room {
  id: string
  name: string
  status: string
}

interface RoomType {
  id: string
  name: string
  rooms: Room[]
  expanded: boolean
}

interface RoomRowProps {
  roomType: RoomType
  dates: Date[]
  expanded: boolean
  onToggleExpand: () => void
}

export function RoomRow({ roomType, dates, expanded, onToggleExpand }: RoomRowProps) {
  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  const isToday = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date.toDateString() === today.toDateString()
  }

  return (
    <div>
      {/* Room Type Header */}
      <div className="flex hover:bg-gray-50 min-w-max">
        {/* Room name column */}
        <div className="w-48 flex-shrink-0 border-r border-gray-200 bg-white px-4 py-3 flex items-center gap-2">
          <button
            onClick={onToggleExpand}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <span className="text-sm font-medium text-gray-900 flex-1">
            {roomType.name}
          </span>
          <button className="p-1 hover:bg-gray-200 rounded">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Date cells */}
        <div className="flex">
          {dates.map((date, dateIndex) => (
            <div
              key={dateIndex}
              className={cn(
                "flex-1 min-w-[100px] border-r border-gray-200 p-1",
                isToday(date) && "bg-blue-50",
                isWeekend(date) && !isToday(date) && "bg-gray-50"
              )}
            >
              {/* Empty cell - will contain reservation blocks */}
            </div>
          ))}
        </div>
      </div>

      {/* Individual Rooms (when expanded) */}
      {expanded && roomType.rooms.map((room) => (
        <div key={room.id} className="flex hover:bg-gray-50 border-t border-gray-100 min-w-max">
          {/* Room name column */}
          <div className="w-48 flex-shrink-0 border-r border-gray-200 bg-white px-4 py-3 pl-12">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{room.name}</span>
            </div>
          </div>

          {/* Date cells */}
          <div className="flex">
            {dates.map((date, dateIndex) => (
              <div
                key={dateIndex}
                className={cn(
                  "flex-1 min-w-[100px] border-r border-gray-200 p-1 cursor-pointer hover:bg-blue-50",
                  isToday(date) && "bg-blue-50",
                  isWeekend(date) && !isToday(date) && "bg-gray-50"
                )}
              >
                {/* Empty cell - clickable for new reservations */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
