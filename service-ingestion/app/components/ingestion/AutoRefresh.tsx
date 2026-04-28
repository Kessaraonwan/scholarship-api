'use client'
import { useEffect, useState } from 'react'

interface AutoRefreshProps {
    onRefresh: () => void
    interval?: number
}

export default function AutoRefresh({ onRefresh, interval = 30 }: AutoRefreshProps) {
  const [enabled, setEnabled] = useState(true)
  const [secs, setSecs] = useState(interval)

  useEffect(() => {
    if (!enabled) return
    const t = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) {
          onRefresh()
          return interval
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [enabled, interval, onRefresh])

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <svg width="14" height="14" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M23 4v6h-6M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        <span>{enabled ? `Auto-refresh in ${secs} seconds` : 'Auto-refresh disabled'}</span>
      </div>
      <button
        onClick={() => {
          setEnabled((e) => !e)
          setSecs(interval)
        }}
        className="rounded px-2 py-1 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
      >
        {enabled ? 'Disable' : 'Enable'}
      </button>
    </div>
  )
}