'use client'
import { useEffect, useState, useCallback } from 'react'
import Navbar from '../../components/ingestion/Navbar'
import StatCards from '../../components/ingestion/StatCards'
import AutoRefresh from '../../components/ingestion/AutoRefresh'
import LogTable from '../../components/ingestion/LogTable'

const AUTH = 'Bearer sk_ozaxkamfl6rmoe3l28y'

export default function IngestionPage() {
    const [logs, setLogs] = useState<any[]>([])
    const [latest, setLatest] = useState<any>(null)
    const [syncing, setSyncing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    // 🔒 1. เพิ่ม State สำหรับรหัส Admin
    const [adminPass, setAdminPass] = useState("");
    const MASTER_KEY = "123456"; // แบงค์เปลี่ยนรหัสตรงนี้ได้เลย

    const fetchData = useCallback(async () => {
        try {
            const [statusRes, logsRes] = await Promise.all([
                fetch('/api/admin/ingestion', { headers: { authorization: AUTH } }),
                fetch('/api/admin/ingestion/logs', { headers: { authorization: AUTH } }),
            ])
            const statusData = await statusRes.json()
            const logsData = await logsRes.json()
            setLatest(statusData.data ?? null)
            setLogs(logsData.data ?? [])
        } catch {
            setError('โหลดข้อมูลไม่สำเร็จ')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchData() }, [fetchData])

    const doSync = async () => {
        // เช็คอีกรอบเพื่อความชัวร์ในฟังก์ชัน
        if (adminPass !== MASTER_KEY) return;
        
        setSyncing(true)
        try {
            await fetch('/api/admin/ingestion/sync', { method: 'POST', headers: { authorization: AUTH } })
            await fetchData()
        } finally {
            setSyncing(false)
        }
    }

    const fmt = (iso: string) =>
        new Date(iso).toLocaleString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

    if (loading) return <><Navbar /><p style={{ padding: '2rem', color: '#6b7280' }}>กำลังโหลด...</p></>
    if (error) return <><Navbar /><p style={{ padding: '2rem', color: '#991b1b' }}>{error}</p></>

    return (
        <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 500, color: '#111', display: 'flex', alignItems: 'center', gap: 10 }}>
                            Admin — Data Ingestion
                            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#fee2e2', color: '#991b1b', fontWeight: 500 }}>
                                Admin Only
                            </span>
                        </h1>
                        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>จัดการการนำเข้าข้อมูลทุนการศึกษาจากแหล่งต่างๆ</p>
                    </div>

                    {/* 🔒 2. เพิ่มช่องกรอกรหัสลับ Admin ตรงนี้ */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input 
                            type="password"
                            placeholder="Admin Pin..."
                            value={adminPass}
                            onChange={(e) => setAdminPass(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: 8,
                                border: adminPass === MASTER_KEY ? '2px solid #059669' : '1px solid #d1d5db',
                                fontSize: 13,
                                width: 120,
                                outline: 'none'
                            }}
                        />
                        
                        <button 
                            onClick={doSync} 
                            disabled={syncing || adminPass !== MASTER_KEY} 
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                fontSize: 14, fontWeight: 500, padding: '10px 20px',
                                borderRadius: 8, border: 'none', 
                                background: adminPass === MASTER_KEY ? '#059669' : '#9ca3af',
                                color: '#fff', 
                                cursor: (syncing || adminPass !== MASTER_KEY) ? 'not-allowed' : 'pointer', 
                                transition: 'all 0.2s'
                            }}
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M23 4v6h-6M1 20v-6h6" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            {syncing ? 'Syncing...' : (adminPass === MASTER_KEY ? 'Sync Now' : 'Locked')}
                        </button>
                    </div>
                </div>

                <StatCards
                    lastSync={latest?.startedAt ? fmt(latest.startedAt) : null}
                    totalRecords={logs.reduce((sum, l) => sum + (l.countNew || 0), 0)}
                    newToday={latest?.countNew   ?? 0}
                />

                <AutoRefresh onRefresh={fetchData} interval={30} />

                <LogTable logs={logs} />
            </div>
        </div>
    )
}