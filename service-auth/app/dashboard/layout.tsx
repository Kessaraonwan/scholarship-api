'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Key, BarChart3, LogOut, Shield } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    router.push('/')
  }

  // สร้าง Array ของเมนูเพื่อให้จัดการง่ายขึ้น
  const navigation = [
    { name: 'API Keys', href: '/dashboard/keys', icon: Key },
    { name: 'Usage Stats', href: '/dashboard/usage', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Left Section: Logo & Links */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
                  Scholarship API
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
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }
                      `}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right Section: User Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-slate-600">System Operational</span>
              </div>
              
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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