"use client"

import React, { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { DirectBookingSidebar } from '@/components/direct-booking/DirectBookingSidebar'
import { Search, ChevronDown } from 'lucide-react'
import { AddPromotionModal } from '@/components/direct-booking/AddPromotionModal'

interface Promotion {
  promotionId: number
  code: string
  description?: string
  defaultDiscount: number
  currency: string
  showDiscountToGuests: boolean
  stayStartDate?: string
  stayEndDate?: string
  sellStartDate?: string
  sellEndDate?: string
  isActive: boolean
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/promotions?isActive=true')
      if (response.ok) {
        const data = await response.json()
        setPromotions(data)
      }
    } catch (error) {
      console.error('Failed to fetch promotions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const filteredPromotions = promotions.filter(p =>
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: string | undefined) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-120px)]">
        <DirectBookingSidebar />

        <div className="flex-1 overflow-auto bg-white">
          <div className="max-w-5xl mx-auto p-8">
            {/* Empty State */}
            {!isLoading && promotions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Capture more guests with promo codes</h2>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  Offering promo codes discounts can be a powerful marketing strategy for your property, helping you to offer incentivise more visitors to book.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Create your first promotion code
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Promotion codes ({promotions.length})
                  </h1>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
                    >
                      Add promotion code
                    </button>
                  </div>
                </div>

                {/* Search and Expand */}
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search promotion code"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (expandedIds.size === promotions.length) {
                        setExpandedIds(new Set())
                      } else {
                        setExpandedIds(new Set(promotions.map(p => p.promotionId)))
                      }
                    }}
                    className="flex items-center gap-2 text-primary hover:text-blue-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    {expandedIds.size === promotions.length ? 'Collapse all' : 'Expand all'}
                  </button>
                </div>

                {/* Promotions List */}
                {isLoading ? (
                  <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : (
                  <div className="space-y-3">
                    {filteredPromotions.map((promotion) => (
                      <div
                        key={promotion.promotionId}
                        className="border border-gray-300 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleExpand(promotion.promotionId)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-4 flex-1 text-left">
                            <ChevronDown className={`w-5 h-5 text-gray-400 mt-1 transition-transform ${expandedIds.has(promotion.promotionId) ? 'rotate-0' : '-rotate-90'}`} />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{promotion.code}</h3>
                              <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  Default discount: {promotion.defaultDiscount} {promotion.currency}
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Stay dates: {promotion.stayStartDate ? `from ${formatDate(promotion.stayStartDate)} to ${formatDate(promotion.stayEndDate)}` : 'Any date'}
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  Sell dates: {promotion.sellStartDate ? `from ${formatDate(promotion.sellStartDate)} to ${formatDate(promotion.sellEndDate)}` : 'Any date'}
                                </div>
                              </div>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-gray-200 rounded-full">
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                        </button>

                        {/* Expanded Content */}
                        {expandedIds.has(promotion.promotionId) && (
                          <div className="border-t border-gray-200 p-4 bg-gray-50">
                            <p className="text-sm text-gray-700">
                              {promotion.description || 'No description provided'}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Promotion Modal */}
      {isAddModalOpen && (
        <AddPromotionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            fetchPromotions()
            setIsAddModalOpen(false)
          }}
        />
      )}
    </MainLayout>
  )
}
