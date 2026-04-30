'use client'
import { useEffect, useState } from 'react'

export default function WebhooksPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <iframe
      src="http://localhost:3005/dashboard/webhooks?embed=true"
      className="w-full border-0"
      style={{ height: 'calc(100vh - 3.5rem)' }}
    />
  )
}