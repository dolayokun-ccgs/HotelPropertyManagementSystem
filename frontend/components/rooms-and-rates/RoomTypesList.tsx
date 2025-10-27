"use client"

import React, { useState, useEffect } from 'react'
import { roomTypesApi } from '@/lib/api'
import type { RoomType } from '@/lib/types'

interface RoomTypesListProps {
  onAddRoomType: () => void
}

export function RoomTypesList({ onAddRoomType }: RoomTypesListProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedTypes, setExpandedTypes] = useState<Set<number>>(new Set())
  const [filterCategory, setFilterCategory] = useState<string>('')

  useEffect(() => {
    fetchRoomTypes()
  }, [])

  const fetchRoomTypes = async () => {
    setIsLoading(true)
    try {
      const data = await roomTypesApi.getAll(true) // only active
      setRoomTypes(data)
    } catch (error) {
      console.error('Failed to fetch room types:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpand = (roomTypeId: number) => {
    const newExpanded = new Set(expandedTypes)
    if (newExpanded.has(roomTypeId)) {
      newExpanded.delete(roomTypeId)
    } else {
      newExpanded.add(roomTypeId)
    }
    setExpandedTypes(newExpanded)
  }

  const expandAll = () => {
    setExpandedTypes(new Set(roomTypes.map(rt => rt.roomTypeId)))
  }

  const collapseAll = () => {
    setExpandedTypes(new Set())
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room type?')) return

    try {
      await roomTypesApi.delete(id)
      fetchRoomTypes()
    } catch (error) {
      console.error('Failed to delete room type:', error)
      alert('Failed to delete room type')
    }
  }

  const filteredRoomTypes = filterCategory
    ? roomTypes.filter(rt => rt.category?.toLowerCase().includes(filterCategory.toLowerCase()))
    : roomTypes

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Room types ({filteredRoomTypes.length})
        </h2>
        <button
          onClick={onAddRoomType}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
        >
          Add room type
        </button>
      </div>

      {/* Filters and actions */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Filter room types</option>
            <option value="Premium">Premium</option>
            <option value="Standard">Standard</option>
            <option value="Budget">Budget</option>
          </select>
          {filterCategory && (
            <button
              onClick={() => setFilterCategory('')}
              className="text-sm text-primary hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {expandedTypes.size === 0 ? (
            <button
              onClick={expandAll}
              className="text-sm text-primary hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Expand all
            </button>
          ) : (
            <button
              onClick={collapseAll}
              className="text-sm text-primary hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Collapse all
            </button>
          )}
        </div>
      </div>

      {/* Room types list */}
      <div className="space-y-4">
        {filteredRoomTypes.map((roomType) => (
          <div
            key={roomType.roomTypeId}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* Room type header - clickable to expand/collapse */}
            <div
              onClick={() => toggleExpand(roomType.roomTypeId)}
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      expandedTypes.has(roomType.roomTypeId) ? 'rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{roomType.name}</h3>
                    {roomType.category && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                        {roomType.category}
                      </span>
                    )}
                  </div>

                  {roomType.description && (
                    <p className="text-sm text-gray-600 mb-3">{roomType.description}</p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    {roomType.bedType && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>{roomType.bedType}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{roomType.maxOccupancy} max</span>
                    </div>

                    <div>{roomType.bathrooms} bathroom{roomType.bathrooms !== 1 ? 's' : ''}</div>

                    {roomType.roomSize && (
                      <div>{roomType.roomSize} SQM</div>
                    )}

                    <div className="text-gray-500">
                      {roomType.roomCount} room{roomType.roomCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(roomType.roomTypeId)
                }}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium ml-4"
              >
                Delete
              </button>
            </div>

            {/* Expanded content */}
            {expandedTypes.has(roomType.roomTypeId) && (
              <div className="border-t border-gray-200 bg-gray-50 p-6">
                <div className="grid grid-cols-3 gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Base occupancy:</span>{' '}
                    <span className="font-medium">{roomType.baseOccupancy}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Smoking:</span>{' '}
                    <span className="font-medium">{roomType.smokingAllowed ? 'Allowed' : 'Not allowed'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Available rooms:</span>{' '}
                    <span className="font-medium">{roomType.availableRoomCount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRoomTypes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No room types found. {filterCategory && 'Try adjusting your filters or '}
          <button onClick={onAddRoomType} className="text-primary hover:text-blue-700 font-medium">
            add a new room type
          </button>
          .
        </div>
      )}
    </div>
  )
}
