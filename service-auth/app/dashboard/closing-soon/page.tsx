'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, ExternalLink, MapPin, Briefcase } from 'lucide-react'

interface Scholarship {
  id: string
  name: string
  organization?: string
  country?: string
  level?: string
  deadline: string
  url?: string
}

export default function ClosingSoonPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClosingSoon = async () => {
      try {
        setLoading(true)
        // Fetch from service-auth proxy (same origin)
        const res = await fetch('/api/closing-soon')

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`)
        }

        const data = await res.json()
        setScholarships(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load scholarships')
      } finally {
        setLoading(false)
      }
    }

    fetchClosingSoon()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getDaysLeft = (dateString: string) => {
    const deadline = new Date(dateString)
    const today = new Date()
    const diff = deadline.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-rose-100">
            <Clock className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">ทุนใกล้หมดเขต</h1>
            <p className="text-slate-600">ทุนการศึกษาที่จะปิดรับสมัครในอีก 30 วัน</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
          </div>
          <p className="text-slate-600 mt-4">กำลังโหลด...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">เกิดข้อผิดพลาด</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && scholarships.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">ไม่มีทุนที่จะปิดรับสมัครในอีก 30 วัน</p>
        </div>
      )}

      {/* Scholarships Grid */}
      {!loading && !error && scholarships.length > 0 && (
        <div className="grid gap-4">
          {scholarships.map((scholarship) => {
            const daysLeft = getDaysLeft(scholarship.deadline)
            const urgency = daysLeft <= 5 ? 'urgent' : daysLeft <= 15 ? 'warning' : 'normal'
            const urgencyColor =
              urgency === 'urgent'
                ? 'border-red-200 bg-red-50'
                : urgency === 'warning'
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-slate-200 bg-white'
            const badgeColor =
              urgency === 'urgent'
                ? 'bg-red-100 text-red-700'
                : urgency === 'warning'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-slate-100 text-slate-700'

            return (
              <div
                key={scholarship.id}
                className={`p-6 rounded-xl border-2 ${urgencyColor} hover:shadow-md transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{scholarship.name}</h3>
                    {scholarship.organization && (
                      <p className="text-sm text-slate-600 mb-3">{scholarship.organization}</p>
                    )}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded whitespace-nowrap ml-4 ${badgeColor}`}>
                    {daysLeft} วัน
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-600">
                  {scholarship.country && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{scholarship.country}</span>
                    </div>
                  )}
                  {scholarship.level && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{scholarship.level}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>ปิดรับ: {formatDate(scholarship.deadline)}</span>
                  </div>
                </div>

                {scholarship.url && (
                  <a
                    href={scholarship.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all text-sm font-medium"
                  >
                    ดูรายละเอียด
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Back Link */}
      <div className="mt-8 text-center">
        <Link href="/dashboard" className="text-rose-600 hover:text-rose-700 font-medium">
          ← กลับไปหน้า Dashboard
        </Link>
      </div>
    </div>
  )
}
