import Link from 'next/link';

function IconBarChart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 16v-5" />
      <path d="M12 16V8" />
      <path d="M16 16v-3" />
    </svg>
  )
}

function IconTarget(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconRocket(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 4c3 1 6 4 6 8-4 0-7-1-8-2-1-1-2-4-2-8 4 0 7 1 8 2Z" />
      <path d="M8 10 4 14l2 4 4-4" />
      <path d="M14 4c-2 1-5 4-6 8" />
      <path d="M10 14 6 18" />
    </svg>
  )
}

function IconGraduationCap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m22 10-10-5-10 5 10 5 10-5Z" />
      <path d="M6 12v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" />
      <path d="M6 12v4" />
    </svg>
  )
}

function IconBell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

function IconKey(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="15" r="3" />
      <path d="M10.5 12.5 20 3" />
      <path d="M15 8l2 2" />
    </svg>
  )
}

export default function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">แดชบอร์ดสถิติทุนการศึกษา</h1>
          <a href="http://localhost:3000/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← กลับหน้าหลัก
          </a>
        </div>

        {/* Main Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link href="/analytics" className="block">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group">
              <h2 className="text-xl font-semibold mb-2 flex items-center group-hover:text-indigo-600">
                <IconBarChart className="mr-2 h-5 w-5" /> สถิติเชิงลึก
              </h2>
              <p className="text-gray-600 font-light leading-relaxed">
                วิเคราะห์แนวโน้มทุนการศึกษา ยอดการเข้าชม และข้อมูลสถิติที่สำคัญ
              </p>
            </div>
          </Link>

          <Link href="/match" className="block">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group">
              <h2 className="text-xl font-semibold mb-2 flex items-center group-hover:text-indigo-600">
                <IconTarget className="mr-2 h-5 w-5" /> ระบบจับคู่ทุน (Matching)
              </h2>
              <p className="text-gray-600 font-light leading-relaxed">
                คำนวณคะแนนความเหมาะสม (Matching Score) จากโปรไฟล์ส่วนตัวของคุณ
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Links to Other Services (The Microservice Bridge) */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-700 mb-6 flex items-center">
            <IconRocket className="mr-2 h-5 w-5" /> ทางลัดไปยังส่วนอื่นๆ ของระบบ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Link to Core API (Port 3003) */}
            <a 
              href="http://localhost:3003/api/scholarships" 
              className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-transparent hover:border-indigo-200 hover:bg-indigo-50 transition-all text-center"
            >
              <IconGraduationCap className="w-7 h-7 mb-2 text-slate-700" />
              <span className="text-sm font-semibold text-slate-800">ค้นหาทุนการศึกษา</span>
              <span className="text-xs text-slate-500 mt-1">ไปที่ Service 3 (อีฟ)</span>
            </a>

            {/* Link to Notifications (Port 3005) */}
            <a 
              href="http://localhost:3005/dashboard/notifications" 
              className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-transparent hover:border-indigo-200 hover:bg-indigo-50 transition-all text-center"
            >
              <IconBell className="w-7 h-7 mb-2 text-slate-700" />
              <span className="text-sm font-semibold text-slate-800">ตั้งค่าแจ้งเตือน</span>
              <span className="text-xs text-slate-500 mt-1">ไปที่ Service 5 (ปิ่น)</span>
            </a>

            {/* Link back to Auth/Dashboard (Port 3001) */}
            <a 
              href="http://localhost:3001/dashboard/keys" 
              className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-transparent hover:border-indigo-200 hover:bg-indigo-50 transition-all text-center"
            >
              <IconKey className="w-7 h-7 mb-2 text-slate-700" />
              <span className="text-sm font-semibold text-slate-800">จัดการ API Keys</span>
              <span className="text-xs text-slate-500 mt-1">ไปที่ Service 1 (แบงค์)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}