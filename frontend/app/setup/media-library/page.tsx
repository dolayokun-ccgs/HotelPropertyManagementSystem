"use client"

import React, { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { SetupSidebar } from '@/components/setup/SetupSidebar'
import { MediaUploadZone } from '@/components/media/MediaUploadZone'
import { MediaGrid } from '@/components/media/MediaGrid'
import { Search } from 'lucide-react'

const categories = [
  { id: 'all', label: 'ALL' },
  { id: 'property', label: 'PROPERTY' },
  { id: 'room-types', label: 'ROOM TYPES' },
  { id: 'extras', label: 'EXTRAS' },
  { id: 'guest-communications', label: 'GUEST COMMUNICATIONS' },
  { id: 'floor-plans', label: 'FLOOR PLANS' },
]

export default function MediaLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [media, setMedia] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    fetchMedia()
  }, [selectedCategory, refreshTrigger])

  const fetchMedia = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        propertyId: '1', // TODO: Get from auth context
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { caption: searchQuery }),
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

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleSearch = () => {
    fetchMedia()
  }

  const filteredMedia = media.filter(item =>
    !searchQuery || (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-120px)]">
        <SetupSidebar />

        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-8">
            {/* Page Title */}
            <h1 className="text-3xl font-normal text-gray-900 mb-8">Media library</h1>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search caption"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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

            {/* Upload Zone or Media Grid */}
            {filteredMedia.length === 0 && !isLoading ? (
              <MediaUploadZone
                category={selectedCategory === 'all' ? 'property' : selectedCategory}
                onUploadSuccess={handleUploadSuccess}
              />
            ) : (
              <>
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => {
                      // TODO: Open upload modal
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
                  >
                    Upload images
                  </button>
                </div>
                <MediaGrid
                  media={filteredMedia}
                  isLoading={isLoading}
                  onDelete={() => setRefreshTrigger(prev => prev + 1)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
