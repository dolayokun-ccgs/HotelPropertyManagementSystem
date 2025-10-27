"use client"

import React, { useState } from 'react'
import { roomTypesApi } from '@/lib/api'
import type { RoomType } from '@/lib/types'

interface AddRoomTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 1 | 2 | 3 | 4 | 5 | 6

const ROOM_CATEGORIES = [
  'Apartment',
  'Bed in Dormitory',
  'Bungalow',
  'Chalet',
  'Dormitory room',
  'Double',
  'Family',
  'Quad',
  'Single',
  'Studio',
  'Suite',
  'Triple',
  'Twin',
]

const BED_TYPES = ['Single', 'Double', 'Queen', 'King', 'Twin']

export function AddRoomTypeModal({ isOpen, onClose }: AddRoomTypeModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Partial<RoomType>>({
    name: '',
    description: '',
    category: '',
    maxOccupancy: 2,
    baseOccupancy: 2,
    bedType: '',
    roomSize: undefined,
    bathrooms: 1,
    smokingAllowed: false,
    roomCount: 1,
  })

  const updateFormData = (updates: Partial<RoomType>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as Step)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Create the room type
      await roomTypesApi.create({
        ...formData,
        isActive: true,
      })
      alert('Room type created successfully!')
      onClose()
      // Reload the page to refresh the list
      window.location.reload()
    } catch (error) {
      console.error('Failed to create room type:', error)
      alert('Failed to create room type. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const steps = [
    { number: 1, label: 'GENERAL INFORMATION' },
    { number: 2, label: 'OCCUPANCY' },
    { number: 3, label: 'FEATURES' },
    { number: 4, label: 'MEDIA' },
    { number: 5, label: 'REVIEW AND SAVE' },
    { number: 6, label: 'NEXT STEPS' },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add a room type</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex">
          {/* Sidebar with steps */}
          <div className="w-64 border-r border-gray-200 bg-gray-50 p-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-start gap-3 mb-6 ${
                  step.number === currentStep ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.number === currentStep
                      ? 'bg-green-600 text-white'
                      : step.number < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.number < currentStep ? '✓' : step.number}
                </div>
                <div className="text-xs font-medium leading-tight pt-1">{step.label}</div>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-8">
            <div className="mb-6">
              <div className="text-sm text-primary font-medium mb-2">
                STEP {currentStep === 6 ? 'SIX' : ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'][currentStep - 1]}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {steps[currentStep - 1].label}
              </h3>
            </div>

            <div className="min-h-[300px]">
              {/* Step 1: General Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const category = e.target.value
                        updateFormData({
                          category,
                          name: category // Auto-fill name with category
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select room category</option>
                      {ROOM_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room type name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData({ name: e.target.value })}
                      placeholder="e.g., Deluxe King Suite"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description for guest
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateFormData({ description: e.target.value })}
                      rows={4}
                      placeholder="Add description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of rooms of this type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.roomCount}
                      onChange={(e) => updateFormData({ roomCount: parseInt(e.target.value) || 1 })}
                      placeholder="Enter number of rooms"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Occupancy */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum adults
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxOccupancy}
                        onChange={(e) => updateFormData({ maxOccupancy: parseInt(e.target.value) || 2 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base occupancy
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.baseOccupancy}
                        onChange={(e) => updateFormData({ baseOccupancy: parseInt(e.target.value) || 2 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">
                    Base occupancy is used for pricing. Maximum adults determines the absolute maximum number of guests allowed.
                  </p>
                </div>
              )}

              {/* Step 3: Features */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bed type
                    </label>
                    <select
                      value={formData.bedType}
                      onChange={(e) => updateFormData({ bedType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select bed type</option>
                      {BED_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of bathrooms
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.bathrooms}
                        onChange={(e) => updateFormData({ bathrooms: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room size (SQM)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.roomSize || ''}
                        onChange={(e) => updateFormData({ roomSize: parseFloat(e.target.value) || undefined })}
                        placeholder="e.g., 25.5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.smokingAllowed}
                        onChange={(e) => updateFormData({ smokingAllowed: e.target.checked })}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Smoking allowed
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Media */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <p className="text-gray-600">
                    You can add images for this room type later from the Media Library.
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-600">Image upload coming soon</p>
                  </div>
                </div>
              )}

              {/* Step 5: Review and Save */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Review your room type details</h4>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Room type name:</span>{' '}
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    {formData.category && (
                      <div>
                        <span className="text-sm text-gray-600">Category:</span>{' '}
                        <span className="font-medium">{formData.category}</span>
                      </div>
                    )}
                    {formData.description && (
                      <div>
                        <span className="text-sm text-gray-600">Description:</span>{' '}
                        <span className="font-medium">{formData.description}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Number of rooms:</span>{' '}
                      <span className="font-medium">{formData.roomCount}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Maximum occupancy:</span>{' '}
                      <span className="font-medium">{formData.maxOccupancy} adults</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Base occupancy:</span>{' '}
                      <span className="font-medium">{formData.baseOccupancy}</span>
                    </div>
                    {formData.bedType && (
                      <div>
                        <span className="text-sm text-gray-600">Bed type:</span>{' '}
                        <span className="font-medium">{formData.bedType}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Bathrooms:</span>{' '}
                      <span className="font-medium">{formData.bathrooms}</span>
                    </div>
                    {formData.roomSize && (
                      <div>
                        <span className="text-sm text-gray-600">Room size:</span>{' '}
                        <span className="font-medium">{formData.roomSize} SQM</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Smoking:</span>{' '}
                      <span className="font-medium">{formData.smokingAllowed ? 'Allowed' : 'Not allowed'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Next Steps */}
              {currentStep === 6 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Room type created successfully!
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Your room type has been created. You can now add individual rooms of this type.
                  </p>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 && currentStep < 6 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-primary hover:text-blue-700 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}

              <div className="ml-auto">
                {currentStep < 5 && (
                  <button
                    onClick={handleNext}
                    disabled={currentStep === 1 && (!formData.name || !formData.category)}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                {currentStep === 5 && (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save room type'}
                  </button>
                )}
                {currentStep === 6 && (
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
