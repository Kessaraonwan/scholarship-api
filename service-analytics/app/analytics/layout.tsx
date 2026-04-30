'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const tabs = [
    { name: 'Analytics', href: '/analytics' },
    { name: 'Match ทุน', href: '/match' },
  ]

  return (
    <div className="container mx-auto p-6">
      {/* Tabs Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || 
                           (pathname === '/analytics' && tab.href === '/analytics') ||
                           (pathname === '/match' && tab.href === '/match')
            
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.name}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  )
}