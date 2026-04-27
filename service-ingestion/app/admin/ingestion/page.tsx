'use client'

import { useEffect, useState } from 'react'

type LogStatus = 'success' | 'error' | 'running'

interface IngestionLog {
    id: string
    source: string
    status: LogStatus
    count_new: number
    error_msg: string | null
    started_at: string
    finished_at: string | null
}

export default function IngestionPage() {
    const [logs, setLogs] = useState<IngestionLog[]>([])
    const [latest, setLatest] = useState<IngestionLog | null>(null)
    const [syncing, setSyncing] = useState(false)
    const [message, setMessage] = useState('กด sync เพื่อดึงข้อมูลทุนใหม่')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            const [statusRes, logsRes] = await Promise.all([
                fetch('/api/admin/ingestion', {
                    headers: { authorization: 'Bearer sk_ozaxkamfl6rmoe3l28y' }
                }),
                fetch('/api/admin/ingestion/logs', {
                    headers: { authorization: 'Bearer sk_ozaxkamfl6rmoe3l28y' }
                }),
            ])
            const statusData = await statusRes.json()
            const logsData = await logsRes.json()
            setLatest(statusData.data ?? null)
            setLogs(logsData.data ?? [])
        } catch (e) {
            setError('โหลดข้อมูลไม่สำเร็จ')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const doSync = async () => {
        setSyncing(true)
        setMessage('กำลังดึงข้อมูลทุน...')
        try {
            const res = await fetch('/api/admin/ingestion/sync', {
                method: 'POST',
                headers: { authorization: 'Bearer sk_ozaxkamfl6rmoe3l28y' }
            })
            const data = await res.json()

            if (res.ok) {
                setMessage(`sync สำเร็จ — พบทุนใหม่ ${data.data.totalNew} รายการ`)
            } else {
                setMessage(`sync ไม่สำเร็จ: ${data.error || 'Unknown error'}`)
            }

            fetchData()
        } catch (e) {
            setMessage('sync ไม่สำเร็จ: Network error')
        } finally {
            setSyncing(false)
        }
    }

    const fmt = (iso: string) =>
        new Date(iso).toLocaleString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

    const badgeStyle: Record<LogStatus, { background: string; color: string; border: string }> = {
        success: { background: '#042C53', color: '#85B7EB', border: '0.5px solid #185FA5' },
        error: { background: '#1f0a0a', color: '#F09595', border: '0.5px solid #A32D2D' },
        running: { background: '#1a1200', color: '#EF9F27', border: '0.5px solid #854F0B' },
    }

    const s = {
        dash: { background: '#0a0f1e', minHeight: '100vh', padding: '2rem', fontFamily: "ui-monospace,'SF Mono',monospace", color: '#e2e8f0' },
        topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '0.5px solid #1e3a5f' },
        logo: { fontSize: 11, letterSpacing: 3, color: '#378ADD', fontWeight: 500 },
        pill: { display: 'flex', alignItems: 'center', fontSize: 11, color: '#85B7EB', background: '#0c1e35', border: '0.5px solid #185FA5', borderRadius: 20, padding: '4px 12px', letterSpacing: 1 },
        dot: (active: boolean, color?: string) => ({ width: 8, height: 8, borderRadius: '50%', background: active ? (color || '#378ADD') : '#1a3a5c', display: 'inline-block', marginRight: 6 }),
        cards: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: '1.5rem' },
        card: { background: '#0c1929', border: '0.5px solid #1e3a5f', borderRadius: 10, padding: '1.25rem' },
        cardLabel: { fontSize: 10, letterSpacing: 2, color: '#378ADD', marginBottom: 8 },
        cardValue: { fontSize: 24, fontWeight: 500, color: '#e2e8f0' },
        cardSub: { fontSize: 11, color: '#4a7fa5', marginTop: 4 },
        panel: { background: '#0c1929', border: '0.5px solid #1e3a5f', borderRadius: 10, padding: '1.25rem', marginBottom: '1.25rem' },
        panelHdr: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
        panelTitle: { fontSize: 11, letterSpacing: 2, color: '#85B7EB' },
        btn: { fontSize: 11, letterSpacing: 1, padding: '7px 18px', borderRadius: 6, border: '0.5px solid #185FA5', background: '#0c1e35', color: '#85B7EB', cursor: 'pointer' },
        msg: { fontSize: 12, color: '#4a7fa5', marginTop: 4 },
        logHead: { display: 'grid', gridTemplateColumns: '1fr 90px 60px 130px', gap: 8, fontSize: 10, letterSpacing: 1.5, color: '#2d5a8a', paddingBottom: 8 },
        logRow: { display: 'grid', gridTemplateColumns: '1fr 90px 60px 130px', gap: 8, padding: '10px 0', borderTop: '0.5px solid #111e30', fontSize: 12, alignItems: 'center' },
        badge: (status: LogStatus) => ({ fontSize: 10, padding: '3px 8px', borderRadius: 4, letterSpacing: 1, display: 'inline-block', ...badgeStyle[status] }),
        empty: { textAlign: 'center' as const, padding: '2rem', fontSize: 12, color: '#2d5a8a', letterSpacing: 1 },
    }

    if (loading) return (
        <div style={s.dash}>
            <p style={{ color: '#2d5a8a', fontSize: 12, letterSpacing: 2 }}>LOADING...</p>
        </div>
    )

    if (error) return (
        <div style={s.dash}>
            <p style={{ color: '#F09595', fontSize: 12 }}>{error}</p>
        </div>
    )

    return (
        <div style={s.dash}>
            <div style={s.topbar}>
                <span style={s.logo}>INGESTION DASHBOARD</span>
                <span style={s.pill}>
                    <span style={s.dot(true, syncing ? '#EF9F27' : '#378ADD')} />
                    {syncing ? 'RUNNING' : 'SYSTEM IDLE'}
                </span>
            </div>

            <div style={s.cards}>
                {[
                    { label: 'LAST SYNC', value: latest?.started_at ? fmt(latest.started_at) : '—', sub: 'ครั้งล่าสุด' },
                    { label: 'NEW SCHOLARSHIPS', value: latest?.count_new ?? '—', sub: 'ครั้งล่าสุด' },
                    { label: 'TOTAL SYNCS', value: logs.length, sub: 'ทั้งหมด' },
                ].map((c) => (
                    <div key={c.label} style={s.card}>
                        <div style={s.cardLabel}>{c.label}</div>
                        <div style={s.cardValue}>{String(c.value)}</div>
                        <div style={s.cardSub}>{c.sub}</div>
                    </div>
                ))}
            </div>

            <div style={s.panel}>
                <div style={s.panelHdr}>
                    <span style={s.panelTitle}>SYNC CONTROL</span>
                    <button style={s.btn} onClick={doSync} disabled={syncing}>
                        {syncing ? 'SYNCING...' : 'RUN SYNC'}
                    </button>
                </div>
                <div style={s.msg}>{message}</div>
            </div>

            <div style={s.panel}>
                <div style={s.panelHdr}>
                    <span style={s.panelTitle}>SYNC LOGS</span>
                </div>
                <div style={s.logHead}>
                    <span>SOURCE</span><span>STATUS</span><span>NEW</span><span>TIMESTAMP</span>
                </div>
                {logs.length === 0 ? (
                    <div style={s.empty}>NO LOGS FOUND</div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} style={s.logRow}>
                            <span style={{ color: '#B5D4F4' }}>{log.source}</span>
                            <span><span style={s.badge(log.status)}>{log.status.toUpperCase()}</span></span>
                            <span style={{ color: '#378ADD' }}>{log.count_new}</span>
                            <span style={{ color: '#2d5a8a', fontSize: 11 }}>{fmt(log.started_at)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}