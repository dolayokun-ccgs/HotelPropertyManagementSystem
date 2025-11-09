"use client"

import React, { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { guestsApi } from '@/lib/api'
import type { Guest } from '@/lib/guest-types'
import { Search, Download } from 'lucide-react'

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchGuests()
  }, [])

  const fetchGuests = async (search?: string) => {
    try {
      setIsLoading(true)
      setError('')
      const data = await guestsApi.getAll({ search, isActive: true })
      setGuests(data)
    } catch (err) {
      console.error('Error fetching guests:', err)
      setError('Failed to load guests')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchGuests(searchTerm)
  }

  const handleExportGuests = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Total Reservations', 'Last Stay']
    const rows = guests.map(g => [
      `${g.firstName} ${g.lastName}`,
      g.email,
      g.phone || '',
      g.totalReservations.toString(),
      g.lastStayDate ? new Date(g.lastStayDate).toLocaleDateString() : ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `guests-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <MainLayout>
      <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--color-blue-light)' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-normal mb-6">Guests</h1>

          {/* Search Section */}
          <div className="bg-gray-700 p-8 rounded-lg mb-6">
            <h2 className="text-white text-lg font-normal mb-4 text-center">Find a guest</h2>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, phone or booking number"
                  className="w-full pl-12 pr-4 py-3 rounded bg-white text-gray-900"
                />
              </div>
            </form>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleExportGuests}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
              >
                <Download className="w-4 h-4" />
                Export all guests
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-sm">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="p-12 text-center text-gray-500">Loading...</div>
            ) : guests.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                {searchTerm ? 'No guests found matching your search' : 'No guests found'}
              </div>
            ) : (
              <>
                <div className="p-4 border-b bg-orange-50">
                  <p className="text-orange-600 font-medium">
                    {guests.length} GUEST{guests.length !== 1 ? 'S' : ''} FOUND
                  </p>
                </div>

                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reservations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Stay
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guests.map((guest) => (
                      <tr key={guest.guestId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">
                            {guest.firstName} {guest.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.phone || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.totalReservations}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {guest.lastStayDate
                              ? new Date(guest.lastStayDate).toLocaleDateString()
                              : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href={`/guests/${guest.guestId}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View/Edit Profile →
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
