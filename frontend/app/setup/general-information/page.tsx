'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2 } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'

interface Property {
  propertyId: number
  name: string
  type: string
  address: string
  currency: string
  timezone: string
  currencyConversion: boolean
  minimumRate?: number
  updatePeriod: number
  weekendStartsOn: string
  autoReplenishment: boolean
  reservationDeliveryFailureEmail?: string
  baseLanguage: string
  unitsOfMeasurement: string
}

export default function GeneralInformationPage() {
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
            className="block py-2 px-3 text-primary bg-red-50 border-l-4 border-primary rounded"
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">General information</h1>

          {/* Alert Banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Please review and update the following items to assist in your setup</h3>
              <p className="mt-1 text-sm text-yellow-700">Set a reservation delivery failure email</p>
            </div>
          </div>

          {/* Currency Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Currency</h2>
              {isEditing !== 'currency' && (
                <button
                  onClick={() => setIsEditing('currency')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'currency' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base currency</label>
                  <select
                    value={formData.currency || ''}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="NGN">Nigerian Naira (NGN)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound Sterling (GBP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency conversion</label>
                  <select
                    value={formData.currencyConversion ? 'enabled' : 'disabled'}
                    onChange={(e) => setFormData({ ...formData, currencyConversion: e.target.value === 'enabled' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="disabled">Disabled</option>
                    <option value="enabled">Enabled</option>
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
                  <div className="text-sm text-gray-600">Base currency</div>
                  <div className="text-base text-gray-900">
                    {property.currency === 'NGN' ? 'Nigerian Naira (NGN)' :
                     property.currency === 'USD' ? 'US Dollar (USD)' :
                     property.currency === 'EUR' ? 'Euro (EUR)' :
                     property.currency === 'GBP' ? 'British Pound Sterling (GBP)' : property.currency}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Currency conversion</div>
                  <div className="text-base text-gray-900">{property.currencyConversion ? 'Enabled' : 'Disabled'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Inventory Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Inventory</h2>
              {isEditing !== 'inventory' && (
                <button
                  onClick={() => setIsEditing('inventory')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'inventory' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum rate</label>
                  <input
                    type="number"
                    value={formData.minimumRate || ''}
                    onChange={(e) => setFormData({ ...formData, minimumRate: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter minimum rate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update period</label>
                  <input
                    type="number"
                    value={formData.updatePeriod || 400}
                    onChange={(e) => setFormData({ ...formData, updatePeriod: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weekend starts on</label>
                  <select
                    value={formData.weekendStartsOn || 'Saturday'}
                    onChange={(e) => setFormData({ ...formData, weekendStartsOn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto-replenishment</label>
                  <select
                    value={formData.autoReplenishment ? 'enabled' : 'disabled'}
                    onChange={(e) => setFormData({ ...formData, autoReplenishment: e.target.value === 'enabled' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="disabled">Disabled</option>
                    <option value="enabled">Enabled</option>
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
                  <div className="text-sm text-gray-600">Minimum rate</div>
                  <div className="text-base text-gray-900">{property.minimumRate || 'Not set'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Update period</div>
                  <div className="text-base text-gray-900">{property.updatePeriod}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Weekend starts on</div>
                  <div className="text-base text-gray-900">{property.weekendStartsOn}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Auto-replenishment</div>
                  <div className="text-base text-gray-900">{property.autoReplenishment ? 'Enabled' : 'Disabled'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Reservation Alerts Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Reservation alerts</h2>
              {isEditing !== 'alerts' && (
                <button
                  onClick={() => setIsEditing('alerts')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'alerts' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reservation delivery failure e-mail</label>
                  <input
                    type="email"
                    value={formData.reservationDeliveryFailureEmail || ''}
                    onChange={(e) => setFormData({ ...formData, reservationDeliveryFailureEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="email@example.com"
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
                  <div className="text-sm text-gray-600">Reservation delivery failure e-mail</div>
                  {property.reservationDeliveryFailureEmail ? (
                    <div className="text-base text-gray-900">{property.reservationDeliveryFailureEmail}</div>
                  ) : (
                    <div className="flex items-center text-amber-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Not set
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Language and Region Section */}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Language and region</h2>
              {isEditing !== 'language' && (
                <button
                  onClick={() => setIsEditing('language')}
                  className="text-primary hover:text-blue-700"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {isEditing === 'language' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base language</label>
                  <select
                    value={formData.baseLanguage || 'English'}
                    onChange={(e) => setFormData({ ...formData, baseLanguage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Units of measurement</label>
                  <select
                    value={formData.unitsOfMeasurement || 'Metric'}
                    onChange={(e) => setFormData({ ...formData, unitsOfMeasurement: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Metric">Metric</option>
                    <option value="Imperial">Imperial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time zone</label>
                  <select
                    value={formData.timezone || 'UTC'}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="UTC">GMT Etc/UTC (Etc/UTC)</option>
                    <option value="America/New_York">EST (America/New_York)</option>
                    <option value="America/Los_Angeles">PST (America/Los_Angeles)</option>
                    <option value="Europe/London">GMT (Europe/London)</option>
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
                  <div className="text-sm text-gray-600">Base language</div>
                  <div className="text-base text-gray-900">{property.baseLanguage}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Units of measurement</div>
                  <div className="text-base text-gray-900">{property.unitsOfMeasurement}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Time zone</div>
                  <div className="text-base text-gray-900">
                    {property.timezone === 'UTC' ? 'GMT Etc/UTC (Etc/UTC)' : property.timezone}
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
