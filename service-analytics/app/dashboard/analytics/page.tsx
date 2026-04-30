'use client'
import { useEffect, useState } from 'react'

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <iframe
      src="http://localhost:3004/analytics?embed=true"
      className="w-full border-0"
      style={{ height: 'calc(100vh - 3.5rem)' }}
    />
  )
}