"use client"

import React, { useState, useEffect } from 'react'
import { ratePlansApi } from '@/lib/api'
import type { RatePlan } from '@/lib/types'
import { AssignRoomTypesModal } from '../rate-plans/AssignRoomTypesModal'

interface RatePlansListProps {
  onAddRatePlan: () => void
}

export function RatePlansList({ onAddRatePlan }: RatePlansListProps) {
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedRatePlan, setSelectedRatePlan] = useState<{ id: number; name: string } | null>(null)

  useEffect(() => {
    fetchRatePlans()
  }, [])

  const fetchRatePlans = async () => {
    setIsLoading(true)
    try {
      const data = await ratePlansApi.getAll()
      setRatePlans(data)
    } catch (error) {
      console.error('Failed to fetch rate plans:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this rate plan?')) return

    try {
      await ratePlansApi.delete(id)
      fetchRatePlans()
    } catch (error) {
      console.error('Failed to delete rate plan:', error)
      alert('Failed to delete rate plan')
    }
  }

  const handleSetAsDefault = async (id: number) => {
    try {
      await ratePlansApi.setAsDefault(id)
      fetchRatePlans()
    } catch (error) {
      console.error('Failed to set default rate plan:', error)
      alert('Failed to set as default')
    }
  }

  const handleAssignRoomTypes = (ratePlanId: number, name: string) => {
    setSelectedRatePlan({ id: ratePlanId, name })
    setAssignModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  // Empty state
  if (ratePlans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-4">
        <div className="mb-6">
          <svg
            className="w-32 h-32 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
            <circle cx="12" cy="8" r="3" strokeWidth={1.5} />
            <text x="12" y="10" textAnchor="middle" fontSize="6" fill="currentColor">
              $
            </text>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Offering rooms for free? Add your rate plans
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Rate plans will help you maximise your revenue in periods of high or low demand.
        </p>
        <button
          onClick={onAddRatePlan}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
        >
          Add a rate plan
        </button>
      </div>
    )
  }

  // List view with rate plans
  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Rate plans ({ratePlans.length})
          </h2>
          <button
            onClick={onAddRatePlan}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Add a rate plan
          </button>
        </div>

        <div className="space-y-4">
          {ratePlans.map((plan) => (
            <div
              key={plan.ratePlanId}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    {plan.isDefault && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                        Default
                      </span>
                    )}
                    {!plan.isActive && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </div>

                  {plan.description && (
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {plan.minimumLengthOfStay && (
                      <div>
                        <span className="text-gray-500">Min stay:</span>{' '}
                        <span className="font-medium">{plan.minimumLengthOfStay} nights</span>
                      </div>
                    )}
                    {plan.maximumLengthOfStay && (
                      <div>
                        <span className="text-gray-500">Max stay:</span>{' '}
                        <span className="font-medium">{plan.maximumLengthOfStay} nights</span>
                      </div>
                    )}
                    {plan.releasePeriod && (
                      <div>
                        <span className="text-gray-500">Release period:</span>{' '}
                        <span className="font-medium">{plan.releasePeriod} days</span>
                      </div>
                    )}
                    {plan.minimumRate && (
                      <div>
                        <span className="text-gray-500">Min rate:</span>{' '}
                        <span className="font-medium">NGN {plan.minimumRate.toFixed(2)}</span>
                      </div>
                    )}
                    {plan.inclusions && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Inclusions:</span>{' '}
                        <span className="font-medium">{plan.inclusions}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleAssignRoomTypes(plan.ratePlanId, plan.name)}
                    className="px-3 py-1 text-sm text-primary hover:text-blue-700 font-medium"
                  >
                    Assign room types
                  </button>
                  {!plan.isDefault && plan.isActive && (
                    <button
                      onClick={() => handleSetAsDefault(plan.ratePlanId)}
                      className="px-3 py-1 text-sm text-primary hover:text-blue-700 font-medium"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(plan.ratePlanId)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Room Types Modal */}
      {selectedRatePlan && (
        <AssignRoomTypesModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          ratePlanId={selectedRatePlan.id}
          ratePlanName={selectedRatePlan.name}
        />
      )}
    </>
  )
}
