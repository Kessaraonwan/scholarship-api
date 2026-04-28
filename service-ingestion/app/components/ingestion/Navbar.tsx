export default function Navbar() {
  return (
    <nav className="h-14 border-b border-slate-200 bg-white px-4 md:px-8">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-700">
            <svg width="16" height="16" fill="none" stroke="#E6F1FB" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-900">Scholarship API</span>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {['Docs', 'ค้นหาทุน', 'Status', 'Support'].map((link) => (
            <span key={link} className="cursor-pointer text-sm text-slate-600 hover:text-slate-900">
              {link}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3001/login"
            className="text-sm text-slate-600 transition hover:text-slate-900"
          >
            เข้าสู่ระบบ
          </a>
          <a
            href="http://localhost:3001/register"
            className="rounded-md bg-blue-700 px-4 py-2 text-xs font-medium text-blue-50 transition hover:bg-blue-800"
          >
            เริ่มใช้งานฟรี
          </a>
        </div>
      </div>
    </nav>
  )
}