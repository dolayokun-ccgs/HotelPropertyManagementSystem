"use client"

import React, { useState, useEffect } from 'react'
import { X, Info, Plus, Minus, Trash2, GripVertical } from 'lucide-react'
import type { RoomType } from '@/lib/types'
import { roomTypesApi } from '@/lib/api'

interface EditRoomTypeModalProps {
  isOpen: boolean
  onClose: () => void
  roomType: RoomType | null
  onSuccess: () => void
}

interface BedConfig {
  id: number
  bedType: string
  quantity: number
}

export function EditRoomTypeModal({ isOpen, onClose, roomType, onSuccess }: EditRoomTypeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    internalName: '',
    customName: '',
    roomCount: 2,
    maxOccupancy: 2,
    maxAdults: 2,
    maxChildren: 1,
    maxInfants: 1,
    baseOccupancy: 2,
    roomSize: 500,
    bathrooms: 1,
    smokingAllowed: false,
    roomView: '',
  })

  const [amenities, setAmenities] = useState<string[]>(['Air conditioning', 'Apple TV'])
  const [bedConfigs, setBedConfigs] = useState<BedConfig[]>([
    { id: 1, bedType: 'Queen', quantity: 1 }
  ])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && roomType) {
      setFormData({
        name: roomType.name,
        category: roomType.category || '',
        description: roomType.description || '',
        internalName: roomType.name, // Since we don't have separate field
        customName: '',
        roomCount: roomType.roomCount || 2,
        maxOccupancy: roomType.maxOccupancy,
        maxAdults: roomType.maxOccupancy, // Default to maxOccupancy
        maxChildren: 1,
        maxInfants: 1,
        baseOccupancy: roomType.baseOccupancy,
        roomSize: roomType.roomSize || 500,
        bathrooms: roomType.bathrooms,
        smokingAllowed: roomType.smokingAllowed,
        roomView: '',
      })

      // Parse bed type if available
      if (roomType.bedType) {
        setBedConfigs([{ id: 1, bedType: roomType.bedType, quantity: 1 }])
      }
    }
  }, [isOpen, roomType])

  const handleSubmit = async () => {
    if (!roomType) return

    setIsSaving(true)
    setError('')

    try {
      // Prepare update data - must include ALL required fields for the API
      const updateData = {
        roomTypeId: roomType.roomTypeId,
        propertyId: roomType.propertyId,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        maxOccupancy: formData.maxOccupancy,
        baseOccupancy: formData.baseOccupancy,
        bedType: bedConfigs.length > 0 ? bedConfigs[0].bedType : null,
        roomSize: formData.roomSize,
        bathrooms: formData.bathrooms,
        smokingAllowed: formData.smokingAllowed,
        isActive: roomType.isActive,
        roomCount: roomType.roomCount,
        availableRoomCount: roomType.availableRoomCount,
      }

      await roomTypesApi.update(roomType.roomTypeId, updateData)
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error updating room type:', err)
      setError('Failed to update room type')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!roomType) return
    if (!confirm('Are you sure you want to delete this room type?')) return

    try {
      await roomTypesApi.delete(roomType.roomTypeId)
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error deleting room type:', err)
      alert('Failed to delete room type')
    }
  }

  const addBedConfig = (bedType: string) => {
    if (!bedType) return
    const newId = Math.max(...bedConfigs.map(b => b.id), 0) + 1
    setBedConfigs([...bedConfigs, { id: newId, bedType, quantity: 1 }])
  }

  const updateBedQuantity = (id: number, delta: number) => {
    setBedConfigs(bedConfigs.map(b =>
      b.id === id ? { ...b, quantity: Math.max(1, b.quantity + delta) } : b
    ))
  }

  const removeBedConfig = (id: number) => {
    setBedConfigs(bedConfigs.filter(b => b.id !== id))
  }

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter(a => a !== amenity))
  }

  if (!isOpen || !roomType) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Side panel */}
      <div className="relative bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-normal text-gray-900">Edit room type</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* GENERAL INFORMATION */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              General Information
            </h3>

            <div className="space-y-4">
              {/* Room category */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Room category <span className="text-red-500">*</span>
                  <button className="ml-1 text-gray-400 hover:text-gray-600">
                    <Info className="w-4 h-4 inline" />
                  </button>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Suite">Suite</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                </select>
              </div>

              {/* Room type name */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Room type name <span className="text-red-500">*</span>
                  <button className="ml-1 text-gray-400 hover:text-gray-600">
                    <Info className="w-4 h-4 inline" />
                  </button>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Internal room type name */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Internal room type name
                  <button className="ml-1 text-gray-400 hover:text-gray-600">
                    <Info className="w-4 h-4 inline" />
                  </button>
                </label>
                <input
                  type="text"
                  value={formData.internalName}
                  onChange={(e) => setFormData({ ...formData, internalName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description for guest */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Description for guest
                  <button className="ml-1 text-gray-400 hover:text-gray-600">
                    <Info className="w-4 h-4 inline" />
                  </button>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Add description"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Custom room type name */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Custom room type name (Booking Engine only)
                  <button className="ml-1 text-gray-400 hover:text-gray-600">
                    <Info className="w-4 h-4 inline" />
                  </button>
                </label>
                <input
                  type="text"
                  value={formData.customName}
                  onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
                  placeholder="Add custom room type name"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Number of rooms */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Number of rooms of this type <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.roomCount}
                  onChange={(e) => setFormData({ ...formData, roomCount: parseInt(e.target.value) || 0 })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    Manage number of rooms in{' '}
                    <button className="text-blue-600 hover:underline">
                      Edit rooms
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OCCUPANCY */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Occupancy
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Maximum occupancy <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxOccupancy}
                  onChange={(e) => setFormData({ ...formData, maxOccupancy: parseInt(e.target.value) || 0 })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Maximum adults <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxAdults}
                  onChange={(e) => setFormData({ ...formData, maxAdults: parseInt(e.target.value) || 0 })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Maximum children <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxChildren}
                  onChange={(e) => setFormData({ ...formData, maxChildren: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Maximum infants <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxInfants}
                  onChange={(e) => setFormData({ ...formData, maxInfants: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Features
            </h3>

            <div className="space-y-4">
              {/* Room size */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Room size</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.roomSize}
                    onChange={(e) => setFormData({ ...formData, roomSize: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 pr-20 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    SQM(m²)
                  </span>
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Bathrooms</label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Smoking policy */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Smoking policy</label>
                <div className="grid grid-cols-2 gap-0 border border-gray-300 rounded overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, smokingAllowed: false })}
                    className={`px-4 py-2 text-sm font-medium ${
                      !formData.smokingAllowed
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Non-smoking
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, smokingAllowed: true })}
                    className={`px-4 py-2 text-sm font-medium ${
                      formData.smokingAllowed
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Smoking
                  </button>
                </div>
              </div>

              {/* Room view */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Room view</label>
                <select
                  value={formData.roomView}
                  onChange={(e) => setFormData({ ...formData, roomView: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Search and select a room view</option>
                  <option value="Sea view">Sea view</option>
                  <option value="Beach view">Beach view</option>
                  <option value="City view">City view</option>
                  <option value="Garden view">Garden view</option>
                  <option value="Mountain view">Mountain view</option>
                </select>
              </div>

              {/* Amenities and facilities */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Amenities and facilities</label>
                <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded min-h-[42px]">
                  {amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-sm rounded"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Display order */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Display order</label>
                <div className="space-y-2">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-2 border border-gray-200 rounded"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BED TYPE CONFIGURATION */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Bed type configuration
            </h3>

            <div className="space-y-3">
              {bedConfigs.map((bed) => (
                <div
                  key={bed.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded"
                >
                  <span className="text-sm font-medium">{bed.bedType}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateBedQuantity(bed.id, -1)}
                      className="w-6 h-6 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{bed.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateBedQuantity(bed.id, 1)}
                      className="w-6 h-6 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-50"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBedConfig(bed.id)}
                      className="text-red-600 hover:text-red-700 ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              <select
                onChange={(e) => {
                  addBedConfig(e.target.value)
                  e.target.value = ''
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>Add bed type</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Queen">Queen</option>
                <option value="King">King</option>
                <option value="Bunk">Bunk</option>
              </select>

              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add bedroom
              </button>
            </div>
          </div>

          {/* MEDIA */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Media
            </h3>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Assign from Media library
            </button>
          </div>

          {/* Delete room type */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 text-sm flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete room type
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
