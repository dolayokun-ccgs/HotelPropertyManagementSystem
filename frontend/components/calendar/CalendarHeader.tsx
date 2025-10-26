"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface CalendarHeaderProps {
  dates: Date[]
  currentDate: Date
}

export function CalendarHeader({ dates, currentDate }: CalendarHeaderProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getDayName = (date: Date, index: number) => {
    if (index === 0 && date.toDateString() === today.toDateString()) {
      return 'TODAY'
    }
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  }

  const getDateInfo = (date: Date) => {
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    return { day, month }
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  return (
    <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-300">
      <div className="flex min-w-max">
        {/* Room column header */}
        <div className="w-48 flex-shrink-0 border-r border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-200 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Date columns */}
        <div className="flex">
          {dates.map((date, index) => {
            const { day, month } = getDateInfo(date)
            const isTodayDate = isToday(date)
            const isWeekendDate = isWeekend(date)

            return (
              <div
                key={index}
                className={cn(
                  "flex-1 min-w-[100px] border-r border-gray-200 text-center",
                  isTodayDate && "bg-blue-50",
                  isWeekendDate && !isTodayDate && "bg-gray-50"
                )}
              >
                <div className="py-2">
                  <div className={cn(
                    "text-xs font-semibold mb-1",
                    isTodayDate ? "text-primary" : "text-gray-600"
                  )}>
                    {getDayName(date, index)}
                  </div>
                  <div className={cn(
                    "text-sm font-medium",
                    isTodayDate ? "text-primary" : "text-gray-900"
                  )}>
                    {day}
                  </div>
                  <div className={cn(
                    "text-xs",
                    isTodayDate ? "text-primary" : "text-gray-500"
                  )}>
                    {month}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
