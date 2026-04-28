export default function Navbar() {
    return (
        <nav style={{
            background: '#fff',
            borderBottom: '0.5px solid #e5e7eb',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                    width: 28, height: 28, background: '#185FA5',
                    borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <svg width="16" height="16" fill="none" stroke="#E6F1FB" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                </div>
                <span style={{ fontSize: 15, fontWeight: 500, color: '#111' }}>Scholarship API</span>
            </div>

            <div style={{ display: 'flex', gap: 24 }}>
                {['Docs', 'ค้นหาทุน', 'Status', 'Support'].map(link => (
                    <span key={link} style={{ fontSize: 14, color: '#6b7280', cursor: 'pointer' }}>{link}</span>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* 🔗 วาร์ปไปพอร์ตแบงค์ 3001 */}
                <a 
                    href="http://localhost:3001/login" 
                    style={{ fontSize: 14, color: '#6b7280', cursor: 'pointer', textDecoration: 'none' }}
                >
                    เข้าสู่ระบบ
                </a>
                
                <a 
                    href="http://localhost:3001/register" 
                    style={{ textDecoration: 'none' }}
                >
                    <button style={{
                        fontSize: 13, fontWeight: 500, padding: '7px 16px',
                        borderRadius: 8, background: '#185FA5', color: '#E6F1FB', border: 'none', cursor: 'pointer'
                    }}>
                        เริ่มใช้งานฟรี
                    </button>
                </a>
            </div>
        </nav>
    )
}