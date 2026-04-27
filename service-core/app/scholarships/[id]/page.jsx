'use client'
import { useState, useEffect } from 'react'

export default function ScholarshipDetailPage({ params }) {
  const [scholarship, setScholarship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/api/scholarships/${params.id}`)
      .then(res => res.json())
      .then(json => {
        if (json.error) setError(json.error)
        else setScholarship(json.data)
      })
      .catch(() => setError('โหลดข้อมูลไม่สำเร็จ'))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <p>⏳ กำลังโหลด...</p>
  if (error)   return <p>❌ {error}</p>
  if (!scholarship) return <p>ไม่พบทุนนี้</p>

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      <a href="/scholarships">← กลับ</a>
      <h1>{scholarship.name}</h1>
      <p>🎓 ระดับ: {scholarship.level}</p>
      <p>📚 สาขา: {scholarship.field}</p>
      <p>🌍 ประเทศ: {scholarship.country}</p>
      <p>📅 ปิดรับ: {scholarship.deadline}</p>
      {scholarship.amount && <p>💰 {scholarship.amount} {scholarship.currency}</p>}
      {scholarship.description && <p>📝 {scholarship.description}</p>}
      <a href={scholarship.url} target="_blank">
        <button>🔗 สมัครเลย</button>
      </a>
    </div>
  )
}