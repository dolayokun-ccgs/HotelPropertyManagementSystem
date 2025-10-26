"use client"

import React from 'react'
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

interface CalendarToolbarProps {
  viewDays: number
  currentDate: Date
  searchQuery: string
  onViewDaysChange: (days: number) => void
  onDateChange: (date: Date) => void
  onSearchChange: (query: string) => void
  onNavigate: (direction: 'today' | 'start' | 'prev' | 'next' | 'end') => void
  onViewToday: () => void
  onOpenReservationModal?: () => void
}

export function CalendarToolbar({
  viewDays,
  currentDate,
  searchQuery,
  onViewDaysChange,
  onSearchChange,
  onNavigate,
  onOpenReservationModal,
}: CalendarToolbarProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: View Days Selector + Search */}
        <div className="flex items-center gap-4">
          {/* View Days Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <span>{viewDays} days</span>
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[150px] bg-white rounded-md shadow-lg border border-gray-200 p-1 z-50"
                sideOffset={5}
              >
                {[7, 14, 21, 30].map((days) => (
                  <DropdownMenu.Item
                    key={days}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer outline-none"
                    onClick={() => onViewDaysChange(days)}
                  >
                    {days} days
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
            />
          </div>
        </div>

        {/* Center Section: Date Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('today')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            View today
          </button>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('start')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
              title="Jump to start"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('prev')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
              title="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Date Display */}
            <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md min-w-[140px] text-center flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(currentDate)}
            </div>

            <button
              onClick={() => onNavigate('next')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
              title="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('end')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded"
              title="Jump to end"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Section: Unallocated + Actions */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            Unallocated: <span className="font-semibold">0</span>
          </div>

          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2">
            <span>⊗</span>
            Room closure
          </button>

          <button
            onClick={onOpenReservationModal}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-700 flex items-center gap-1"
          >
            <span>+</span>
            Reservation
          </button>
        </div>
      </div>
    </div>
  )
}
