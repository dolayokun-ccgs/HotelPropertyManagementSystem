"use client"

import React, { useState, useEffect } from 'react'
import { GripVertical, Trash2, Info } from 'lucide-react'
import type { Room, RoomType } from '@/lib/types'
import { roomTypesApi } from '@/lib/api'

interface EditRoomsModalProps {
  isOpen: boolean
  onClose: () => void
  roomType: RoomType | null
  onSuccess: () => void
}

export function EditRoomsModal({ isOpen, onClose, roomType, onSuccess }: EditRoomsModalProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [showBulkCreate, setShowBulkCreate] = useState(false)
  const [bulkCount, setBulkCount] = useState(2)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (isOpen && roomType) {
      fetchRooms()
    }
  }, [isOpen, roomType])

  const fetchRooms = async () => {
    if (!roomType) return

    try {
      setIsLoading(true)
      setError('')

      // Get room type with rooms
      const roomTypeData = await roomTypesApi.getById(roomType.roomTypeId)

      if (roomTypeData.rooms && roomTypeData.rooms.length > 0) {
        setRooms(roomTypeData.rooms)
        setShowBulkCreate(false)
      } else {
        // No rooms exist, show bulk creation
        setRooms([])
        setShowBulkCreate(true)
      }
    } catch (err) {
      console.error('Error fetching rooms:', err)
      setError('Failed to load rooms')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRoom = () => {
    const newRoom: Room = {
      roomId: Date.now(), // Temporary ID
      roomTypeId: roomType!.roomTypeId,
      roomNumber: `${roomType!.name} ${rooms.length + 1}`,
      status: 'Available',
      isActive: true,
      propertyId: 1, // Will be set by backend
    }
    setRooms([...rooms, newRoom])
    setHasChanges(true)
  }

  const handleRemoveRoom = (roomId: number) => {
    setRooms(rooms.filter(r => r.roomId !== roomId))
    setHasChanges(true)
  }

  const handleRoomNameChange = (roomId: number, newName: string) => {
    setRooms(rooms.map(r =>
      r.roomId === roomId ? { ...r, roomNumber: newName } : r
    ))
    setHasChanges(true)
  }

  const handleDiscardChanges = () => {
    if (hasChanges && !confirm('Are you sure you want to discard your changes?')) return
    setHasChanges(false)
    onClose()
  }

  const handleBulkCreate = async () => {
    if (!roomType || bulkCount < 1) return

    setIsSaving(true)
    setError('')

    try {
      // Create multiple rooms
      const newRooms: Room[] = []
      for (let i = 1; i <= bulkCount; i++) {
        newRooms.push({
          roomId: Date.now() + i, // Temporary ID
          roomTypeId: roomType.roomTypeId,
          roomNumber: `${roomType.name} ${i}`,
          status: 'Available',
          isActive: true,
          propertyId: 1,
        })
      }

      setRooms(newRooms)
      setShowBulkCreate(false)
      setHasChanges(true)
    } catch (err) {
      console.error('Error creating rooms:', err)
      setError('Failed to create rooms')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = async () => {
    if (!roomType) return

    setIsSaving(true)
    setError('')

    try {
      // Update room type with rooms
      // For now, we'll just show success
      // In production, you'd call an API endpoint to save the rooms

      console.log('Saving rooms:', rooms)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error saving rooms:', err)
      setError('Failed to save rooms')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen || !roomType) return null

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <div className="text-sm text-gray-600 mb-2">
                <span className="text-blue-600 hover:underline cursor-pointer" onClick={handleDiscardChanges}>
                  Room types
                </span>
                {' '}/{' '}
                <span>{roomType.name}</span>
              </div>
              <h2 className="text-2xl font-normal text-gray-900">
                {roomType.name}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDiscardChanges}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Discard changes
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || rooms.length === 0}
                className="px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading rooms...</div>
          ) : showBulkCreate ? (
            /* Bulk Creation View */
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center max-w-md mx-auto">
              <h3 className="text-lg font-normal text-gray-900 mb-6">
                How many of this room type do you have?
              </h3>
              <div className="mb-6">
                <select
                  value={bulkCount}
                  onChange={(e) => setBulkCount(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleBulkCreate}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
              >
                {isSaving ? 'Creating...' : 'Add rooms'}
              </button>
            </div>
          ) : (
            /* Edit Rooms View */
            <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-3xl mx-auto">
              <div className="mb-6 text-sm text-gray-600 flex items-center gap-1">
                Edit names and order for the Calendar.
                <button className="text-gray-400 hover:text-gray-600">
                  <Info className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                {rooms.map((room, index) => (
                  <div
                    key={room.roomId}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors"
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move flex-shrink-0" />
                    <input
                      type="text"
                      value={room.roomNumber}
                      onChange={(e) => handleRoomNameChange(room.roomId, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleRemoveRoom(room.roomId)}
                      className="text-red-600 hover:text-red-700 flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddRoom}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <span className="text-lg">+</span> Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
