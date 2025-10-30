"use client"

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SetupLink {
  label: string
  href: string
}

interface SetupCardProps {
  title: string
  icon: string
  links: (string | SetupLink)[]
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
        {links.map((link, index) => {
          const label = typeof link === 'string' ? link : link.label
          const href = typeof link === 'string' ? '#' : link.href

          return (
            <Link
              key={index}
              href={href}
              className={cn(
                "block px-3 py-2 text-sm rounded-md transition-colors",
                "text-[#0066cc] hover:bg-[#f0f7ff]"
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
