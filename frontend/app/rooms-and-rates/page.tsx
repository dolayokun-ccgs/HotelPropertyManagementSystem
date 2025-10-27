"use client"

import React, { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { RoomAndRatesSidebar } from '@/components/rooms-and-rates/RoomAndRatesSidebar'
import { RatePlansList } from '@/components/rooms-and-rates/RatePlansList'
import { RoomTypesList } from '@/components/rooms-and-rates/RoomTypesList'
import { AddRatePlanModal } from '@/components/rooms-and-rates/AddRatePlanModal'
import { AddRoomTypeModal } from '@/components/rooms-and-rates/AddRoomTypeModal'

export default function RoomsAndRatesPage() {
  const [activeTab, setActiveTab] = useState<'rates' | 'rooms'>('rates')
  const [isAddRatePlanOpen, setIsAddRatePlanOpen] = useState(false)
  const [isAddRoomTypeOpen, setIsAddRoomTypeOpen] = useState(false)

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-120px)]">
        <RoomAndRatesSidebar activeTab={activeTab} onChange={setActiveTab} />
        <div className="flex-1 overflow-auto">
          {activeTab === 'rates' && (
            <RatePlansList onAddRatePlan={() => setIsAddRatePlanOpen(true)} />
          )}
          {activeTab === 'rooms' && (
            <RoomTypesList onAddRoomType={() => setIsAddRoomTypeOpen(true)} />
          )}
        </div>
      </div>

      {/* Modals */}
      {isAddRatePlanOpen && (
        <AddRatePlanModal
          isOpen={isAddRatePlanOpen}
          onClose={() => setIsAddRatePlanOpen(false)}
        />
      )}
      {isAddRoomTypeOpen && (
        <AddRoomTypeModal
          isOpen={isAddRoomTypeOpen}
          onClose={() => setIsAddRoomTypeOpen(false)}
        />
      )}
    </MainLayout>
  )
}
