"use client"

import React, { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import type { RoomType } from '@/lib/types'

interface AssignRoomTypesModalProps {
  isOpen: boolean
  onClose: () => void
  ratePlanId: number
  ratePlanName: string
}

interface RoomTypeRate {
  roomTypeId: number
  roomTypeName: string
  isSelected: boolean
  fullRate: number
  includedOccupancy: number
  extraAdultRate: number
  extraChildRate: number
}

type Step = 1 | 2

export function AssignRoomTypesModal({
  isOpen,
  onClose,
  ratePlanId,
  ratePlanName,
}: AssignRoomTypesModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [roomTypeRates, setRoomTypeRates] = useState<RoomTypeRate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchRoomTypes()
    }
  }, [isOpen])

  const fetchRoomTypes = async () => {
    setIsLoading(true)
    try {
      // TODO: Fetch from API
      // Simulated data for now
      const mockRoomTypes: RoomTypeRate[] = [
        {
          roomTypeId: 1,
          roomTypeName: 'Apartment with Balcony',
          isSelected: false,
          fullRate: 50,
          includedOccupancy: 2,
          extraAdultRate: 0,
          extraChildRate: 0,
        },
        {
          roomTypeId: 2,
          roomTypeName: 'Basic Double Room',
          isSelected: false,
          fullRate: 30,
          includedOccupancy: 2,
          extraAdultRate: 0,
          extraChildRate: 0,
        },
      ]
      setRoomTypeRates(mockRoomTypes)
    } catch (error) {
      console.error('Error fetching room types:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleRoomType = (roomTypeId: number) => {
    setRoomTypeRates(prev =>
      prev.map(rt =>
        rt.roomTypeId === roomTypeId
          ? { ...rt, isSelected: !rt.isSelected }
          : rt
      )
    )
  }

  const handleSelectAll = () => {
    const allSelected = roomTypeRates.every(rt => rt.isSelected)
    setRoomTypeRates(prev =>
      prev.map(rt => ({ ...rt, isSelected: !allSelected }))
    )
  }

  const handleUpdateRate = (roomTypeId: number, field: keyof RoomTypeRate, value: any) => {
    setRoomTypeRates(prev =>
      prev.map(rt =>
        rt.roomTypeId === roomTypeId
          ? { ...rt, [field]: value }
          : rt
      )
    )
  }

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Save to API
      const selectedRoomTypes = roomTypeRates.filter(rt => rt.isSelected)
      console.log('Saving room type assignments:', selectedRoomTypes)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      onClose()
    } catch (error) {
      console.error('Error saving room type assignments:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const selectedCount = roomTypeRates.filter(rt => rt.isSelected).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {ratePlanName} - assign room types
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {currentStep > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <div className="ml-3">
              <div className="text-xs text-gray-500">STEP ONE</div>
              <div className="font-medium">Room types</div>
            </div>
          </div>

          <div className="flex-1 h-px bg-gray-300 mx-6" />

          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <div className="ml-3">
              <div className="text-xs text-gray-500">STEP TWO</div>
              <div className="font-medium">Review and submit</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 ? (
            <div>
              <h3 className="text-lg font-medium mb-4">Room types</h3>

              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading room types...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={roomTypeRates.length > 0 && roomTypeRates.every(rt => rt.isSelected)}
                            onChange={handleSelectAll}
                            className="rounded"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">Room types</span>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Full rate (NGN) <span className="text-red-500">*</span>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Included occupancy <span className="text-red-500">*</span>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Extra adult rate <span className="text-red-500">*</span>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Extra child rate <span className="text-red-500">*</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {roomTypeRates.map((roomType) => (
                        <tr key={roomType.roomTypeId} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={roomType.isSelected}
                                onChange={() => handleToggleRoomType(roomType.roomTypeId)}
                                className="rounded"
                              />
                              <span className="ml-2">{roomType.roomTypeName}</span>
                            </label>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={roomType.fullRate}
                              onChange={(e) => handleUpdateRate(roomType.roomTypeId, 'fullRate', parseFloat(e.target.value) || 0)}
                              disabled={!roomType.isSelected}
                              className="w-24 px-2 py-1 border border-gray-300 rounded disabled:bg-gray-100"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={roomType.includedOccupancy}
                              onChange={(e) => handleUpdateRate(roomType.roomTypeId, 'includedOccupancy', parseInt(e.target.value) || 0)}
                              disabled={!roomType.isSelected}
                              className="w-24 px-2 py-1 border border-gray-300 rounded disabled:bg-gray-100"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={roomType.extraAdultRate}
                              onChange={(e) => handleUpdateRate(roomType.roomTypeId, 'extraAdultRate', parseFloat(e.target.value) || 0)}
                              disabled={!roomType.isSelected}
                              className="w-24 px-2 py-1 border border-gray-300 rounded disabled:bg-gray-100"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={roomType.extraChildRate}
                              onChange={(e) => handleUpdateRate(roomType.roomTypeId, 'extraChildRate', parseFloat(e.target.value) || 0)}
                              disabled={!roomType.isSelected}
                              className="w-24 px-2 py-1 border border-gray-300 rounded disabled:bg-gray-100"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-4">Review and submit</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Room types</h4>

                  {roomTypeRates.filter(rt => rt.isSelected).map((roomType) => (
                    <div key={roomType.roomTypeId} className="mb-4 pb-4 border-b last:border-b-0">
                      <h5 className="font-medium mb-2">{roomType.roomTypeName}</h5>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Full rate (NGN)</div>
                          <div className="font-medium">{roomType.fullRate}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Included occupancy</div>
                          <div className="font-medium">{roomType.includedOccupancy}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Extra adult rate</div>
                          <div className="font-medium">{roomType.extraAdultRate}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Extra child rate</div>
                          <div className="font-medium">{roomType.extraChildRate}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedCount > 0 && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center text-green-800">
                        <Check className="w-5 h-5 mr-2" />
                        <span>{selectedCount} room type{selectedCount !== 1 ? 's' : ''} have been assigned to "{ratePlanName}"</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <div>
            {currentStep === 2 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700"
              >
                ← Back
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {currentStep === 1 ? (
              <button
                onClick={handleNext}
                disabled={selectedCount === 0}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Assign room types'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
