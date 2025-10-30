"use client"

import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface MediaItem {
  mediaId: number
  fileName: string
  caption?: string
  width?: number
  height?: number
  category: string
  url: string
}

interface MediaSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (mediaId: number) => void
  roomTypeId: number
}

const categories = [
  { id: 'all', label: 'ALL' },
  { id: 'property', label: 'PROPERTY' },
  { id: 'room-types', label: 'ROOM TYPES' },
  { id: 'extras', label: 'EXTRAS' },
  { id: 'guest-communications', label: 'GUEST COMMUNICATIONS' },
  { id: 'floor-plans', label: 'FLOOR PLANS' },
]

export function MediaSelectionModal({ isOpen, onClose, onSelect, roomTypeId }: MediaSelectionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('room-types')
  const [searchQuery, setSearchQuery] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchMedia()
    }
  }, [isOpen, selectedCategory])

  const fetchMedia = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        propertyId: '1',
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        isActive: 'true',
      })

      const response = await fetch(`http://localhost:5000/api/media?${params}`)
      if (response.ok) {
        const data = await response.json()
        setMedia(data)
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedMediaId) return

    try {
      const response = await fetch(`http://localhost:5000/api/media/roomtypes/${roomTypeId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaId: selectedMediaId,
          displayOrder: 0,
          isPrimary: false,
        }),
      })

      if (response.ok) {
        onSelect(selectedMediaId)
        onClose()
      } else {
        const error = await response.text()
        alert(`Failed to assign media: ${error}`)
      }
    } catch (error) {
      console.error('Failed to assign media:', error)
      alert('Failed to assign media')
    }
  }

  const filteredMedia = media.filter(item =>
    !searchQuery || (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Media library</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search caption"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mb-6">
            <div className="flex gap-6 border-b border-gray-200">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                    selectedCategory === category.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Media Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading images...</div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-900 text-xl font-bold mb-3">
                Your property is beautiful, it needs beautiful images
              </p>
              <p className="text-gray-600 mb-4">Drag and drop files here to upload</p>
              <p className="text-gray-500 mb-4">or</p>
              <button
                onClick={() => {
                  onClose()
                  window.location.href = '/setup/media-library'
                }}
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Upload images
              </button>
              <p className="text-gray-500 text-sm mt-6">
                Recommended image dimensions: 2560px width and 1500px height
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.mediaId}
                  onClick={() => setSelectedMediaId(item.mediaId)}
                  className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    selectedMediaId === item.mediaId
                      ? 'border-primary ring-2 ring-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={`http://localhost:5000${item.url}`}
                      alt={item.caption || item.fileName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedMediaId === item.mediaId && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs text-gray-900 truncate">
                      {item.caption || item.fileName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedMediaId}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Assign
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
