'use client'

import { useMemo, useState } from 'react'

type MatchItem = {
  scholarship: {
    id: string
    name: string
    level: string
    field: string
    country: string
    deadline: string | null
  }
  score: number
}

export default function MatchPage() {
  const [apiKey, setApiKey] = useState('')
  const [level, setLevel] = useState('')
  const [fields, setFields] = useState('IT')
  const [countries, setCountries] = useState('Japan')
  const [results, setResults] = useState<MatchItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fieldArray = useMemo(() => fields.split(',').map((v) => v.trim()).filter(Boolean), [fields])
  const countryArray = useMemo(() => countries.split(',').map((v) => v.trim()).filter(Boolean), [countries])

  async function runMatch() {
    if (!apiKey) {
      setError('กรุณาใส่ API key')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          level: level || undefined,
          fields: fieldArray,
          countries: countryArray,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'ไม่สามารถจับคู่ทุนได้')
      setResults(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold">Match Scholarships</h1>
      <p className="mb-6 text-slate-600">ใช้ API จริงจาก `/api/match` (ต้องเป็น Pro tier)</p>

      <div className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">API Key</label>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={apiKey}
            onChange={(e) => {
              const value = e.target.value
              setApiKey(value)
              localStorage.setItem('user_api_key', value)
            }}
            placeholder="sk_live_xxx"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">ระดับการศึกษา</label>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="เช่น ปริญญาโท" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">สาขา (คั่นด้วย comma)</label>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={fields} onChange={(e) => setFields(e.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">ประเทศ (คั่นด้วย comma)</label>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={countries} onChange={(e) => setCountries(e.target.value)} />
        </div>
        <div className="flex items-end">
          <button
            onClick={runMatch}
            disabled={isLoading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isLoading ? 'กำลังจับคู่...' : 'Run Match'}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4">
        {results.map((item) => (
          <div key={item.scholarship.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-1 flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-slate-900">{item.scholarship.name}</h3>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">{item.score}% match</span>
            </div>
            <p className="text-sm text-slate-600">
              {item.scholarship.level} · {item.scholarship.field} · {item.scholarship.country}
            </p>
            {item.scholarship.deadline && <p className="mt-1 text-xs text-slate-500">Deadline: {new Date(item.scholarship.deadline).toLocaleDateString('th-TH')}</p>}
          </div>
        ))}
        {!isLoading && results.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">ยังไม่มีผลลัพธ์ ลองใส่เงื่อนไขแล้วกด Run Match</div>}
      </div>
    </div>
  )
}