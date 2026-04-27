interface Log {
    id: string
    source: string
    status: 'success' | 'error' | 'running'
    count_new: number
    error_msg: string | null
    started_at: string
}

interface LogTableProps {
    logs: Log[]
}

const statusStyle = {
    success: { background: '#dcfce7', color: '#166534' },
    error: { background: '#fee2e2', color: '#991b1b' },
    running: { background: '#fef3c7', color: '#92400e' },
}

export default function LogTable({ logs }: LogTableProps) {
    const fmt = (iso: string) =>
        new Date(iso).toLocaleString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

    return (
        <div style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#111', marginBottom: 4 }}>Ingestion Logs</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: '1rem' }}>ประวัติการนำเข้าข้อมูลล่าสุด</div>

            <div style={{
                display: 'grid', gridTemplateColumns: '150px 1fr 110px 80px 1fr',
                gap: 12, fontSize: 12, color: '#6b7280',
                paddingBottom: 10, borderBottom: '0.5px solid #e5e7eb'
            }}>
                <span>Timestamp</span><span>Source</span><span>Status</span><span>Records</span><span>Message</span>
            </div>

            {logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: '#9ca3af', fontSize: 14 }}>
                    ยังไม่มี log
                </div>
            ) : logs.map(log => (
                <div key={log.id} style={{
                    display: 'grid', gridTemplateColumns: '150px 1fr 110px 80px 1fr',
                    gap: 12, padding: '12px 0',
                    borderBottom: '0.5px solid #f3f4f6',
                    fontSize: 13, alignItems: 'center'
                }}>
                    <span style={{ color: '#6b7280', fontSize: 12 }}>{fmt(log.started_at)}</span>
                    <span style={{ fontWeight: 500, color: '#111' }}>{log.source}</span>
                    <span>
                        <span style={{
                            fontSize: 11, padding: '3px 10px', borderRadius: 20,
                            display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 500,
                            ...statusStyle[log.status]
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                            {log.status}
                        </span>
                    </span>
                    <span style={{ color: '#111' }}>{log.count_new > 0 ? `+${log.count_new}` : '-'}</span>
                    <span style={{ color: '#6b7280', fontSize: 12 }}>{log.error_msg || `+${log.count_new} records`}</span>
                </div>
            ))}
        </div>
    )
}