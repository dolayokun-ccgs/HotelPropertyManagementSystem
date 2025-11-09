"use client"

import React, { useState, useEffect } from 'react'
import type { BookingSummary } from '@/lib/reservation-types'
import { roomTypesApi, ratePlansApi } from '@/lib/api'
import type { RoomType, Room, RatePlan } from '@/lib/types'

interface ReservationDetailsTabProps {
  reservationId?: number
  onSummaryUpdate: (summary: BookingSummary) => void
  bookingSummary: BookingSummary
  onClose: () => void
}

export function ReservationDetailsTab({
  reservationId,
  onSummaryUpdate,
  bookingSummary,
  onClose,
}: ReservationDetailsTabProps) {
  // Form state
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [lengthOfStay, setLengthOfStay] = useState(1)

  // Data from API
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([])
  const [allRooms, setAllRooms] = useState<Room[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Room details
  const [roomTypeId, setRoomTypeId] = useState<number | ''>('')
  const [ratePlanId, setRatePlanId] = useState<number | ''>('')
  const [roomId, setRoomId] = useState<number | ''>('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [roomTotal, setRoomTotal] = useState(50)
  const [extraPersonTotal, setExtraPersonTotal] = useState(0)
  const [discount, setDiscount] = useState(0)

  // Primary contact
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')

  // ID document
  const [idType, setIdType] = useState("Driver's license")
  const [idNumber, setIdNumber] = useState('')

  // Payment details
  const [cardNumber, setCardNumber] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cardName, setCardName] = useState('')

  // Other details
  const [arrivalTime, setArrivalTime] = useState('')
  const [referral, setReferral] = useState('')
  const [source, setSource] = useState('')

  // Comments
  const [guestComments, setGuestComments] = useState('')

  // Booking status
  const [bookingStatus, setBookingStatus] = useState('New booking')

  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch room types, rate plans, and rooms on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        const [roomTypesData, ratePlansData] = await Promise.all([
          roomTypesApi.getAll(true), // Only active room types
          ratePlansApi.getAll(true), // Only active rate plans
        ])

        setRoomTypes(roomTypesData)
        setRatePlans(ratePlansData)

        // Extract all rooms from room types
        const rooms: Room[] = []
        roomTypesData.forEach(rt => {
          if (rt.rooms) {
            rooms.push(...rt.rooms)
          }
        })
        setAllRooms(rooms)
      } catch (error) {
        console.error('Error fetching room data:', error)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [])

  // Calculate length of stay when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate)
      const checkOut = new Date(checkOutDate)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setLengthOfStay(diffDays)
    }
  }, [checkInDate, checkOutDate])

  // Filter rate plans based on selected room type
  const availableRatePlans = React.useMemo(() => {
    if (!roomTypeId) return ratePlans

    // Filter rate plans that include this room type in their applicable room types
    return ratePlans.filter(plan => {
      if (!plan.applicableRoomTypeIds) return false
      const roomTypeIds = plan.applicableRoomTypeIds.split(',').map(id => parseInt(id.trim()))
      return roomTypeIds.includes(roomTypeId as number)
    })
  }, [roomTypeId, ratePlans])

  // Filter rooms based on selected room type
  const availableRooms = React.useMemo(() => {
    if (!roomTypeId) return []
    return allRooms.filter(room => room.roomTypeId === roomTypeId && room.isActive)
  }, [roomTypeId, allRooms])

  // Handle room type change - reset dependent fields
  const handleRoomTypeChange = (newRoomTypeId: number | '') => {
    setRoomTypeId(newRoomTypeId)
    setRatePlanId('') // Reset rate plan
    setRoomId('') // Reset room number

    // Auto-select first rate plan if only one available
    if (newRoomTypeId) {
      const filtered = ratePlans.filter(plan => {
        if (!plan.applicableRoomTypeIds) return false
        const roomTypeIds = plan.applicableRoomTypeIds.split(',').map(id => parseInt(id.trim()))
        return roomTypeIds.includes(newRoomTypeId as number)
      })

      if (filtered.length === 1) {
        setRatePlanId(filtered[0].ratePlanId)
      }
    }
  }

  // Update booking summary whenever relevant fields change
  useEffect(() => {
    const summary: BookingSummary = {
      roomTotal: roomTotal,
      extraPersonTotal: extraPersonTotal,
      extrasTotal: 0,
      discountTotal: discount,
      creditCardSurcharges: 0,
      total: roomTotal + extraPersonTotal - discount,
      totalReceived: 0,
      totalOutstanding: roomTotal + extraPersonTotal - discount,
    }
    onSummaryUpdate(summary)
  }, [roomTotal, extraPersonTotal, discount, onSummaryUpdate])

  const handleSubmit = async (status: 'Confirmed' | 'New booking') => {
    setIsSubmitting(true)
    setSuccessMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSuccessMessage('Successfully created reservation.')

      // Reset form or close modal after success
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error creating reservation:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Booking Details Section */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check in
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              style={{ width: '180px' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check out
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              style={{ width: '180px' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Length of stay
            </label>
            <input
              type="text"
              value={`${lengthOfStay} Night${lengthOfStay !== 1 ? 's' : ''}`}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
              style={{ width: '150px' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking status
            </label>
            <div className="px-3 py-2 bg-green-100 text-green-800 rounded inline-block" style={{ width: '150px' }}>
              {bookingStatus}
            </div>
          </div>
        </div>

        {/* Room Details Table */}
        <div className="mb-6 border border-gray-300 rounded p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-sm font-medium text-gray-700 pb-2" style={{ width: '140px' }}>Room type</th>
                  <th className="text-left text-sm font-medium text-gray-700 pb-2" style={{ width: '100px' }}>Room rate</th>
                  <th className="text-left text-sm font-medium text-gray-700 pb-2" style={{ width: '100px' }}>Room #</th>
                  <th className="text-left text-sm font-medium text-gray-700 pb-2" style={{ width: '60px' }}>Adults</th>
                  <th className="text-left text-sm font-medium text-gray-700 pb-2" style={{ width: '60px' }}>Children</th>
                  <th className="text-left text-sm font-medium text-gray-700 pb-2" style={{ width: '60px' }}>Infants</th>
                  <th className="text-left text-sm font-medium text-gray-700 pb-2" style={{ width: '100px' }}>Room (₦)</th>
                  <th className="text-left text-sm font-medium text-gray-700 pb-2" style={{ width: '120px' }}>Extra Person (₦)</th>
                  <th className="text-left text-sm font-medium text-gray-700 pb-2" style={{ width: '100px' }}>Discount (₦)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pt-2">
                    <select
                      value={roomTypeId}
                      onChange={(e) => handleRoomTypeChange(e.target.value ? parseInt(e.target.value) : '')}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={isLoadingData}
                    >
                      <option value="">Select Room Type...</option>
                      {roomTypes.map(rt => (
                        <option key={rt.roomTypeId} value={rt.roomTypeId}>
                          {rt.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="pt-2">
                    <select
                      value={ratePlanId}
                      onChange={(e) => setRatePlanId(e.target.value ? parseInt(e.target.value) : '')}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={!roomTypeId || isLoadingData}
                    >
                      <option value="">Select Rate Plan...</option>
                      {availableRatePlans.map(plan => (
                        <option key={plan.ratePlanId} value={plan.ratePlanId}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="pt-2">
                    <select
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value ? parseInt(e.target.value) : '')}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled={!roomTypeId || isLoadingData}
                    >
                      <option value="">Auto</option>
                      {availableRooms.map(room => (
                        <option key={room.roomId} value={room.roomId}>
                          {room.roomNumber}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="pt-2">
                    <input
                      type="number"
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="pt-2">
                    <input
                      type="number"
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="pt-2">
                    <input
                      type="number"
                      value={infants}
                      onChange={(e) => setInfants(parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="pt-2">
                    <input
                      type="number"
                      value={roomTotal}
                      onChange={(e) => setRoomTotal(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="pt-2">
                    <input
                      type="number"
                      value={extraPersonTotal}
                      onChange={(e) => setExtraPersonTotal(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="pt-2">
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 ml-auto">
            <span>+</span> Add another room
          </button>
        </div>

        {/* Primary Contact Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-orange-600 mb-4">PRIMARY CONTACT</h3>

          {/* Row 1: First name, Last name, Email */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
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
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Row 2: Phone number, Organisation, Address line 1 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organisation
              </label>
              <input
                type="text"
                value={organisation}
                onChange={(e) => setOrganisation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address line 1
              </label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Row 3: Address line 2, City, State */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address line 2
              </label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
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
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Row 4: Post code, ID document type, ID document number */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID document type
              </label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Select...</option>
                <option value="Driver's license">Driver's license</option>
                <option value="Passport">Passport</option>
                <option value="National ID">National ID</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID document number
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Payment Section */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Payment</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry month
                </label>
                <select
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Select...</option>
                  <option value="01">01 - January</option>
                  <option value="02">02 - February</option>
                  <option value="03">03 - March</option>
                  <option value="04">04 - April</option>
                  <option value="05">05 - May</option>
                  <option value="06">06 - June</option>
                  <option value="07">07 - July</option>
                  <option value="08">08 - August</option>
                  <option value="09">09 - September</option>
                  <option value="10">10 - October</option>
                  <option value="11">11 - November</option>
                  <option value="12">12 - December</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry year
                </label>
                <select
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Select...</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Name on card"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Other Details Section */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Other Details</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select arrival time
                </label>
                <select
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Select...</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral
                </label>
                <input
                  type="text"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source of reservation
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Guest Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guest comments
            </label>
            <textarea
              value={guestComments}
              onChange={(e) => setGuestComments(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-4 border-t gap-2">
          <button
            onClick={() => handleSubmit('New booking')}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50 font-semibold"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Booking Summary Sidebar */}
      <div className="bg-gray-50 border-l p-5" style={{ width: '280px' }}>
        <h3 className="text-sm font-semibold mb-4">BOOKING SUMMARY</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Room Total</span>
            <span>₦{bookingSummary.roomTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Extra Person Total</span>
            <span>₦{bookingSummary.extraPersonTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Extras Total</span>
            <span>₦{bookingSummary.extrasTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount Total</span>
            <span>₦{bookingSummary.discountTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Credit Card Surcharges</span>
            <span>₦{bookingSummary.creditCardSurcharges.toFixed(2)}</span>
          </div>

          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₦{bookingSummary.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Received</span>
              <span>₦{bookingSummary.totalReceived.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-red-600">
              <span>Total Outstanding</span>
              <span>₦{bookingSummary.totalOutstanding.toFixed(2)}</span>
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
            Record Payment
          </button>
        </div>
      </div>
    </div>
  )
}
