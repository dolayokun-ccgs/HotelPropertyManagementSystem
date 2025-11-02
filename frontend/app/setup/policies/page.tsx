'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2 } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'

interface Property {
  propertyId: number
  checkInTime?: string
  checkOutTime?: string
  smokingPolicy?: string
  termsAndConditionsEnglish?: string
  paymentPolicyEnglish?: string
}

export default function PoliciesPage() {
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
            className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded mt-1"
          >
            Services
          </a>
          <a
            href="/setup/policies"
            className="block py-2 px-3 text-primary bg-red-50 border-l-4 border-primary rounded mt-1"
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Policies</h1>

          {/* Check-in / Check-out Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Check-in / Check-out</h2>
              {isEditing !== 'checkin' && (
                <button
                  onClick={() => setIsEditing('checkin')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'checkin' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start time for check-in</label>
                  <input
                    type="time"
                    value={formData.checkInTime || ''}
                    onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End time for check-out</label>
                  <input
                    type="time"
                    value={formData.checkOutTime || ''}
                    onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
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
                  <div className="text-sm text-gray-600">Start time for check-in</div>
                  <div className="text-base text-gray-900">{property.checkInTime || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">End time for check-out</div>
                  <div className="text-base text-gray-900">{property.checkOutTime || '-'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Smoking Policy Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Smoking policy</h2>
              {isEditing !== 'smoking' && (
                <button
                  onClick={() => setIsEditing('smoking')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'smoking' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property policy</label>
                  <select
                    value={formData.smokingPolicy || ''}
                    onChange={(e) => setFormData({ ...formData, smokingPolicy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Not specified</option>
                    <option value="No Smoking">No Smoking</option>
                    <option value="Smoking Allowed">Smoking Allowed</option>
                    <option value="Designated Areas Only">Designated Areas Only</option>
                  </select>
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
                  <div className="text-sm text-gray-600">Property policy</div>
                  <div className="text-base text-gray-900">{property.smokingPolicy || '-'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Terms and Conditions Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Terms, conditions and privacy policy</h2>
              {isEditing !== 'terms' && (
                <button
                  onClick={() => setIsEditing('terms')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'terms' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                  <textarea
                    value={formData.termsAndConditionsEnglish || ''}
                    onChange={(e) => setFormData({ ...formData, termsAndConditionsEnglish: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your terms and conditions..."
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
                    {property.termsAndConditionsEnglish || '-'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Policy Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Payment policy</h2>
              {isEditing !== 'payment' && (
                <button
                  onClick={() => setIsEditing('payment')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">Payment policy will appear on your guest's invoice.</p>

            {isEditing === 'payment' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                  <textarea
                    value={formData.paymentPolicyEnglish || ''}
                    onChange={(e) => setFormData({ ...formData, paymentPolicyEnglish: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your payment policy..."
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
                    {property.paymentPolicyEnglish || '-'}
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
