"use client"

import React, { useState, useEffect } from 'react'
import type { BookingSummary } from '@/lib/reservation-types'
import type { Payment } from '@/lib/reservation-types'

interface ReservationPaymentsTabProps {
  reservationId: number
  bookingSummary: BookingSummary
}

export function ReservationPaymentsTab({
  reservationId,
  bookingSummary,
}: ReservationPaymentsTabProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch payments for this reservation
    fetchPayments()
  }, [reservationId])

  const fetchPayments = async () => {
    try {
      setIsLoading(true)
      // TODO: Fetch from API
      // const data = await paymentsApi.getReservationPayments(reservationId)
      // setPayments(data)
      setPayments([])
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h3 className="text-lg font-medium text-orange-600 mb-4">COMPLETED PAYMENTS</h3>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded">
            <p className="text-blue-800">
              No payments recorded yet. Click "Record Payment" to add a payment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.paymentId} className="bg-blue-50 border border-blue-200 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">
                    Recorded Payment ({payment.paymentMethod})
                  </h4>
                  <span className="text-sm text-gray-600">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Card</span>
                    <p className="font-medium">{payment.cardNumber || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount</span>
                    <p className="font-medium">₦{payment.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Surcharge</span>
                    <p className="font-medium">₦{payment.surcharge.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total</span>
                    <p className="font-medium">₦{(payment.amount + payment.surcharge).toFixed(2)}</p>
                  </div>
                </div>

                {payment.notes && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">Note:</span> {payment.notes}
                  </div>
                )}

                <div className="mt-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    Record Refund
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Summary Sidebar */}
      <div className="w-80 bg-gray-50 border-l p-6">
        <h3 className="text-lg font-semibold mb-4">BOOKING SUMMARY</h3>

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

          <button className="w-full mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded">
            Record Payment
          </button>
        </div>
      </div>
    </div>
  )
}
