"use client"

import React, { useState } from 'react'
import { X, Check } from 'lucide-react'

interface AddPromotionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddPromotionModal({ isOpen, onClose, onSuccess }: AddPromotionModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    defaultDiscount: 0,
    currency: 'NGN',
    showDiscountToGuests: false,
    stayAnyDate: false,
    stayStartDate: '',
    stayEndDate: '',
    sellAnyDate: false,
    sellStartDate: '',
    sellEndDate: '',
    assignedRoomRateIds: '',
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
    if (currentStep < 4) {
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
      const response = await fetch('http://localhost:5000/api/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          defaultDiscount: parseFloat(formData.defaultDiscount.toString()) || 0,
        }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        alert('Failed to create promotion')
      }
    } catch (error) {
      console.error('Failed to create promotion:', error)
      alert('Failed to create promotion')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const steps = [
    { number: 1, name: 'GENERAL INFORMATION' },
    { number: 2, name: 'AVAILABILITY' },
    { number: 3, name: 'ASSIGN TO ROOM RATES' },
    { number: 4, name: 'REVIEW AND SAVE' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Adding a new promotion code</h2>
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
                STEP {currentStep === 1 ? 'ONE' : currentStep === 2 ? 'TWO' : currentStep === 3 ? 'THREE' : 'FOUR'}
              </h3>

              {/* Step 1: General Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">General information</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        The promotion code that your guests will use <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="For example: wintersale, honeymoonpackage, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Promotion code description
                        <span className="text-gray-500 ml-2">0/{formData.description.length}500</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Add a description here describing to your guests the benefits of this promotion code when it is applied."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={4}
                        maxLength={500}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default discount <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-3">
                        <select
                          name="currency"
                          value={formData.currency}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="NGN">NGN</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                        <input
                          type="number"
                          name="defaultDiscount"
                          value={formData.defaultDiscount}
                          onChange={handleInputChange}
                          placeholder="0"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="showDiscountToGuests"
                          checked={formData.showDiscountToGuests}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">Show discount amount to guests</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Availability */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Stay dates</h2>
                  <p className="text-gray-600 mb-8">This is the period in which your promotion code is applicable for your guest to use with their stay.</p>

                  <div className="space-y-6 mb-12">
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer mb-4">
                        <input
                          type="radio"
                          name="stayAnyDate"
                          checked={formData.stayAnyDate}
                          onChange={() => setFormData(prev => ({ ...prev, stayAnyDate: true }))}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">Any date</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="staySelectedDate"
                          checked={!formData.stayAnyDate}
                          onChange={() => setFormData(prev => ({ ...prev, stayAnyDate: false }))}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">Selected dates only</span>
                      </label>
                    </div>

                    {!formData.stayAnyDate && (
                      <div className="grid grid-cols-2 gap-4 pl-7">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Start date:</label>
                          <input
                            type="date"
                            name="stayStartDate"
                            value={formData.stayStartDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">End date:</label>
                          <input
                            type="date"
                            name="stayEndDate"
                            value={formData.stayEndDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Sell dates</h2>
                  <p className="text-gray-600 mb-8">This is the period in which your promotion code is advertised in the booking engine.</p>

                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer mb-4">
                        <input
                          type="radio"
                          name="sellAnyDate"
                          checked={formData.sellAnyDate}
                          onChange={() => setFormData(prev => ({ ...prev, sellAnyDate: true }))}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">Any date</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="sellSelectedDate"
                          checked={!formData.sellAnyDate}
                          onChange={() => setFormData(prev => ({ ...prev, sellAnyDate: false }))}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">Selected dates only</span>
                      </label>
                    </div>

                    {!formData.sellAnyDate && (
                      <div className="grid grid-cols-2 gap-4 pl-7">
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Start date:</label>
                          <input
                            type="date"
                            name="sellStartDate"
                            value={formData.sellStartDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">End date:</label>
                          <input
                            type="date"
                            name="sellEndDate"
                            value={formData.sellEndDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Assign to Room Rates */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Assign to room rates</h2>

                  <div className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search room rates"
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>

                    <div>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-primary">Select all room rates</span>
                      </label>
                    </div>

                    <div className="text-sm text-gray-500 py-12 text-center">
                      Select room rates to apply this promotion code
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review and Save */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Review and save</h2>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-4">GENERAL INFORMATION</h3>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">The promotion code that your guests will use</span>
                          <span className="font-medium">{formData.code}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Promotion code description</span>
                          <span className="font-medium">{formData.description || '-'}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Default discount</span>
                          <span className="font-medium">{formData.defaultDiscount} {formData.currency}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Show discount amount to guests</span>
                          <span className="font-medium">{formData.showDiscountToGuests ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-4">AVAILABILITY</h3>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Applicable dates (guests can use it on these dates)</span>
                          <span className="font-medium">
                            {formData.stayAnyDate ? 'Any date' : `from ${formData.stayStartDate || '-'} to ${formData.stayEndDate || '-'}`}
                          </span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="text-gray-600">Advertised dates (guests can book on these dates)</span>
                          <span className="font-medium">
                            {formData.sellAnyDate ? 'Any date' : `from ${formData.sellStartDate || '-'} to ${formData.sellEndDate || '-'}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-4">ASSIGNED TO</h3>
                      <div className="text-sm text-gray-600">
                        No room rates assigned
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
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

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={currentStep === 1 && !formData.code}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
