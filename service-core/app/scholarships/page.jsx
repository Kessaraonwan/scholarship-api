'use client'
import { useState, useEffect } from 'react'

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [field, setField] = useState('')
  const [level, setLevel] = useState('')
  const [country, setCountry] = useState('')

  useEffect(() => {
    fetchScholarships()
  }, [field, level, country])

  async function fetchScholarships() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (field)   params.set('field', field)
      if (level)   params.set('level', level)
      if (country) params.set('country', country)

      const res = await fetch(`/api/scholarships?${params}`)
      const json = await res.json()
      setScholarships(json.data)
    } catch (e) {
      setError('โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1>🎓 ค้นหาทุนการศึกษา</h1>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <select value={field} onChange={e => setField(e.target.value)}>
          <option value="">ทุกสาขา</option>
          <option value="IT">IT</option>
          <option value="ทุกสาขา">ทุกสาขา</option>
          <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
          <option value="วิศวกรรมศาสตร์">วิศวกรรมศาสตร์</option>
        </select>

        <select value={level} onChange={e => setLevel(e.target.value)}>
          <option value="">ทุกระดับ</option>
          <option value="ปริญญาตรี">ปริญญาตรี</option>
          <option value="ปริญญาโท">ปริญญาโท</option>
          <option value="ปริญญาเอก">ปริญญาเอก</option>
        </select>

        <select value={country} onChange={e => setCountry(e.target.value)}>
          <option value="">ทุกประเทศ</option>
          <option value="ไทย">ไทย</option>
          <option value="ญี่ปุ่น">ญี่ปุ่น</option>
          <option value="สหรัฐอเมริกา">สหรัฐอเมริกา</option>
        </select>
      </div>

      {loading && <p>⏳ กำลังโหลด...</p>}
      {error   && <p style={{ color: 'red' }}>❌ {error}</p>}
      {!loading && !error && scholarships.length === 0 && <p>ไม่พบทุนที่ตรงเงื่อนไข</p>}

      <div style={{ display: 'grid', gap: '16px' }}>
        {scholarships.map(s => (
          <a key={s.id} href={`/scholarships/${s.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}>
              <h2 style={{ margin: '0 0 8px' }}>{s.name}</h2>
              <p style={{ margin: 0, color: '#666' }}>
                🎓 {s.level} &nbsp;|&nbsp; 🌍 {s.country} &nbsp;|&nbsp; 📅 {s.deadline}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}