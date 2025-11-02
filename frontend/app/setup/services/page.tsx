'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2 } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'

interface Property {
  propertyId: number
  propertyDescriptionEnglish?: string
  propertyFacilities?: string
  parking?: string
  transport?: string
  instructionsToLocationEnglish?: string
}

export default function ServicesPage() {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Property>>({})

  useEffect(() => {
    fetchProperty()
  }, [])

  const fetchProperty = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:5000/api/properties/1')
      if (response.ok) {
        const data = await response.json()
        setProperty(data)
        setFormData(data)
      }
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!property) return

    try {
      setIsSaving(true)
      const response = await fetch(`http://localhost:5000/api/properties/${property.propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...property, ...formData }),
      })

      if (response.ok) {
        const updatedProperty = await response.json()
        setProperty(updatedProperty)
        setIsEditing(null)
      }
    } catch (error) {
      console.error('Error updating property:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(property || {})
    setIsEditing(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Property not found</div>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="flex h-full bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r">
          <div className="p-6">
          <a
            href="/setup/general-information"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded"
          >
            General information
          </a>
          <a
            href="/setup/property-details"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded mt-1"
          >
            Property details
          </a>
          <a
            href="/setup/services"
            className="block py-2 px-3 text-primary bg-red-50 border-l-4 border-primary rounded mt-1"
          >
            Services
          </a>
          <a
            href="/setup/policies"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded mt-1"
          >
            Policies
          </a>
          <a
            href="/setup/media-library"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded mt-1"
          >
            Media library
          </a>
          </div>
        </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Services</h1>

          {/* Property Description Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Property description</h2>
              {isEditing !== 'description' && (
                <button
                  onClick={() => setIsEditing('description')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'description' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                  <textarea
                    value={formData.propertyDescriptionEnglish || ''}
                    onChange={(e) => setFormData({ ...formData, propertyDescriptionEnglish: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe your property..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">English</div>
                  <div className="text-base text-gray-900 whitespace-pre-wrap">
                    {property.propertyDescriptionEnglish || '-'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Features</h2>
              {isEditing !== 'features' && (
                <button
                  onClick={() => setIsEditing('features')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'features' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property facilities</label>
                  <textarea
                    value={formData.propertyFacilities || ''}
                    onChange={(e) => setFormData({ ...formData, propertyFacilities: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="List property facilities (e.g., WiFi, Pool, Gym)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parking</label>
                  <textarea
                    value={formData.parking || ''}
                    onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe parking facilities..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transport</label>
                  <textarea
                    value={formData.transport || ''}
                    onChange={(e) => setFormData({ ...formData, transport: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe transport options..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Property facilities</div>
                  <div className="text-base text-gray-900 whitespace-pre-wrap">
                    {property.propertyFacilities || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Parking</div>
                  <div className="text-base text-gray-900 whitespace-pre-wrap">
                    {property.parking || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Transport</div>
                  <div className="text-base text-gray-900 whitespace-pre-wrap">
                    {property.transport || '-'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions to Location Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Instructions to the location</h2>
              {isEditing !== 'instructions' && (
                <button
                  onClick={() => setIsEditing('instructions')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'instructions' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                  <textarea
                    value={formData.instructionsToLocationEnglish || ''}
                    onChange={(e) => setFormData({ ...formData, instructionsToLocationEnglish: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Provide directions to your property..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">English</div>
                  <div className="text-base text-gray-900 whitespace-pre-wrap">
                    {property.instructionsToLocationEnglish || '-'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  )
}
