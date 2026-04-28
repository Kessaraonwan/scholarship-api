interface StatCardsProps {
    lastSync: string | null
    totalRecords: number
    newToday: number
}

export default function StatCards({ lastSync, totalRecords, newToday }: StatCardsProps) {
  const cards = [
    {
      label: 'Last Sync',
      value: lastSync || '—',
      iconBg: 'bg-blue-50',
      iconColor: '#1d4ed8',
      icon: (
        <svg width="20" height="20" fill="none" stroke="#1d4ed8" strokeWidth="1.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: 'Total Records',
      value: `${totalRecords} ทุน`,
      iconBg: 'bg-blue-50',
      iconColor: '#1d4ed8',
      icon: (
        <svg width="20" height="20" fill="none" stroke="#1d4ed8" strokeWidth="1.5" viewBox="0 0 24 24">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
    },
    {
      label: 'New Today',
      value: newToday > 0 ? `+${newToday} records` : '—',
      iconBg: 'bg-emerald-50',
      iconColor: '#166534',
      icon: (
        <svg width="20" height="20" fill="none" stroke="#166534" strokeWidth="1.5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${c.iconBg}`}>
            {c.icon}
          </div>
          <div>
            <div className="mb-1 text-xs text-slate-500">{c.label}</div>
            <div className="text-xl font-semibold text-slate-900">{c.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}