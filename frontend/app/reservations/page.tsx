"use client"

import React, { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ReservationsSidebar } from '@/components/reservations/ReservationsSidebar'
import { ReservationsFilter } from '@/components/reservations/ReservationsFilter'
import { ReservationsTable } from '@/components/reservations/ReservationsTable'
import { CreateReservationModal } from '@/components/reservations/CreateReservationModal'
import { reservationsApi } from '@/lib/api'
import type { Reservation } from '@/lib/types'

export default function ReservationsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    guestLastName: '',
    bookingReference: '',
    invoiceNumber: '',
    dateType: 'checkIn',
    status: 'all',
    dateFrom: '2025-10-26',
    dateTo: '2025-11-25',
    source: 'all',
  })
  const [reservations, setReservations] = useState<Reservation[]>([])

  const fetchReservations = async () => {
    setIsLoading(true)
    try {
      const data = await reservationsApi.getAll({
        status: filters.status !== 'all' ? filters.status : undefined,
        checkInFrom: filters.dateFrom,
        checkInTo: filters.dateTo,
        guestName: filters.guestLastName || undefined,
        bookingReference: filters.bookingReference || undefined,
      })
      setReservations(data)
    } catch (error) {
      console.error('Failed to fetch reservations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const handleSearch = () => {
    fetchReservations()
  }

  const handleCreateReservation = async (reservationData: any) => {
    try {
      const createData = {
        firstName: reservationData.firstName,
        lastName: reservationData.lastName,
        email: reservationData.email,
        phone: reservationData.phone,
        checkInDate: reservationData.checkInDate,
        checkOutDate: reservationData.checkOutDate,
        adults: reservationData.adults,
        children: reservationData.children,
        roomId: reservationData.room ? parseInt(reservationData.room) : undefined,
        roomTypeId: reservationData.roomType ? (reservationData.roomType === 'apartment-balcony' ? 1 : 2) : undefined,
        source: reservationData.source,
        specialRequests: reservationData.specialRequests,
        totalAmount: reservationData.totalAmount,
        depositAmount: reservationData.depositAmount,
      }

      await reservationsApi.create(createData)
      setIsCreateModalOpen(false)
      fetchReservations() // Refresh the list
    } catch (error) {
      console.error('Failed to create reservation:', error)
      alert('Failed to create reservation. Please try again.')
    }
  }

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <ReservationsSidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Title */}
            <h1 className="text-3xl font-normal text-gray-900 mb-6">Reservations</h1>

            {/* Filter Panel */}
            <ReservationsFilter
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={handleSearch}
            />

            {/* Results Section */}
            <div className="mt-6 bg-white rounded-lg border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="text-orange-500 font-medium">
                  {reservations.length} RESERVATION{reservations.length !== 1 ? 'S' : ''} FOUND
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-blue-700"
                  >
                    <span>+</span>
                    <span>Create Reservation</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-blue-700">
                    <span>⬇</span>
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <ReservationsTable reservations={reservations} />
            </div>
          </div>
        </div>
      </div>

      {/* Create Reservation Modal */}
      <CreateReservationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReservation}
      />
    </MainLayout>
  )
}
