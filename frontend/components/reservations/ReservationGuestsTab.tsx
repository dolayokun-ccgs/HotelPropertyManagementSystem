"use client"

import React, { useState } from 'react'

interface ReservationGuestsTabProps {
  reservationId: number
}

export function ReservationGuestsTab({ reservationId }: ReservationGuestsTabProps) {
  const [guests, setGuests] = useState<any[]>([])

  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-orange-600 font-medium">
            APARTMENT WITH BALCONY : APARTMENT ROOM 01
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>👥 2 Adults</span>
            <span>👶 0 Children</span>
            <span>🍼 0 Infants</span>
          </div>
          <button className="ml-auto text-blue-600 hover:text-blue-700">
            + Add New Guest
          </button>
        </div>

        {guests.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded p-6 text-center">
            <p className="text-gray-600">
              No guest. <button className="text-blue-600 hover:text-blue-700">Add New Guest</button>
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {guests.map((guest, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{guest.name}</p>
                  <p className="text-sm text-gray-600">{guest.email}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                  <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
