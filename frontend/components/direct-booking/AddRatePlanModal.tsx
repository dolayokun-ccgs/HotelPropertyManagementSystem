"use client"

import React, { useState } from 'react'
import { X, Check } from 'lucide-react'

interface AddRatePlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddRatePlanModal({ isOpen, onClose, onSuccess }: AddRatePlanModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minimumLengthOfStay: '',
    maximumLengthOfStay: '',
    releasePeriod: '',
    inclusions: '',
    minimumRate: '',
    rateManagementType: 'Manual',
    showOnBookingEngine: true,
    applicableDates: false,
    advertisedDates: false,
    maxAdvanceBooking: false,
    dynamicDiscounts: false,
    restrictMobile: false,
    highlightRate: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('http://localhost:5000/api/rateplans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          minimumLengthOfStay: formData.minimumLengthOfStay ? parseInt(formData.minimumLengthOfStay) : null,
          maximumLengthOfStay: formData.maximumLengthOfStay ? parseInt(formData.maximumLengthOfStay) : null,
          releasePeriod: formData.releasePeriod ? parseInt(formData.releasePeriod) : null,
          inclusions: formData.inclusions,
          minimumRate: formData.minimumRate ? parseFloat(formData.minimumRate) : null,
          rateManagementType: formData.rateManagementType,
          showOnBookingEngine: formData.showOnBookingEngine,
          isActive: true,
          isDefault: false,
        }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        alert('Failed to create rate plan')
      }
    } catch (error) {
      console.error('Failed to create rate plan:', error)
      alert('Failed to create rate plan')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const steps = [
    { number: 1, name: 'GENERAL INFORMATION' },
    { number: 2, name: 'RESTRICTIONS AND INCLUSIONS' },
    { number: 3, name: 'PRICING DETAILS' },
    { number: 4, name: 'DIRECT BOOKING CONTROLS' },
    { number: 5, name: 'REVIEW AND SAVE' },
    { number: 6, name: 'NEXT STEPS' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add a rate plan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-6 border-r border-gray-200">
            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex items-start gap-3 ${step.number === currentStep ? 'text-gray-900' : step.number < currentStep ? 'text-green-600' : 'text-gray-400'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.number === currentStep ? 'bg-gray-200 text-gray-900' :
                    step.number < currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step.number < currentStep ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <span className="text-sm font-medium mt-1">{step.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-2xl">
              <h3 className="text-sm font-semibold text-primary uppercase mb-1">
                STEP {['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX'][currentStep - 1]}
              </h3>

              {/* Step 1: General Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">GENERAL INFORMATION</h2>
                  <p className="text-gray-600 mb-8">How would you describe this rate plan (for your internal use)?</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate plan name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter a name for your rate plan"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate plan description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="This description is not displayed to your guests, only your extranet's users can see it. This helps you distinguish which rate plan you created and how it is being applied."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Restrictions and Inclusions */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">RESTRICTIONS AND INCLUSIONS</h2>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Would you like to limit the length of stay?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Minimum length of stay</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              name="minimumLengthOfStay"
                              value={formData.minimumLengthOfStay}
                              onChange={handleInputChange}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              min="0"
                            />
                            <span className="text-sm text-gray-600">nights</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Maximum length of stay</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              name="maximumLengthOfStay"
                              value={formData.maximumLengthOfStay}
                              onChange={handleInputChange}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              min="0"
                            />
                            <span className="text-sm text-gray-600">nights</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Do guests need to book in advance?</h3>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Release period</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            name="releasePeriod"
                            value={formData.releasePeriod}
                            onChange={handleInputChange}
                            className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            min="0"
                          />
                          <span className="text-sm text-gray-600">days</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Would you like to include any meals?</h3>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Inclusions</label>
                        <select
                          name="inclusions"
                          value={formData.inclusions}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select inclusions</option>
                          <option value="Breakfast">Breakfast</option>
                          <option value="Breakfast and Lunch">Breakfast and Lunch</option>
                          <option value="Breakfast and Dinner">Breakfast and Dinner</option>
                          <option value="All Meals">All Meals</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Pricing Details */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">PRICING DETAILS</h2>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Would you like to set a minimum rate?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Property base currency</label>
                          <input
                            type="text"
                            value="British Pound Sterling"
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Minimum rate</label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">NGN</span>
                            <input
                              type="number"
                              name="minimumRate"
                              value={formData.minimumRate}
                              onChange={handleInputChange}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Derived from property minimum rate of the selected currency (NGN)</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">How will you manage your rates?</h3>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="rateManagementType"
                            value="Manual"
                            checked={formData.rateManagementType === 'Manual'}
                            onChange={handleInputChange}
                            className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                          />
                          <div>
                            <div className="font-medium text-gray-900">Manually input daily rates</div>
                            <p className="text-sm text-gray-600 mt-1">You will be able to manually set rates for each day</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Direct Booking Controls */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">DIRECT BOOKING CONTROLS</h2>
                  <p className="text-gray-600 mb-8">Customise booking dates and discounts for your own booking engine</p>

                  <div className="space-y-6">
                    {[
                      { key: 'applicableDates', label: 'Applicable dates' },
                      { key: 'advertisedDates', label: 'Advertised dates' },
                      { key: 'maxAdvanceBooking', label: 'Maximum advance booking dates' },
                      { key: 'dynamicDiscounts', label: 'Dynamic discounts' },
                      { key: 'restrictMobile', label: 'Restrict rate to mobile device' },
                      { key: 'highlightRate', label: 'Highlight this rate plan on your booking engine' },
                    ].map((control) => (
                      <div key={control.key} className="flex items-center justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-700">{control.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name={control.key}
                            checked={formData[control.key as keyof typeof formData] as boolean}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Review and Save */}
              {currentStep === 5 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">REVIEW AND SAVE</h2>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-4">GENERAL INFORMATION</h3>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Rate plan name</span>
                          <span className="font-medium">{formData.name || '-'}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Description</span>
                          <span className="font-medium">{formData.description || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-4">RESTRICTIONS AND INCLUSIONS</h3>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Default minimum stay</span>
                          <span className="font-medium">{formData.minimumLengthOfStay || '-'}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Default maximum stay</span>
                          <span className="font-medium">{formData.maximumLengthOfStay || '-'}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Release period</span>
                          <span className="font-medium">{formData.releasePeriod || '-'}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Inclusions</span>
                          <span className="font-medium">{formData.inclusions || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-4">PRICING</h3>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Currency</span>
                          <span className="font-medium">Nigerian Naira</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Minimum rate</span>
                          <span className="font-medium">{formData.minimumRate ? `NGN ${formData.minimumRate}` : '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Next Steps */}
              {currentStep === 6 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Rate plan created successfully!</h2>
                  <p className="text-gray-600 mb-6">Your rate plan has been created and is now ready to use.</p>
                  <button
                    onClick={() => {
                      onSuccess()
                      onClose()
                    }}
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {currentStep !== 6 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-primary hover:text-blue-700 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                disabled={currentStep === 1 && !formData.name}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => {
                  handleSubmit()
                  setCurrentStep(6)
                }}
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create rate plan'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
