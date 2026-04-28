'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

      setKeys(data.apiKeys)
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newKeyName.trim() }),
    })

    if (response.status === 401) {
      router.push('/login')
      return
    }

    const result = await response.json() // เปลี่ยนชื่อตัวแปรเป็น result จะได้ไม่สับสนกับ data ข้างใน
    if (!response.ok) throw new Error(result.error || 'สร้างไม่สำเร็จ')

    // ✅ แก้จาก data.apiKey เป็น result.data ให้ตรงกับ Backend
    if (result && result.data) {
      setKeys([...keys, result.data])
      setNewKeyName('')
    } else {
      // ถ้าโครงสร้างมาแปลกๆ ให้โหลดใหม่ทั้งหมดเพื่อความชัวร์
      fetchKeys()
    }
  } catch (error) {
    console.error('Error creating key:', error)
    setError(error instanceof Error ? error.message : 'ไม่สามารถสร้าง API key ได้')
  } finally {
    setIsCreating(false)
  }
}

  const deleteKey = async (id: string) => {
    if (!confirm('คุณต้องการลบ API key นี้หรือไม่?')) return

    try {
      const response = await fetch(`/api/keys?id=${id}`, {
        method: 'DELETE',
      })

      if (response.status === 401) {
        router.push('/login')
        return
      }

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setKeys(keys.filter(key => key.id !== id))
    } catch (error) {
      console.error('Error deleting key:', error)
      setError(error instanceof Error ? error.message : 'ไม่สามารถลบ API key ได้')
    }
  }

  const copyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      // TODO: Show success message
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">จัดการ API Keys</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="ชื่อ API Key ใหม่"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onKeyPress={(e) => e.key === 'Enter' && createKey()}
          />
          <button
            onClick={createKey}
            disabled={isCreating || !newKeyName.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'กำลังสร้าง...' : 'สร้าง Key'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {keys.map((key) => (
            <li key={key.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">{key.name}</p>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      key.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {key.isActive ? 'ใช้งานได้' : 'ปิดใช้งาน'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    สร้างเมื่อ: {new Date(key.createdAt).toLocaleDateString('th-TH')}
                    {key.lastUsedAt && ` • ใช้ล่าสุด: ${new Date(key.lastUsedAt).toLocaleDateString('th-TH')}`}
                  </p>
                  <p className="text-xs text-gray-400 font-mono mt-1 break-all">{key.key}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(key.key)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm px-3 py-1 rounded hover:bg-indigo-50"
                  >
                    คัดลอก
                  </button>
                  <button
                    onClick={() => deleteKey(key.id)}
                    className="text-red-600 hover:text-red-900 text-sm px-3 py-1 rounded hover:bg-red-50"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {keys.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">ยังไม่มี API Keys สร้าง Key แรกของคุณเลย!</p>
          </div>
        )}
      </div>
    </div>
  )
}
