"use client"

import React, { useState } from 'react'
import { MoreVertical, Trash2 } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

interface MediaItem {
  mediaId: number
  fileName: string
  caption?: string
  width?: number
  height?: number
  fileSize: number
  category: string
  uploadedDate: string
  url: string
}

interface MediaGridProps {
  media: MediaItem[]
  isLoading: boolean
  onDelete: () => void
}

export function MediaGrid({ media, isLoading, onDelete }: MediaGridProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (mediaId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    setDeletingId(mediaId)
    try {
      const response = await fetch(`http://localhost:5000/api/media/${mediaId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDelete()
      } else {
        alert('Failed to delete image')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete image')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading images...
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No images found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((item) => (
        <div
          key={item.mediaId}
          className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Image */}
          <div className="aspect-video bg-gray-100 relative">
            <img
              src={`http://localhost:5000${item.url}`}
              alt={item.caption || item.fileName}
              className="w-full h-full object-cover"
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200 p-1 z-50"
                      sideOffset={5}
                    >
                      <DropdownMenu.Item
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer outline-none"
                        onSelect={() => handleDelete(item.mediaId)}
                        disabled={deletingId === item.mediaId}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{deletingId === item.mediaId ? 'Deleting...' : 'Delete'}</span>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.caption || item.fileName}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {item.width && item.height && `${item.width} × ${item.height} • `}
              {(item.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
