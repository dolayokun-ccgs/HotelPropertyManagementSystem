"use client"

import React, { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { DistributionSidebar } from '@/components/distribution/DistributionSidebar'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RoomType {
  roomTypeId: number
  name: string
  availableRoomCount: number
}

export default function InventoryPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRoomTypes()
  }, [])

  const fetchRoomTypes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/roomtypes?isActive=true')
      if (response.ok) {
        const data = await response.json()
        setRoomTypes(data)
      }
    } catch (error) {
      console.error('Failed to fetch room types:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate 14 days from current date
  const getDates = () => {
    const dates = []
    for (let i = 0; i < 14; i++) {
      const date = new Date(currentDate)
      date.setDate(currentDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const dates = getDates()

  const formatDateHeader = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()].toUpperCase()
    }
  }

  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7)
    } else if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      return setCurrentDate(new Date())
    }
    setCurrentDate(newDate)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSaturday = (date: Date) => date.getDay() === 6
  const isSunday = (date: Date) => date.getDay() === 0

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-120px)]">
        <DistributionSidebar />

        <div className="flex-1 overflow-auto bg-white">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
                <button className="px-4 py-2 text-sm text-white bg-gray-300 rounded hover:bg-gray-400">
                  Save changes
                </button>
                <button className="px-4 py-2 text-sm text-white bg-primary rounded hover:bg-blue-700">
                  Bulk update
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View by</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>All rates and availabilities</option>
                  <option>Availability only</option>
                  <option>Rates only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room types</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Filter room types</option>
                  {roomTypes.map(rt => (
                    <option key={rt.roomTypeId} value={rt.roomTypeId}>{rt.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate plans</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Filter rate plans</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room rates</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search room rates"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">
                    {currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => navigateDate('today')}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                View today
              </button>
            </div>

            {/* Inventory Grid */}
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : (
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="sticky left-0 bg-white z-10 p-3 text-left w-64 border-r border-gray-300"></th>
                        {dates.map((date, idx) => {
                          const header = formatDateHeader(date)
                          const today = isToday(date)
                          const sat = isSaturday(date)
                          const sun = isSunday(date)

                          return (
                            <th
                              key={idx}
                              className={`p-2 text-center min-w-[80px] border-r border-gray-300 ${
                                today ? 'bg-blue-50' : sat ? 'bg-orange-50' : sun ? 'bg-red-50' : ''
                              }`}
                            >
                              <div className={`text-xs ${sat || sun ? 'text-red-600' : 'text-gray-600'}`}>
                                {today ? 'TODAY' : header.day.toUpperCase()}
                              </div>
                              <div className="text-lg font-bold text-gray-900">{header.date}</div>
                              <div className="text-xs text-gray-500">{header.month}</div>
                            </th>
                          )
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {roomTypes.map((roomType) => (
                        <React.Fragment key={roomType.roomTypeId}>
                          {/* Room Type Header */}
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <td className="sticky left-0 bg-gray-50 z-10 p-3 font-semibold text-gray-900 border-r border-gray-300" colSpan={15}>
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                {roomType.name}
                              </div>
                            </td>
                          </tr>
                          {/* Availability Row */}
                          <tr className="border-b border-gray-200">
                            <td className="sticky left-0 bg-white z-10 p-3 text-sm text-gray-600 border-r border-gray-300">
                              <div className="uppercase text-xs font-medium">AVAILABILITY</div>
                            </td>
                            {dates.map((date, idx) => (
                              <td key={idx} className="p-2 border-r border-gray-300">
                                <input
                                  type="number"
                                  defaultValue={roomType.availableRoomCount}
                                  className="w-full px-2 py-2 text-center bg-orange-400 text-white font-semibold rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                  min="0"
                                />
                              </td>
                            ))}
                          </tr>
                          {/* Rate Row */}
                          <tr className="border-b border-gray-300">
                            <td className="sticky left-0 bg-white z-10 p-3 text-sm border-r border-gray-300">
                              <div className="text-gray-700">Halloween</div>
                              <div className="uppercase text-xs font-medium text-gray-500">RATES</div>
                            </td>
                            {dates.map((date, idx) => (
                              <td key={idx} className="p-2 border-r border-gray-300">
                                <input
                                  type="number"
                                  defaultValue="50"
                                  className="w-full px-2 py-2 text-center bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                  min="0"
                                />
                              </td>
                            ))}
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
