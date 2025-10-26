"use client"

import React from 'react'
import type { Reservation } from '@/lib/types'

interface ReservationsTableProps {
  reservations: Reservation[]
}

export function ReservationsTable({ reservations }: ReservationsTableProps) {
  if (reservations.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No reservations found. Try adjusting your search filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Reference
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Occupants
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Check In
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Check Out
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Booked
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              ETA
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Room
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Outstanding
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Invoice
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <tr key={reservation.reservationId} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(reservation.status)}`}>
                  {reservation.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {reservation.guestName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {reservation.bookingReference}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {reservation.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {reservation.adults + reservation.children}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(reservation.checkInDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(reservation.checkOutDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(reservation.createdDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                -
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {reservation.roomNumber || 'Not assigned'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                ${reservation.totalAmount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                ${reservation.outstanding.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                {reservation.bookingReference}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-red-100 text-red-800'
    case 'checked in':
      return 'bg-green-100 text-green-800'
    case 'checked out':
      return 'bg-gray-100 text-gray-800'
    case 'cancelled':
      return 'bg-red-200 text-red-900'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}
