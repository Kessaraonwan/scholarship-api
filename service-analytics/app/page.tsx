import Link from 'next/link';

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
                <span className="mr-2">📊</span> สถิติเชิงลึก
              </h2>
              <p className="text-gray-600 font-light leading-relaxed">
                วิเคราะห์แนวโน้มทุนการศึกษา ยอดการเข้าชม และข้อมูลสถิติที่สำคัญ
              </p>
            </div>
          </Link>

          <Link href="/match" className="block">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group">
              <h2 className="text-xl font-semibold mb-2 flex items-center group-hover:text-indigo-600">
                <span className="mr-2">🎯</span> ระบบจับคู่ทุน (Matching)
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
             🚀 ทางลัดไปยังส่วนอื่นๆ ของระบบ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Link to Core API (Port 3003) */}
            <a 
              href="http://localhost:3003/api/scholarships" 
              className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-transparent hover:border-indigo-200 hover:bg-indigo-50 transition-all text-center"
            >
              <span className="text-2xl mb-2">🎓</span>
              <span className="text-sm font-semibold text-slate-800">ค้นหาทุนการศึกษา</span>
              <span className="text-xs text-slate-500 mt-1">ไปที่ Service 3 (อีฟ)</span>
            </a>

            {/* Link to Notifications (Port 3005) */}
            <a 
              href="http://localhost:3005/dashboard/notifications" 
              className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-transparent hover:border-indigo-200 hover:bg-indigo-50 transition-all text-center"
            >
              <span className="text-2xl mb-2">🔔</span>
              <span className="text-sm font-semibold text-slate-800">ตั้งค่าแจ้งเตือน</span>
              <span className="text-xs text-slate-500 mt-1">ไปที่ Service 5 (ปิ่น)</span>
            </a>

            {/* Link back to Auth/Dashboard (Port 3001) */}
            <a 
              href="http://localhost:3001/dashboard/keys" 
              className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-transparent hover:border-indigo-200 hover:bg-indigo-50 transition-all text-center"
            >
              <span className="text-2xl mb-2">🔑</span>
              <span className="text-sm font-semibold text-slate-800">จัดการ API Keys</span>
              <span className="text-xs text-slate-500 mt-1">ไปที่ Service 1 (แบงค์)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}