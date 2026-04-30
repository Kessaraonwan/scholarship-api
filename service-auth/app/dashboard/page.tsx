'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Key, BookOpen, Bell, BarChart3, CreditCard, Zap, ArrowRight, Clock } from 'lucide-react'

export default function DashboardHome() {
  const [userTier, setUserTier] = useState<string | null>(null)
  const [closingSoonCount, setClosingSoonCount] = useState(0)

  useEffect(() => {
    try {
      setUserTier(localStorage.getItem('userTier') || 'free')
    } catch (e) {
      // ignore SSR
    }
    
    // Fetch closing soon count
    const fetchClosingSoon = async () => {
      try {
        const res = await fetch('http://localhost:3004/api/analytics/overview')
        if (res.ok) {
          const data = await res.json()
          setClosingSoonCount(data.closingSoon || 0)
        }
      } catch (e) {
        // ignore fetch errors
      }
    }
    fetchClosingSoon()
  }, [])

  const quickStartItems = [
    {
      icon: Key,
      title: 'Create API Key',
      description: 'สร้างคีย์สำหรับใช้เรียก API',
      href: '/dashboard/keys',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: BookOpen,
      title: 'Search Scholarships',
      description: 'ค้นหาทุนการศึกษาทั่วโลก',
      href: 'http://localhost:3003/scholarships',
      external: true,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Bell,
      title: 'Setup Webhooks',
      description: 'ตั้งค่าแจ้งเตือนทุนใหม่ (Pro)',
      href: '/dashboard/webhooks',
      locked: userTier !== 'pro',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: BarChart3,
      title: 'View Analytics',
      description: 'วิเคราะห์แนวโน้มทุน (Pro)',
      href: '/dashboard/analytics',
      locked: userTier !== 'pro',
      color: 'bg-emerald-50 text-emerald-600',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header with Tier Status */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Welcome Back</h1>
        <p className="text-slate-600 text-lg mb-6">Start exploring the Scholarship API</p>
        
        {/* Tier Status Card */}
        <div className={`p-6 rounded-xl border-2 flex items-center justify-between ${
          userTier === 'pro' 
            ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' 
            : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${userTier === 'pro' ? 'bg-amber-100' : 'bg-indigo-100'}`}>
              <Zap className={`w-6 h-6 ${userTier === 'pro' ? 'text-amber-600' : 'text-indigo-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Subscription Status</p>
              <p className={`text-2xl font-bold ${userTier === 'pro' ? 'text-amber-700' : 'text-indigo-700'}`}>
                {userTier === 'pro' ? 'Pro Plan' : 'Free Plan'}
              </p>
            </div>
          </div>
          
          <Link href="/dashboard/billing">
            <button className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              userTier === 'pro' 
                ? 'bg-amber-200 text-amber-900 hover:bg-amber-300' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}>
              {userTier === 'pro' ? 'Manage Subscription' : 'Upgrade to Pro'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* Closing Soon Widget */}
      <div className="mb-12">
        <Link href="/dashboard/closing-soon">
          <div className="p-6 rounded-xl border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-rose-100">
                  <Clock className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">ทุนใกล้หมดเขต</p>
                  <p className="text-3xl font-bold text-rose-700">{closingSoonCount}</p>
                  <p className="text-xs text-slate-600 mt-1">ทุนที่จะปิดรับสมัครในอีก 30 วัน</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-rose-600" />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Start Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Start</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickStartItems.map((item) => {
            const Icon = item.icon
            const isExternal = item.external
            const isLocked = item.locked
            
            const content = (
              <div className={`p-6 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all ${
                isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {isLocked && (
                    <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded">
                      Pro only
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{item.description}</p>
                <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                  {isLocked ? 'Upgrade required' : 'Open'}
                </span>
              </div>
            )

            if (isLocked) {
              return (
                <div key={item.title}>
                  {content}
                </div>
              )
            }

            if (isExternal) {
              return (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              )
            }

            return (
              <Link
                key={item.title}
                href={item.href}
              >
                {content}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-slate-900 text-white p-10 rounded-xl mb-12">
        <h2 className="text-2xl font-bold mb-6">Available Features</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Key, title: 'API Keys', desc: 'Create and manage' },
            { icon: BarChart3, title: 'Usage Stats', desc: 'Track usage' },
            { icon: BookOpen, title: 'Scholarships', desc: 'Search 10,000+ grants' },
            { icon: Bell, title: 'Webhooks', desc: 'Auto notifications (Pro)' },
          ].map((feature) => (
            <div key={feature.title} className="p-4">
              <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-sm mb-1">{feature.title}</p>
              <p className="text-xs text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/dashboard/keys">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-all">
            API Keys
          </button>
        </Link>
        <Link href="/dashboard/usage">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 font-medium transition-all">
            Usage Stats
          </button>
        </Link>
        <Link href="/dashboard/billing">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 font-medium transition-all">
            Billing
          </button>
        </Link>
      </div>
    </div>
  )
}
