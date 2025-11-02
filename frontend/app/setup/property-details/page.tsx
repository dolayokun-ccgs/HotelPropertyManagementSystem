'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2 } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'

interface Property {
  propertyId: number
  name: string
  address: string
  latitude?: number
  longitude?: number
  publicEmail?: string
  website?: string
  publicPhone?: string
  alternativePhone?: string
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
  propertyRating?: string
  taxId?: string
}

export default function PropertyDetailsPage() {
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
            className="block py-2 px-3 text-primary bg-red-50 border-l-4 border-primary rounded mt-1"
          >
            Property details
          </a>
          <a
            href="/setup/services"
            className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded mt-1"
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Property details</h1>

          {/* Property Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Property</h2>
              {isEditing !== 'property' && (
                <button
                  onClick={() => setIsEditing('property')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'property' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude || ''}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude || ''}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
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
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="text-base text-gray-900">{property.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Address</div>
                  <div className="text-base text-gray-900">{property.address}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Latitude and longitude</div>
                  <div className="text-base text-gray-900">
                    {property.latitude && property.longitude
                      ? `${property.latitude}, ${property.longitude}`
                      : '0, 0'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Contact</h2>
              {isEditing !== 'contact' && (
                <button
                  onClick={() => setIsEditing('contact')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'contact' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Public e-mail</label>
                    <input
                      type="email"
                      value={formData.publicEmail || ''}
                      onChange={(e) => setFormData({ ...formData, publicEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Public phone number</label>
                    <input
                      type="tel"
                      value={formData.publicPhone || ''}
                      onChange={(e) => setFormData({ ...formData, publicPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alternative phone number</label>
                    <input
                      type="tel"
                      value={formData.alternativePhone || ''}
                      onChange={(e) => setFormData({ ...formData, alternativePhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                    <input
                      type="text"
                      value={formData.facebook || ''}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                    <input
                      type="text"
                      value={formData.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                    <input
                      type="text"
                      value={formData.twitter || ''}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                    <input
                      type="text"
                      value={formData.youtube || ''}
                      onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Public e-mail</div>
                    <div className="text-base text-gray-900">{property.publicEmail || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Website</div>
                    <div className="text-base text-gray-900">{property.website || '-'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Public phone number</div>
                    <div className="text-base text-gray-900">{property.publicPhone || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Alternative phone number</div>
                    <div className="text-base text-gray-900">{property.alternativePhone || '-'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Facebook</div>
                    <div className="text-base text-gray-900">{property.facebook || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Instagram</div>
                    <div className="text-base text-gray-900">{property.instagram || '-'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Twitter</div>
                    <div className="text-base text-gray-900">{property.twitter || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">YouTube</div>
                    <div className="text-base text-gray-900">{property.youtube || '-'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Extra Information Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Extra information</h2>
              {isEditing !== 'extra' && (
                <button
                  onClick={() => setIsEditing('extra')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'extra' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property rating</label>
                  <select
                    value={formData.propertyRating || ''}
                    onChange={(e) => setFormData({ ...formData, propertyRating: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">No rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                  <input
                    type="text"
                    value={formData.taxId || ''}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <div className="text-sm text-gray-600">Property rating</div>
                  <div className="text-base text-gray-900">{property.propertyRating || 'No rating'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Tax ID</div>
                  <div className="text-base text-gray-900">{property.taxId || '-'}</div>
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
