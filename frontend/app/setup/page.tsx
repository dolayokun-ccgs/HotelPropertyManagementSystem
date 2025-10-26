import React from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { SetupCard } from '@/components/setup/SetupCard'

const setupSections = [
  {
    title: "Property settings",
    icon: "🏨",
    links: [
      "General information",
      "Property details",
      "Services",
      "Policies",
      "Media library"
    ]
  },
  {
    title: "Getting started",
    icon: "🚀",
    links: [
      "Import reservations",
      "Set up rooms and rates"
    ]
  },
  {
    title: "Distribution",
    icon: "🌐",
    links: [
      "Connect a channel",
      "Yield rules"
    ]
  },
  {
    title: "Taxes & accounting",
    icon: "💼",
    links: [
      "Tax settings",
      "Accounting exports",
      "Tax identifiers"
    ]
  },
  {
    title: "Payment methods",
    icon: "💳",
    links: [
      "Accepted payments",
      "Customise invoices"
    ]
  },
  {
    title: "Website & promotion",
    icon: "🖥️",
    links: [
      "Translations",
      "Guest emails",
      "Booking engine display",
      "Extra selling items",
      "Live booking engine URL"
    ]
  }
]

export default function SetupPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Setup</h1>

        {/* Setup Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {setupSections.map((section, index) => (
            <SetupCard
              key={index}
              title={section.title}
              icon={section.icon}
              links={section.links}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
