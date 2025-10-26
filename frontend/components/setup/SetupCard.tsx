"use client"

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SetupCardProps {
  title: string
  icon: string
  links: string[]
}

export function SetupCard({ title, icon, links }: SetupCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Card Links */}
      <div className="space-y-1">
        {links.map((link, index) => (
          <Link
            key={index}
            href="#"
            className={cn(
              "block px-3 py-2 text-sm rounded-md transition-colors",
              "text-[#0066cc] hover:bg-[#f0f7ff]"
            )}
          >
            {link}
          </Link>
        ))}
      </div>
    </div>
  )
}
