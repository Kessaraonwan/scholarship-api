'use client'
import { useEffect, useState, useCallback } from 'react'
import Navbar from '../../components/ingestion/Navbar'
import StatCards from '../../components/ingestion/StatCards'
import AutoRefresh from '../../components/ingestion/AutoRefresh'
import LogTable from '../../components/ingestion/LogTable'

export default function IngestionPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [latest, setLatest] = useState<any>(null)
  const [syncing, setSyncing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [internalSecret, setInternalSecret] = useState("")

  const fetchData = useCallback(async () => {
    try {
      const [statusRes, logsRes] = await Promise.all([
        fetch('/api/admin/ingestion', { credentials: 'include' }),
        fetch('/api/admin/ingestion/logs', { credentials: 'include' }),
      ])
      if (statusRes.status === 403 || logsRes.status === 403) {
        throw new Error('ไม่มีสิทธิ์เข้าถึงหน้า Admin กรุณา login ด้วยบัญชี admin')
      }
      const statusData = await statusRes.json()
      const logsData = await logsRes.json()
      setLatest(statusData.data ?? null)
      setLogs(logsData.data ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const doSync = async () => {
    setSyncing(true)
    try {
      const headers: HeadersInit = {}
      if (internalSecret.trim()) {
        headers['X-Internal-Secret'] = internalSecret.trim()
      }
      const res = await fetch('/api/admin/ingestion/sync', {
        method: 'POST',
        headers,
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Sync failed' }))
        throw new Error(data.error || 'Sync failed')
      }
      await fetchData()
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
          <p className="text-sm text-slate-500">กำลังโหลด...</p>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-semibold text-slate-900">
              Admin - Data Ingestion
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                Admin Only
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-600">จัดการการนำเข้าข้อมูลทุนการศึกษาจากแหล่งต่างๆ</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <input
              type="password"
              placeholder="Internal Secret (optional)"
              value={internalSecret}
              onChange={(e) => setInternalSecret(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 sm:w-60"
            />

            <button
              onClick={doSync}
              disabled={syncing}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <StatCards
          lastSync={latest?.startedAt ? fmt(latest.startedAt) : null}
          totalRecords={logs.reduce((sum, l) => sum + (l.countNew || 0), 0)}
          newToday={latest?.countNew ?? 0}
        />

        <AutoRefresh onRefresh={fetchData} interval={30} />

        <LogTable logs={logs} />
      </div>
    </div>
  )
}