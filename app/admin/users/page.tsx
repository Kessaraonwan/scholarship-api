'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Shield, ShieldCheck, Ban, CheckCircle } from 'lucide-react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
  _count: {
    apiKeys: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.status === 403) {
        router.push('/dashboard')
        return
      }

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setUsers(data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.status === 403) {
        router.push('/dashboard')
        return
      }

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      // อัปเดตข้อมูลใน state
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, isActive: !currentStatus }
          : user
      ))
    } catch (error) {
      console.error('Error toggling user status:', error)
      setError('ไม่สามารถเปลี่ยนสถานะผู้ใช้ได้')
    }
  }

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'

    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.status === 403) {
        router.push('/dashboard')
        return
      }

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      // อัปเดตข้อมูลใน state
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, role: newRole }
          : user
      ))
    } catch (error) {
      console.error('Error toggling user role:', error)
      setError('ไม่สามารถเปลี่ยนบทบาทผู้ใช้ได้')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">จัดการผู้ใช้</h1>
        <div className="text-sm text-gray-500">
          ทั้งหมด {users.length} ผู้ใช้
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {user.role === 'admin' ? (
                        <ShieldCheck className="h-8 w-8 text-red-600" />
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        {user.role === 'admin' && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </span>
                        )}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <Ban className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        สร้างเมื่อ: {new Date(user.createdAt).toLocaleDateString('th-TH')}
                        • API Keys: {user._count.apiKeys} ตัว
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleUserRole(user.id, user.role)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      user.role === 'admin'
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {user.role === 'admin' ? 'ลดสิทธิ์ Admin' : 'เพิ่มสิทธิ์ Admin'}
                  </button>
                  <button
                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      user.isActive
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {user.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">ยังไม่มีผู้ใช้ในระบบ</p>
          </div>
        )}
      </div>
    </div>
  )
}