"use client"

import React, { useState } from 'react'
import { ratePlansApi } from '@/lib/api'
import type { CreateRatePlanRequest } from '@/lib/types'

interface AddRatePlanModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 1 | 2 | 3 | 4 | 5 | 6

export function AddRatePlanModal({ isOpen, onClose }: AddRatePlanModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<CreateRatePlanRequest>({
    name: '',
    description: '',
    minimumLengthOfStay: undefined,
    maximumLengthOfStay: undefined,
    releasePeriod: undefined,
    inclusions: '',
    minimumRate: undefined,
    rateManagementType: 'Manual',
    applicableRoomTypeIds: '',
    showOnBookingEngine: true,
    bookingEngineDescription: '',
  })

  const updateFormData = (updates: Partial<CreateRatePlanRequest>) => {
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
      await ratePlansApi.create(formData)
      alert('Rate plan created successfully!')
      onClose()
      // Reload the page to refresh the list
      window.location.reload()
    } catch (error) {
      console.error('Failed to create rate plan:', error)
      alert('Failed to create rate plan. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const steps = [
    { number: 1, label: 'GENERAL INFORMATION' },
    { number: 2, label: 'RESTRICTIONS AND INCLUSIONS' },
    { number: 3, label: 'PRICING DETAILS' },
    { number: 4, label: 'DIRECT BOOKING CONTROLS' },
    { number: 5, label: 'REVIEW AND SAVE' },
    { number: 6, label: 'NEXT STEPS' },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add a rate plan</h2>
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
                  <p className="text-sm text-gray-600 mb-6">
                    How would you describe this rate plan (for your internal use)?
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate plan name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData({ name: e.target.value })}
                      placeholder="Enter a name for your rate plan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate plan description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateFormData({ description: e.target.value })}
                      rows={4}
                      placeholder="This description is not displayed to your guests, only your extranet's users can see it. This helps you distinguish which rate plan you created and how it is being applied."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This description is not displayed to your guests, only your extranet's users can see it.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Restrictions and Inclusions */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-4">
                      Would you like to limit the length of stay?
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Minimum length of stay
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={formData.minimumLengthOfStay || ''}
                            onChange={(e) => updateFormData({ minimumLengthOfStay: parseInt(e.target.value) || undefined })}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-sm text-gray-600">nights</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Maximum length of stay
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={formData.maximumLengthOfStay || ''}
                            onChange={(e) => updateFormData({ maximumLengthOfStay: parseInt(e.target.value) || undefined })}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-sm text-gray-600">nights</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-4">
                      Do guests need to book in advance?
                    </p>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Release period</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={formData.releasePeriod || ''}
                          onChange={(e) => updateFormData({ releasePeriod: parseInt(e.target.value) || undefined })}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-gray-600">days</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-4">
                      Would you like to include any meals?
                    </p>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Inclusions</label>
                      <select
                        value={formData.inclusions}
                        onChange={(e) => updateFormData({ inclusions: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select inclusions</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Breakfast, Lunch">Breakfast, Lunch</option>
                        <option value="Breakfast, Dinner">Breakfast, Dinner</option>
                        <option value="All Meals">All Meals</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Pricing Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-4">
                      Would you like to set a minimum rate?
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Property base currency
                        </label>
                        <input
                          type="text"
                          value="Nigerian Naira (NGN)"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Minimum rate
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">NGN</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.minimumRate || ''}
                            onChange={(e) => updateFormData({ minimumRate: parseFloat(e.target.value) || undefined })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-4">
                      How will you manage your rates?
                    </p>
                    <div className="border border-gray-300 rounded-md p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          checked={formData.rateManagementType === 'Manual'}
                          onChange={() => updateFormData({ rateManagementType: 'Manual' })}
                          className="w-4 h-4 text-primary"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Manually input daily rates</div>
                          <div className="text-sm text-gray-600">
                            You can manage rates from your calendar or rate manager
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Direct Booking Controls */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showOnBookingEngine}
                        onChange={(e) => updateFormData({ showOnBookingEngine: e.target.checked })}
                        className="w-4 h-4 text-primary rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Show this rate plan on booking engine
                      </span>
                    </label>
                  </div>

                  {formData.showOnBookingEngine && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Booking engine description
                      </label>
                      <textarea
                        value={formData.bookingEngineDescription}
                        onChange={(e) => updateFormData({ bookingEngineDescription: e.target.value })}
                        rows={4}
                        placeholder="This description will be shown to guests on your booking engine"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Review and Save */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Review your rate plan details</h4>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Rate plan name:</span>{' '}
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    {formData.description && (
                      <div>
                        <span className="text-sm text-gray-600">Description:</span>{' '}
                        <span className="font-medium">{formData.description}</span>
                      </div>
                    )}
                    {formData.minimumLengthOfStay && (
                      <div>
                        <span className="text-sm text-gray-600">Minimum stay:</span>{' '}
                        <span className="font-medium">{formData.minimumLengthOfStay} nights</span>
                      </div>
                    )}
                    {formData.maximumLengthOfStay && (
                      <div>
                        <span className="text-sm text-gray-600">Maximum stay:</span>{' '}
                        <span className="font-medium">{formData.maximumLengthOfStay} nights</span>
                      </div>
                    )}
                    {formData.releasePeriod && (
                      <div>
                        <span className="text-sm text-gray-600">Release period:</span>{' '}
                        <span className="font-medium">{formData.releasePeriod} days</span>
                      </div>
                    )}
                    {formData.inclusions && (
                      <div>
                        <span className="text-sm text-gray-600">Inclusions:</span>{' '}
                        <span className="font-medium">{formData.inclusions}</span>
                      </div>
                    )}
                    {formData.minimumRate && (
                      <div>
                        <span className="text-sm text-gray-600">Minimum rate:</span>{' '}
                        <span className="font-medium">NGN {formData.minimumRate.toFixed(2)}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Show on booking engine:</span>{' '}
                      <span className="font-medium">{formData.showOnBookingEngine ? 'Yes' : 'No'}</span>
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
                    Rate plan created successfully!
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Your rate plan has been created and is now active.
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
                    disabled={currentStep === 1 && !formData.name}
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
                    {isSubmitting ? 'Saving...' : 'Save rate plan'}
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
