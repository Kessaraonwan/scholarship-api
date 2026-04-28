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
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-1 text-base font-semibold text-slate-900">Ingestion Logs</div>
      <div className="mb-4 text-sm text-slate-600">ประวัติการนำเข้าข้อมูลล่าสุด</div>

      <div className="grid grid-cols-[150px_1fr_110px_80px_1fr] gap-3 border-b border-slate-200 pb-2 text-xs text-slate-500">
        <span>Timestamp</span><span>Source</span><span>Status</span><span>Records</span><span>Message</span>
      </div>

      {logs.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-400">ยังไม่มี log</div>
      ) : logs.map((log) => (
        <div
          key={log.id}
          className="grid grid-cols-[150px_1fr_110px_80px_1fr] items-center gap-3 border-b border-slate-100 py-3 text-sm"
        >
          <span className="text-xs text-slate-500">{fmt(log.started_at)}</span>
          <span className="font-medium text-slate-900">{log.source}</span>
          <span>
            <span
              style={statusStyle[log.status]}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {log.status}
            </span>
          </span>
          <span className="text-slate-900">{log.count_new > 0 ? `+${log.count_new}` : '-'}</span>
          <span className="text-xs text-slate-500">{log.error_msg || `+${log.count_new} records`}</span>
        </div>
      ))}
    </div>
  )
}