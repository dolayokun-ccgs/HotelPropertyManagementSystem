"use client"

import React, { useState, useRef } from 'react'
import { Image as ImageIcon } from 'lucide-react'

interface MediaUploadZoneProps {
  category: string
  onUploadSuccess: () => void
}

export function MediaUploadZone({ category, onUploadSuccess }: MediaUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      await uploadFiles(files)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files))
    }
  }

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true)

    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user')
      const user = userData ? JSON.parse(userData) : null

      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('propertyId', '1') // TODO: Get from auth context
        formData.append('category', category)
        formData.append('caption', file.name.replace(/\.[^/.]+$/, '')) // filename without extension
        formData.append('uploadedBy', user?.userId || '1')

        const response = await fetch('http://localhost:5000/api/media/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }
      }

      alert(`Successfully uploaded ${files.length} image(s)`)
      onUploadSuccess()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging
          ? 'border-primary bg-blue-50'
          : 'border-gray-300 bg-white'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-32 h-32 bg-blue-50 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Text */}
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Your property is beautiful, it needs beautiful images
      </h2>
      <p className="text-gray-600 mb-6">
        {isUploading ? 'Uploading...' : 'Drag and drop files here to upload'}
      </p>

      {/* Upload Button */}
      {!isUploading && (
        <>
          <p className="text-gray-500 mb-4">or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
            disabled={isUploading}
          >
            Upload images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </>
      )}

      {/* Recommendation */}
      <p className="text-gray-500 text-sm mt-6">
        Recommended image dimensions: 2560px width and 1500px height
      </p>
    </div>
  )
}
