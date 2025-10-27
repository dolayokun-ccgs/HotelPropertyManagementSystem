"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'

interface User {
  userId: number
  firstName: string
  lastName: string
  email: string
  role?: string
  propertyId?: number
  isActive: boolean
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/users?isActive=true')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchUsers() // Refresh the list
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user')
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Black header with back button */}
        <div className="bg-black text-white py-4 px-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Manage users ({users.length})
              </h1>
              <p className="text-gray-600">
                Only users with user management enabled have access to view and edit this page
              </p>
            </div>
            <button
              onClick={() => router.push('/users/add')}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Add user
            </button>
          </div>

          {/* Users List */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No users found. <button onClick={() => router.push('/users/add')} className="text-primary hover:text-blue-700 font-medium">Add a user</button> to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.userId}
                  className="bg-white border border-gray-300 rounded-lg p-6 flex items-center justify-between hover:shadow-sm transition-shadow"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {user.role && (
                      <span className="px-3 py-1 bg-blue-100 text-primary text-sm font-medium rounded">
                        {user.role}
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(user.userId)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
