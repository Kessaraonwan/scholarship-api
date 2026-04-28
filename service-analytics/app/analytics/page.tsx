'use client'

import { useEffect, useMemo, useState } from 'react'

type OverviewPayload = {
  data: {
    totals: { scholarships: number; upcoming30Days: number }
    breakdown: {
      byCountry: Record<string, number>
      byField: Record<string, number>
      byLevel: Record<string, number>
    }
  }
}

export default function AnalyticsPage() {
  const [apiKey, setApiKey] = useState('')
  const [payload, setPayload] = useState<OverviewPayload | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('user_api_key') || ''
    setApiKey(saved)
  }, [])

  useEffect(() => {
    async function load() {
      if (!apiKey) return
      setIsLoading(true)
      setError('')
      try {
        const response = await fetch('/api/analytics/overview', {
          headers: { 'x-api-key': apiKey },
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'โหลด analytics ไม่สำเร็จ')
        setPayload(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [apiKey])

  const topCountries = useMemo(() => {
    const entries = Object.entries(payload?.data?.breakdown?.byCountry || {})
    return entries.sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [payload])

  const topFields = useMemo(() => {
    const entries = Object.entries(payload?.data?.breakdown?.byField || {})
    return entries.sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [payload])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold">Analytics Overview</h1>
      <p className="mb-6 text-slate-600">ดึงข้อมูลจริงจาก service-core ผ่าน service-analytics</p>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">API Key (Pro)</label>
        <input
          value={apiKey}
          onChange={(e) => {
            const value = e.target.value
            setApiKey(value)
            localStorage.setItem('user_api_key', value)
          }}
          placeholder="sk_live_xxx"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring"
        />
      </div>

      {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {isLoading && <p className="text-sm text-slate-600">กำลังโหลดข้อมูล...</p>}

      {payload && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Scholarships ทั้งหมด</p>
              <p className="text-3xl font-bold text-indigo-600">{payload.data.totals.scholarships.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">ใกล้หมดเขตใน 30 วัน</p>
              <p className="text-3xl font-bold text-emerald-600">{payload.data.totals.upcoming30Days.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-lg font-semibold">Top Countries</h2>
              <ul className="space-y-2 text-sm">
                {topCountries.map(([name, value]) => (
                  <li key={name} className="flex items-center justify-between rounded bg-slate-50 px-3 py-2">
                    <span>{name}</span>
                    <span className="font-semibold">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-lg font-semibold">Top Fields</h2>
              <ul className="space-y-2 text-sm">
                {topFields.map(([name, value]) => (
                  <li key={name} className="flex items-center justify-between rounded bg-slate-50 px-3 py-2">
                    <span>{name}</span>
                    <span className="font-semibold">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}