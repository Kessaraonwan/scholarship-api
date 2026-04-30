'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Key, Plus, Trash2, Copy, LogOut, CheckCircle } from 'lucide-react' // เพิ่มไอคอนเพื่อความสวยงาม

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  isActive: boolean
  lastUsedAt?: string
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null) // สำหรับโชว์ว่าคัดลอกสำเร็จ
  const router = useRouter()

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      const response = await fetch('/api/keys')
      if (response.status === 401) {
        router.push('/login')
        return
      }
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setKeys(data.apiKeys || [])
    } catch (error) {
      console.error('Error fetching keys:', error)
      setError('ไม่สามารถโหลด API keys ได้')
    } finally {
      setIsLoading(false)
    }
  }

  const createKey = async () => {
    if (!newKeyName.trim()) return
    setIsCreating(true)
    setError('')

    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName.trim() }),
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'สร้างไม่สำเร็จ')

      if (result && result.data) {
        setNewKeyName('')
        // Refresh keys list to ensure createdAt is properly formatted
        fetchKeys()
      } else {
        fetchKeys()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'ไม่สามารถสร้าง API key ได้')
    } finally {
      setIsCreating(false)
    }
  }

  const deleteKey = async (id: string) => {
    if (!confirm('คุณต้องการลบ API key นี้หรือไม่?')) return
    try {
      const response = await fetch(`/api/keys?id=${id}`, { method: 'DELETE' })
      if (response.status === 401) {
        router.push('/login')
        return
      }
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }
      setKeys(keys.filter(key => key.id !== id))
    } catch (error) {
      setError('ไม่สามารถลบ API key ได้')
    }
  }

  const copyToClipboard = async (id: string, key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000) // หายไปหลังจาก 2 วินาที
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // ฟังก์ชัน Logout กลับไปหน้า 3000
  const handleLogout = () => {
    localStorage.clear()
    window.location.href = 'http://localhost:3000'
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Key className="text-indigo-600" /> จัดการ API Keys
          </h1>
          <p className="text-gray-500 mt-1">สร้างและจัดการกุญแจสำหรับการเข้าถึง API ของคุณ</p>
        </div>
      </div>

      {/* Create Key Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="ตั้งชื่อ API Key (เช่น Dev, Production)"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            onKeyPress={(e) => e.key === 'Enter' && createKey()}
          />
          <button
            onClick={createKey}
            disabled={isCreating || !newKeyName.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all font-semibold"
          >
            {isCreating ? 'กำลังสร้าง...' : <><Plus size={18} /> สร้าง Key</>}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3 flex items-center gap-1">⚠️ {error}</p>}
      </div>

      {/* Keys List Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {keys.map((key) => (
            <li key={key.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-semibold text-gray-900">{key.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      key.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {key.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex gap-4 mb-3">
                    <span>สร้างเมื่อ: {key.createdAt ? new Date(key.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</span>
                    {key.lastUsedAt && <span>ใช้งานล่าสุด: {new Date(key.lastUsedAt).toLocaleDateString('th-TH')}</span>}
                  </div>
                  <code className="block w-full p-3 bg-gray-900 text-indigo-300 rounded-lg text-xs font-mono break-all border border-gray-800">
                    {key.key}
                  </code>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => copyToClipboard(key.id, key.key)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      copiedId === key.id 
                      ? 'bg-green-500 text-white' 
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }`}
                  >
                    {copiedId === key.id ? <><CheckCircle size={16} /> คัดลอกแล้ว!</> : <><Copy size={16} /> คัดลอก</>}
                  </button>
                  <button
                    onClick={() => deleteKey(key.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                  >
                    <Trash2 size={16} /> ลบทิ้ง
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {keys.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-400">ยังไม่มี API Keys ในระบบ เริ่มสร้างใหม่ได้เลย!</p>
          </div>
        )}
      </div>
    </div>
  )
}