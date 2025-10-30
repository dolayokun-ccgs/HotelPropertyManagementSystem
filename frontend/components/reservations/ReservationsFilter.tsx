"use client"

import React from 'react'
import { Search, Calendar } from 'lucide-react'

interface ReservationsFilterProps {
  filters: {
    guestLastName: string
    bookingReference: string
    invoiceNumber: string
    dateType: string
    status: string
    dateFrom: string
    dateTo: string
    source: string
  }
  onFiltersChange: (filters: any) => void
  onSearch: () => void
}

export function ReservationsFilter({ filters, onFiltersChange, onSearch }: ReservationsFilterProps) {
  const handleChange = (field: string, value: string) => {
    onFiltersChange({ ...filters, [field]: value })
  }

  return (
    <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--color-blue-gray)' }}>
      <div className="grid grid-cols-4 gap-4">
        {/* Row 1 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2 font-medium">Guest last name</label>
          <input
            type="text"
            value={filters.guestLastName}
            onChange={(e) => handleChange('guestLastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2 font-medium">Booking reference</label>
          <input
            type="text"
            value={filters.bookingReference}
            onChange={(e) => handleChange('bookingReference', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2 font-medium">Invoice Number</label>
          <input
            type="text"
            value={filters.invoiceNumber}
            onChange={(e) => handleChange('invoiceNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2 font-medium">Date type</label>
          <select
            value={filters.dateType}
            onChange={(e) => handleChange('dateType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="checkIn">Check In</option>
            <option value="checkOut">Check Out</option>
            <option value="booked">Booked</option>
          </select>
        </div>

        {/* Row 2 */}
        <div>
          <label className="block text-sm text-gray-700 mb-2 font-medium">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="checkedIn">Checked In</option>
            <option value="checkedOut">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2 font-medium">Date from</label>
          <div className="relative">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2 font-medium">Date to</label>
          <div className="relative">
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2 font-medium">Source</label>
          <select
            value={filters.source}
            onChange={(e) => handleChange('source', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="direct">Direct</option>
            <option value="booking.com">Booking.com</option>
            <option value="expedia">Expedia</option>
            <option value="airbnb">Airbnb</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={onSearch}
          className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-medium"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>
    </div>
  )
}
