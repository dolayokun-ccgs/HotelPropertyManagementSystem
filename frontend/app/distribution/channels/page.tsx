"use client"

import React, { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { DistributionSidebar } from '@/components/distribution/DistributionSidebar'
import { ChevronRight, Search, SlidersHorizontal } from 'lucide-react'

interface Channel {
  id: string
  name: string
  isConnected: boolean
  logo?: string
}

const POPULAR_CHANNELS: Channel[] = [
  { id: 'direct-booking', name: 'Direct Booking', isConnected: true },
  { id: 'booking-com', name: 'Booking.com', isConnected: false },
  { id: 'airbnb', name: 'Airbnb', isConnected: false },
  { id: 'expedia', name: 'Expedia', isConnected: false },
  { id: 'hotels-com', name: 'Hotels.com', isConnected: false },
  { id: 'agoda', name: 'Agoda', isConnected: false },
]

const ALL_CHANNELS: Channel[] = [
  { id: 'direct-booking', name: 'Direct Booking', isConnected: true },
  { id: '1way2italy', name: '1way2italy', isConnected: false },
  { id: 'abc-travel-taipei', name: 'ABC Travel Taipei', isConnected: false },
  { id: 'aic-travel-group', name: 'AIC Travel Group', isConnected: false },
  { id: 'alaric', name: 'ALARIC', isConnected: false },
  { id: 'anzcro', name: 'ANZCRO', isConnected: false },
  { id: 'atel-hotels', name: 'ATEL Hotels', isConnected: false },
  { id: 'acomos-staybooked', name: 'Acomos Staybooked', isConnected: false },
  { id: 'bookme-maldives', name: 'BookMe Maldives', isConnected: false },
  { id: 'bookvisit', name: 'BookVisit | Citybreak | Nozio', isConnected: false },
  { id: 'bookassist', name: 'Bookassist', isConnected: false },
  { id: 'bookerclub-com', name: 'Bookerclub.com', isConnected: false },
  { id: 'booking-direct', name: 'Booking Direct', isConnected: false },
  { id: 'booking-com', name: 'Booking.com', isConnected: false },
  { id: 'airbnb', name: 'Airbnb', isConnected: false },
  { id: 'expedia', name: 'Expedia', isConnected: false },
  { id: 'hotels-com', name: 'Hotels.com', isConnected: false },
  { id: 'agoda', name: 'Agoda', isConnected: false },
]

export default function ChannelsPage() {
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [showConnectionModal, setShowConnectionModal] = useState(false)

  const myChannels = ALL_CHANNELS.filter(c => c.isConnected)
  const allChannels = ALL_CHANNELS

  const filteredChannels = (activeTab === 'my' ? myChannels : allChannels).filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleChannelClick = (channel: Channel) => {
    if (!channel.isConnected) {
      setSelectedChannel(channel)
      setShowConnectionModal(true)
    }
  }

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-120px)]">
        <DistributionSidebar />

        <div className="flex-1 overflow-auto bg-white">
          <div className="max-w-5xl mx-auto p-8">
            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Channels</h1>

            {/* Tabs */}
            <div className="flex gap-8 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('my')}
                className={`pb-3 px-1 text-sm font-medium transition-colors ${
                  activeTab === 'my'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                MY CHANNELS ({myChannels.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-3 px-1 text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ALL CHANNELS ({allChannels.length})
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by channel name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setActiveTab('my')
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all
              </button>
            </div>

            {/* Channels List */}
            <div className="space-y-3">
              {filteredChannels.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No channels found. Try adjusting your search.
                </div>
              ) : (
                filteredChannels.map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => handleChannelClick(channel)}
                    className={`flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:shadow-sm transition-shadow ${
                      !channel.isConnected ? 'cursor-pointer' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">{channel.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {channel.isConnected ? (
                        <span className="text-sm font-medium text-green-600">Connected</span>
                      ) : (
                        <span className="text-sm text-gray-500">Not connected</span>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Connection Modal */}
      {showConnectionModal && selectedChannel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedChannel.name} Channel information
              </h2>
              <button
                onClick={() => setShowConnectionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Important notice</h3>
                    <p className="text-sm text-gray-700">
                      In order to proceed with connecting to {selectedChannel.name}, you will need to have an established account with {selectedChannel.name}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Question */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  Do you have an account with {selectedChannel.name}? <span className="text-red-500">*</span>
                </p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="hasAccount"
                      defaultChecked
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Yes, I have an account with {selectedChannel.name}</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="hasAccount"
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">No, I do not have an account with {selectedChannel.name}</span>
                  </label>
                </div>
              </div>

              {/* Channel Info */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Channel name</p>
                  <p className="font-medium text-gray-900">{selectedChannel.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Maximum update period</p>
                  <p className="font-medium text-gray-900">545 days</p>
                </div>
              </div>

              {/* Data Supported */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Data supported by this channel</p>
                <div className="flex flex-wrap gap-2">
                  {['AVAILABILITY', 'RATES', 'STOP SELL', 'CLOSED TO ARRIVALS', 'CLOSED TO DEPARTURES', 'MINIMUM STAY', 'MAXIMUM STAY'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 text-primary text-xs font-medium rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Data Not Supported */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Data not supported by this channel</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                    INCLUSIONS
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowConnectionModal(false)}
                className="px-6 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Connecting to ${selectedChannel.name}...`)
                  setShowConnectionModal(false)
                }}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
