"use client"

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { ReservationDetailsTab } from './ReservationDetailsTab'
import { ReservationPaymentsTab } from './ReservationPaymentsTab'
import { ReservationGuestsTab } from './ReservationGuestsTab'
import type { BookingSummary } from '@/lib/reservation-types'

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  reservationId?: number
  bookingReference?: string
  guestName?: string
}

type TabType = 'DETAILS' | 'GUESTS' | 'INCLUSIONS' | 'EXTRA ITEMS' | 'PAYMENTS' | 'NOTES' | 'INVOICES'

export function ReservationModal({
  isOpen,
  onClose,
  reservationId,
  bookingReference,
  guestName,
}: ReservationModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('DETAILS')
  const [bookingSummary, setBookingSummary] = useState<BookingSummary>({
    roomTotal: 0,
    extraPersonTotal: 0,
    extrasTotal: 0,
    discountTotal: 0,
    creditCardSurcharges: 0,
    total: 0,
    totalReceived: 0,
    totalOutstanding: 0,
  })

  if (!isOpen) return null

  const tabs: TabType[] = ['DETAILS', 'GUESTS', 'INCLUSIONS', 'EXTRA ITEMS', 'PAYMENTS', 'NOTES', 'INVOICES']

  const isNewReservation = !reservationId

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            {isNewReservation
              ? 'Create Reservation'
              : `Edit Reservation - ${bookingReference} for ${guestName}`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-orange-500 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-orange-600'
              }`}
              disabled={isNewReservation && tab !== 'DETAILS'}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'DETAILS' && (
            <ReservationDetailsTab
              reservationId={reservationId}
              onSummaryUpdate={setBookingSummary}
              bookingSummary={bookingSummary}
              onClose={onClose}
            />
          )}
          {activeTab === 'PAYMENTS' && reservationId && (
            <ReservationPaymentsTab
              reservationId={reservationId}
              bookingSummary={bookingSummary}
            />
          )}
          {activeTab === 'GUESTS' && reservationId && (
            <ReservationGuestsTab reservationId={reservationId} />
          )}
          {activeTab === 'INCLUSIONS' && (
            <div className="p-6">
              <p className="text-gray-500">Inclusions tab - Coming soon</p>
            </div>
          )}
          {activeTab === 'EXTRA ITEMS' && (
            <div className="p-6">
              <p className="text-gray-500">Extra items tab - Coming soon</p>
            </div>
          )}
          {activeTab === 'NOTES' && (
            <div className="p-6">
              <p className="text-gray-500">Notes tab - Coming soon</p>
            </div>
          )}
          {activeTab === 'INVOICES' && (
            <div className="p-6">
              <p className="text-gray-500">Invoices tab - Coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
