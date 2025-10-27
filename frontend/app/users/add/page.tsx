"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'

export default function AddUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    preferredLanguage: 'English (US)',
    phoneNumber: '',
    password: 'TempPass123!', // Temporary password
    userManagement: false,
    userLevel: 'General',
  })

  const [permissions, setPermissions] = useState({
    // Property
    propertySettings: true,
    roomsAndRates: true,
    mediaLibrary: true,
    // Distribution
    inventory: true,
    channels: true,
    yieldRules: true,
    demandPlus: true,
    // Direct booking
    directBookingRates: true,
    promotions: true,
    extras: true,
    configuration: true,
    // Reservations
    reservationsDetails: true,
    guestPaymentDetails: false,
    // Reports
    operationalReports: true,
    strategicReports: true,
    // Front desk
    housekeeping: true,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handlePermissionChange = (permission: string) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission as keyof typeof prev]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          role: formData.userLevel,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Failed to create user')
        return
      }

      // Redirect back to users list
      router.push('/users')
    } catch (error) {
      console.error('Failed to create user:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Black header with back button */}
        <div className="bg-black text-white py-4 px-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Add user</h1>

          <form onSubmit={handleSubmit}>
            {/* USER DETAILS */}
            <div className="mb-12">
              <h2 className="text-sm font-semibold text-gray-900 uppercase mb-6">USER DETAILS</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                    E-mail address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm text-gray-700 mb-2">
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm text-gray-700 mb-2">
                      Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferredLanguage" className="block text-sm text-gray-700 mb-2">
                      Preferred language <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="preferredLanguage"
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="English (UK)">English (UK)</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm text-gray-700 mb-2">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ACCOUNT PERMISSIONS */}
            <div className="mb-12 pb-12 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 uppercase mb-6">ACCOUNT PERMISSIONS</h2>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="userManagement"
                  checked={formData.userManagement}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <div>
                  <div className="font-medium text-gray-900">User management</div>
                  <div className="text-sm text-gray-600">Allow this user to add, edit or delete other users</div>
                </div>
              </label>
            </div>

            {/* PLATFORM PERMISSIONS */}
            <div className="mb-12">
              <h2 className="text-sm font-semibold text-gray-900 uppercase mb-6">PLATFORM PERMISSIONS</h2>

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">USER LEVEL</h3>
                <div className="flex items-start gap-4">
                  <select
                    name="userLevel"
                    value={formData.userLevel}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="General">General</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Customised access and permissions according to permission settings
                  </div>
                </div>
              </div>

              {/* Show detailed permissions only for General users */}
              {formData.userLevel === 'General' && (
                <div className="space-y-8">
                  <h3 className="text-sm font-semibold text-gray-900">PERMISSIONS</h3>

                  {/* Property */}
                  <PermissionSection
                    title="Property"
                    description="Access to property and payment settings."
                    permissions={[
                      { key: 'propertySettings', label: 'Property settings' },
                      { key: 'roomsAndRates', label: 'Rooms and rates' },
                      { key: 'mediaLibrary', label: 'Media library' },
                    ]}
                    values={permissions}
                    onChange={handlePermissionChange}
                  />

                  {/* Distribution */}
                  <PermissionSection
                    title="Distribution"
                    description="Access to room availability, inventory, rates and restrictions across all channels."
                    permissions={[
                      { key: 'inventory', label: 'Inventory' },
                      { key: 'channels', label: 'Channels' },
                      { key: 'yieldRules', label: 'Yield rules' },
                      { key: 'demandPlus', label: 'Demand Plus' },
                    ]}
                    values={permissions}
                    onChange={handlePermissionChange}
                  />

                  {/* Direct booking */}
                  <PermissionSection
                    title="Direct booking"
                    description="Access to direct booking engine and website builder settings."
                    permissions={[
                      { key: 'directBookingRates', label: 'Direct booking rates' },
                      { key: 'promotions', label: 'Promotions' },
                      { key: 'extras', label: 'Extras' },
                      { key: 'configuration', label: 'Configuration' },
                    ]}
                    values={permissions}
                    onChange={handlePermissionChange}
                  />

                  {/* Reservations */}
                  <PermissionSection
                    title="Reservations"
                    description="Access to reservations."
                    permissions={[
                      { key: 'reservationsDetails', label: 'Reservations details and operational reports' },
                      { key: 'guestPaymentDetails', label: 'Guest payment details' },
                    ]}
                    values={permissions}
                    onChange={handlePermissionChange}
                  />

                  {/* Reports */}
                  <PermissionSection
                    title="Reports"
                    description="Access to Front desk's Operational & Strategic reports, and Insights."
                    permissions={[
                      { key: 'operationalReports', label: 'Operational reports' },
                      { key: 'strategicReports', label: 'Strategic reports' },
                    ]}
                    values={permissions}
                    onChange={handlePermissionChange}
                  />

                  {/* Front desk */}
                  <PermissionSection
                    title="Front desk"
                    description="Access to configure the Front desk setup."
                    permissions={[
                      { key: 'housekeeping', label: 'Housekeeping' },
                    ]}
                    values={permissions}
                    onChange={handlePermissionChange}
                  />
                </div>
              )}

              {formData.userLevel === 'Admin' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-gray-700">
                    Admin users have full access to all features and settings.
                  </p>
                </div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-primary hover:text-blue-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create user'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}

interface PermissionSectionProps {
  title: string
  description: string
  permissions: { key: string; label: string }[]
  values: Record<string, boolean>
  onChange: (key: string) => void
}

function PermissionSection({ title, description, permissions, values, onChange }: PermissionSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="space-y-3">
        {permissions.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={values[key as keyof typeof values]}
              onChange={() => onChange(key)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
