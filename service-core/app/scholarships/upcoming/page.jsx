'use client'
import { useState, useEffect } from 'react'

export default function UpcomingPage() {
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/scholarships/upcoming')
      .then(res => res.json())
      .then(json => setScholarships(json.data || []))  // ← เพิ่ม || []
      .catch(() => setError('โหลดข้อมูลไม่สำเร็จ'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>⏳ กำลังโหลด...</p>
  if (error)   return <p>❌ {error}</p>
  if (scholarships.length === 0) return <p>ไม่มีทุนใกล้ปิดรับตอนนี้</p>

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <a href="/scholarships">← กลับ</a>
      <h1>⏰ ทุนใกล้ปิดรับ (ภายใน 30 วัน)</h1>
      <div style={{ display: 'grid', gap: '16px' }}>
        {scholarships.map(s => (
          <a key={s.id} href={`/scholarships/${s.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '2px solid red', borderRadius: '8px', padding: '16px' }}>
              <h2 style={{ margin: '0 0 8px' }}>{s.name}</h2>
              <p style={{ margin: 0, color: '#666' }}>
                📅 {s.deadline} | 🌍 {s.country}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}