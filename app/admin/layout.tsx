'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Users, Shield, LogOut, Settings } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/check-admin')
      if (response.ok) {
        setIsAdmin(true)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const navigation = [
    { name: 'จัดการผู้ใช้', href: '/admin/users', icon: Users },
    { name: 'ตั้งค่าระบบ', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-red-600 border-b border-red-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left Section: Logo & Links */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Admin Panel
                </span>
              </div>

              {/* Desktop Menu */}
              <div className="hidden sm:flex sm:space-x-1 sm:ml-4">
                {navigation.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                        ${isActive
                          ? 'bg-red-700 text-white'
                          : 'text-red-100 hover:bg-red-700 hover:text-white'
                        }
                      `}
                    >
                      <item.icon className={`w-4 h-4`} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right Section: User Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-700 border border-red-500">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs font-medium text-red-100">Admin Mode</span>
              </div>

              <div className="h-6 w-px bg-red-500 hidden sm:block"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-100 hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                title="Log out"
              >
                <span className="hidden sm:inline">Logout</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>
    </div>
  )
}