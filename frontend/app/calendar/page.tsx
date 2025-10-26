"use client"

import React, { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { CalendarToolbar } from '@/components/calendar/CalendarToolbar'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'
import { CalendarLegend } from '@/components/calendar/CalendarLegend'
import { CreateReservationModal } from '@/components/reservations/CreateReservationModal'

export default function CalendarPage() {
  const [viewDays, setViewDays] = useState(14)
  const [currentDate, setCurrentDate] = useState(new Date('2025-10-26'))
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleViewDaysChange = (days: number) => {
    setViewDays(days)
  }

  const handleDateChange = (date: Date) => {
    setCurrentDate(date)
  }

  const handleViewToday = () => {
    setCurrentDate(new Date())
  }

  const handleNavigate = (direction: 'today' | 'start' | 'prev' | 'next' | 'end') => {
    const newDate = new Date(currentDate)

    switch (direction) {
      case 'today':
        setCurrentDate(new Date())
        break
      case 'start':
        newDate.setDate(newDate.getDate() - viewDays * 2)
        setCurrentDate(newDate)
        break
      case 'prev':
        newDate.setDate(newDate.getDate() - 1)
        setCurrentDate(newDate)
        break
      case 'next':
        newDate.setDate(newDate.getDate() + 1)
        setCurrentDate(newDate)
        break
      case 'end':
        newDate.setDate(newDate.getDate() + viewDays * 2)
        setCurrentDate(newDate)
        break
    }
  }

  const handleCreateReservation = async (reservationData: any) => {
    try {
      const { reservationsApi } = await import('@/lib/api')

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
      alert('Reservation created successfully!')
    } catch (error) {
      console.error('Failed to create reservation:', error)
      alert('Failed to create reservation. Please try again.')
    }
  }

  const handleOpenReservationModal = () => {
    setIsCreateModalOpen(true)
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Calendar Toolbar */}
        <CalendarToolbar
          viewDays={viewDays}
          currentDate={currentDate}
          searchQuery={searchQuery}
          onViewDaysChange={handleViewDaysChange}
          onDateChange={handleDateChange}
          onSearchChange={setSearchQuery}
          onNavigate={handleNavigate}
          onViewToday={handleViewToday}
          onOpenReservationModal={handleOpenReservationModal}
        />

        {/* Calendar Grid */}
        <div className="flex-1 overflow-x-auto overflow-y-auto bg-white">
          <CalendarGrid
            viewDays={viewDays}
            currentDate={currentDate}
            searchQuery={searchQuery}
          />
        </div>

        {/* Status Legend */}
        <CalendarLegend />
      </div>

      {/* Create Reservation Modal */}
      <CreateReservationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReservation}
        initialDate={currentDate.toISOString().split('T')[0]}
      />
    </MainLayout>
  )
}
