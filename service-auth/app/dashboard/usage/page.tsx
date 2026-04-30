'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart3, Clock, Calendar, AlertCircle, Activity } from 'lucide-react'

interface UsageStats {
  totalRequests: number
  requestsToday: number
  requestsThisMonth: number
  errorRate: number
  topEndpoints: Array<{
    endpoint: string
    count: number
  }>
}

export default function UsagePage() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats/usage')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      // ถ้า API พัง ให้ใช้ค่าเริ่มต้นป้องกันหน้าขาว
      setStats({
        totalRequests: 0,
        requestsToday: 0,
        requestsThisMonth: 0,
        errorRate: 0,
        topEndpoints: []
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 animate-pulse">กำลังดึงข้อมูลสถิติ...</p>
      </div>
    )
  }

  const statCards = [
    { label: 'คำขอทั้งหมด', value: stats?.totalRequests.toLocaleString(), icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'วันนี้', value: stats?.requestsToday.toLocaleString(), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'เดือนนี้', value: stats?.requestsThisMonth.toLocaleString(), icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'อัตรา Error', value: `${stats?.errorRate}%`, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">สถิติการใช้งาน API</h1>
        <p className="text-slate-500">ข้อมูลสรุปการเรียกใช้งานจากทุกช่องทาง</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Endpoints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Endpoint ที่ใช้มากที่สุด</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {stats?.topEndpoints.length === 0 ? (
            <div className="p-10 text-center text-slate-400">ยังไม่มีข้อมูลการใช้งาน</div>
          ) : (
            stats?.topEndpoints.map((endpoint, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block">
                    {endpoint.endpoint}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">{endpoint.count.toLocaleString()}</span>
                  <span className="text-xs text-slate-400">ครั้ง</span>
                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden ml-4">
                    <div 
                      className="bg-indigo-500 h-full rounded-full" 
                      style={{ width: `${(endpoint.count / (stats?.totalRequests || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}