'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, Webhook, CreditCard, Settings, Key, BarChart3, ArrowRight, Zap } from 'lucide-react'

export default function NotificationDashboard() {
  const [userTier, setUserTier] = useState<string | null>(null)

  useEffect(() => {
    try {
      setUserTier(localStorage.getItem('userTier') || 'free')
    } catch (e) {
      // ignore
    }
  }, [])

  const menuItems = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'View and manage notifications',
      href: '/dashboard/notifications',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: Webhook,
      title: 'Webhooks',
      description: 'Setup webhooks for events',
      href: '/dashboard/webhooks',
      locked: userTier !== 'pro',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Configure notification settings',
      href: '/dashboard/settings',
      color: 'bg-slate-50 text-slate-600',
    },
    {
      icon: CreditCard,
      title: 'Billing',
      description: 'Manage subscription and plan',
      href: '/dashboard/billing',
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Notification Hub</h1>
        <p className="text-slate-600 text-lg mb-8">Manage notifications, webhooks, and event tracking</p>

        {/* Tier Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
          userTier === 'pro' 
            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
        }`}>
          <Zap className="w-4 h-4" />
          {userTier === 'pro' ? 'Pro Plan - Webhooks Unlocked' : 'Free Plan - Webhooks Locked'}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid gap-4 sm:grid-cols-2 mb-12">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isLocked = item.locked

          const content = (
            <div className={`p-6 rounded-xl border-2 border-slate-200 transition-all ${
              isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300 hover:shadow-md cursor-pointer'
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
              <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
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

          return (
            <Link key={item.title} href={item.href}>
              {content}
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 text-white p-10 rounded-xl mb-12">
        <h2 className="text-2xl font-bold mb-2">Quick Setup</h2>
        <p className="text-slate-300 mb-8">3 steps to configure webhook notifications</p>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { step: '1', title: 'Create API Key', desc: 'Go to Dashboard and create a key' },
            { step: '2', title: 'Setup Webhook', desc: 'Add your endpoint URL for events' },
            { step: '3', title: 'Test & Deploy', desc: 'Test webhook and deploy to production' },
          ].map((item) => (
            <div key={item.step} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mb-2">
                {item.step}
              </div>
              <p className="text-sm font-bold text-slate-300 mb-1">Step {item.step}</p>
              <p className="font-semibold mb-1">{item.title}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to Upgrade */}
      {userTier !== 'pro' && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Unlock Webhooks & Advanced Features</h3>
              <p className="text-indigo-100">Upgrade to Pro to get webhooks, advanced analytics, and more</p>
            </div>
            <Link href="/dashboard/billing">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-bold transition-all whitespace-nowrap">
                Upgrade Now <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Navigation Shortcuts */}
      <div className="mt-12 border-t pt-8 grid gap-4 sm:grid-cols-2">
        <Link href="http://localhost:3001/dashboard/keys" target="_blank">
          <button className="w-full p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-left">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="font-semibold text-slate-900">Manage API Keys</p>
                <p className="text-sm text-slate-500">Auth Service</p>
              </div>
            </div>
          </button>
        </Link>
        <Link href="http://localhost:3003/scholarships" target="_blank">
          <button className="w-full p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-left">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-semibold text-slate-900">Search Scholarships</p>
                <p className="text-sm text-slate-500">Core Service</p>
              </div>
            </div>
          </button>
        </Link>
      </div>
    </div>
  )
}