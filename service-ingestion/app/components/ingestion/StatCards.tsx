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
            iconColor: '#185FA5',
            bgColor: '#E6F1FB',
            icon: (
                <svg width="20" height="20" fill="none" stroke="#185FA5" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
            )
        },
        {
            label: 'Total Records',
            value: `${totalRecords} ทุน`,
            iconColor: '#185FA5',
            bgColor: '#E6F1FB',
            icon: (
                <svg width="20" height="20" fill="none" stroke="#185FA5" strokeWidth="1.5" viewBox="0 0 24 24">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
            )
        },
        {
            label: 'New Today',
            value: newToday > 0 ? `+${newToday} records` : '—',
            iconColor: '#3B6D11',
            bgColor: '#EAF3DE',
            icon: (
                <svg width="20" height="20" fill="none" stroke="#3B6D11" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            )
        },
    ]

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: '1.5rem' }}>
            {cards.map(c => (
                <div key={c.label} style={{
                    background: '#fff', border: '0.5px solid #e5e7eb',
                    borderRadius: 12, padding: '1rem',
                    display: 'flex', alignItems: 'center', gap: 12
                }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 8,
                        background: c.bgColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        {c.icon}
                    </div>
                    <div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 500, color: '#111' }}>{c.value}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}