"use client"

import React, { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { DirectBookingSidebar } from '@/components/direct-booking/DirectBookingSidebar'
import { Search } from 'lucide-react'
import { AddRatePlanModal } from '@/components/direct-booking/AddRatePlanModal'

interface RatePlan {
  ratePlanId: number
  name: string
  description?: string
  minimumLengthOfStay?: number
  maximumLengthOfStay?: number
  releasePeriod?: number
  inclusions?: string
  minimumRate?: number
  rateManagementType: string
  isActive: boolean
  isDefault: boolean
  showOnBookingEngine: boolean
}

export default function DirectBookingRatesPage() {
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'added' | 'not-added'>('all')

  useEffect(() => {
    fetchRatePlans()
  }, [])

  const fetchRatePlans = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/rateplans?isActive=true')
      if (response.ok) {
        const data = await response.json()
        setRatePlans(data)
      }
    } catch (error) {
      console.error('Failed to fetch rate plans:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRatePlans = ratePlans.filter(rp => {
    const matchesSearch = rp.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterStatus === 'all' ? true :
      filterStatus === 'added' ? rp.showOnBookingEngine :
      !rp.showOnBookingEngine
    return matchesSearch && matchesFilter
  })

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-120px)]">
        <DirectBookingSidebar />

        <div className="flex-1 overflow-auto bg-white">
          <div className="max-w-5xl mx-auto p-8">
            {/* Empty State */}
            {!isLoading && ratePlans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-32 h-32 bg-blue-50 rounded-lg flex items-center justify-center mb-6 relative">
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Offering rooms for free? Add your rate plans</h2>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  Rate plans will help you maximise your revenue in periods of high or low demand.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Add a rate plan
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Direct booking rates ({ratePlans.length})
                </h1>

                {/* Filters */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-sm font-medium text-gray-700">Show rates by status</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilterStatus('added')}
                        className={`px-4 py-2 text-sm rounded-md ${
                          filterStatus === 'added'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Added
                      </button>
                      <button
                        onClick={() => setFilterStatus('not-added')}
                        className={`px-4 py-2 text-sm rounded-md ${
                          filterStatus === 'not-added'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Not added
                      </button>
                      <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 text-sm rounded-md ${
                          filterStatus === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Filter room types</option>
                      </select>
                      <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Filter rate plans</option>
                      </select>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </button>
                    <button className="text-primary hover:text-blue-700">Clear all</button>
                  </div>
                </div>

                {/* Rate Plans List */}
                {isLoading ? (
                  <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {filteredRatePlans.map((ratePlan) => (
                      <div
                        key={ratePlan.ratePlanId}
                        className="border border-gray-300 rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{ratePlan.name}</h3>
                              {ratePlan.isDefault && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{ratePlan.description || 'No description'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-sm font-medium rounded ${
                              ratePlan.showOnBookingEngine
                                ? 'bg-blue-100 text-primary'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {ratePlan.showOnBookingEngine ? 'Added' : 'Not added'}
                            </span>
                            <button className="p-2 hover:bg-gray-100 rounded">
                              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Rate Plan Details */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          {ratePlan.minimumRate && (
                            <div>
                              <span className="text-gray-500">Minimum rate:</span>
                              <span className="ml-2 font-medium">${ratePlan.minimumRate}</span>
                            </div>
                          )}
                          {ratePlan.minimumLengthOfStay && (
                            <div>
                              <span className="text-gray-500">Min stay:</span>
                              <span className="ml-2 font-medium">{ratePlan.minimumLengthOfStay} nights</span>
                            </div>
                          )}
                          {ratePlan.maximumLengthOfStay && (
                            <div>
                              <span className="text-gray-500">Max stay:</span>
                              <span className="ml-2 font-medium">{ratePlan.maximumLengthOfStay} nights</span>
                            </div>
                          )}
                          {ratePlan.releasePeriod && (
                            <div>
                              <span className="text-gray-500">Release period:</span>
                              <span className="ml-2 font-medium">{ratePlan.releasePeriod} days</span>
                            </div>
                          )}
                          {ratePlan.inclusions && (
                            <div>
                              <span className="text-gray-500">Inclusions:</span>
                              <span className="ml-2 font-medium">{ratePlan.inclusions}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">Rate management:</span>
                            <span className="ml-2 font-medium">{ratePlan.rateManagementType}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Rate Plan Modal */}
      {isAddModalOpen && (
        <AddRatePlanModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            fetchRatePlans()
            setIsAddModalOpen(false)
          }}
        />
      )}
    </MainLayout>
  )
}
