"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { guestsApi } from '@/lib/api'
import type { Guest } from '@/lib/guest-types'
import type { Reservation } from '@/lib/types'
import Link from 'next/link'

export default function GuestDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const guestId = parseInt(params.id as string)

  const [guest, setGuest] = useState<Guest | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')
  const [idType, setIdType] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [nationality, setNationality] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')

  useEffect(() => {
    fetchGuestDetails()
  }, [guestId])

  const fetchGuestDetails = async () => {
    try {
      setIsLoading(true)
      const guestData = await guestsApi.getById(guestId)
      setGuest(guestData)

      // Populate form fields
      setFirstName(guestData.firstName)
      setLastName(guestData.lastName)
      setEmail(guestData.email)
      setPhone(guestData.phone || '')
      setIdType(guestData.idType || '')
      setIdNumber(guestData.idNumber || '')
      setNationality(guestData.nationality || '')
      setDateOfBirth(guestData.dateOfBirth ? guestData.dateOfBirth.split('T')[0] : '')
      setOrganisation(guestData.organisation || '')
      setAddressLine1(guestData.addressLine1 || '')
      setAddressLine2(guestData.addressLine2 || '')
      setCountry(guestData.country || '')
      setCity(guestData.city || '')
      setState(guestData.state || '')
      setPostalCode(guestData.postalCode || '')

      // Fetch reservations
      const reservationsData = await guestsApi.getReservations(guestId)
      setReservations(reservationsData)
    } catch (err) {
      console.error('Error fetching guest details:', err)
      setError('Failed to load guest details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError('')
      setSuccessMessage('')

      await guestsApi.update(guestId, {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        idType: idType || undefined,
        idNumber: idNumber || undefined,
        nationality: nationality || undefined,
        dateOfBirth: dateOfBirth || undefined,
        organisation: organisation || undefined,
        addressLine1: addressLine1 || undefined,
        addressLine2: addressLine2 || undefined,
        country: country || undefined,
        city: city || undefined,
        state: state || undefined,
        postalCode: postalCode || undefined,
      })

      setSuccessMessage('Guest details updated successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error updating guest:', err)
      setError('Failed to update guest details')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this guest profile?')) return

    try {
      await guestsApi.delete(guestId)
      router.push('/guests')
    } catch (err) {
      console.error('Error deleting guest:', err)
      setError('Failed to delete guest')
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'checkedin':
      case 'checked in':
        return 'bg-blue-100 text-blue-800'
      case 'checkedout':
      case 'checked out':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'pending':
      case 'new booking':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-500">Loading...</div>
        </div>
      </MainLayout>
    )
  }

  if (!guest) {
    return (
      <MainLayout>
        <div className="p-8">
          <div className="text-red-600">Guest not found</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm">
            <Link href="/guests" className="text-blue-600 hover:underline">
              Guests
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">Guest details</span>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-orange-600">GUEST DETAILS</h2>
              <button
                onClick={handleDelete}
                className="text-sm text-gray-600 hover:text-red-600"
              >
                🗑 Delete Profile
              </button>
            </div>

            {/* Guest Details Form */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Choose a Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Identification Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">IDENTIFICATION</h3>
              <div className="grid grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Document Type
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="Driver's license">Driver's license</option>
                    <option value="Passport">Passport</option>
                    <option value="National ID">National ID</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Number
                  </label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Choose a Nationality</option>
                    <option value="Nigerian">Nigerian</option>
                    <option value="British">British</option>
                    <option value="American">American</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">ADDRESS</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organisation
                  </label>
                  <input
                    type="text"
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Choose a Country</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Recent Bookings Section */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-orange-600 mb-4">RECENT BOOKINGS</h3>

              {reservations.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No bookings found for this guest
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Booking Reference
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Check In
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Check Out
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Booked
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Room
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Total
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          To Pay
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Primary Contact
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Invoice
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservations.map((reservation) => (
                        <tr key={reservation.reservationId} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <Link
                              href={`/reservations/${reservation.reservationId}`}
                              className="text-blue-600 hover:underline"
                            >
                              {reservation.bookingReference}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            {new Date(reservation.checkInDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            {new Date(reservation.checkOutDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            {new Date(reservation.createdDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">{reservation.roomName || '-'}</td>
                          <td className="px-4 py-3">
                            ₦{reservation.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            ₦{reservation.outstanding.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(reservation.status)}`}>
                              {reservation.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">-</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
