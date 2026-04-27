'use client'
import { useEffect, useState } from 'react'

interface AutoRefreshProps {
    onRefresh: () => void
    interval?: number
}

export default function AutoRefresh({ onRefresh, interval = 30 }: AutoRefreshProps) {
    const [enabled, setEnabled] = useState(true)
    const [secs, setSecs] = useState(interval)

    useEffect(() => {
        if (!enabled) return
        const t = setInterval(() => {
            setSecs(s => {
                if (s <= 1) { onRefresh(); return interval }
                return s - 1
            })
        }, 1000)
        return () => clearInterval(t)
    }, [enabled, interval, onRefresh])

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#fff', border: '0.5px solid #e5e7eb',
            borderRadius: 8, padding: '10px 16px', marginBottom: '1.5rem',
            fontSize: 13, color: '#6b7280'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" fill="none" stroke="#378ADD" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                <span>
                    {enabled ? `Auto-refresh in ${secs} seconds` : 'Auto-refresh disabled'}
                </span>
            </div>
            <button onClick={() => { setEnabled(e => !e); setSecs(interval) }}
                style={{ fontSize: 13, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>
                {enabled ? 'Disable' : 'Enable'}
            </button>
        </div>
    )
}