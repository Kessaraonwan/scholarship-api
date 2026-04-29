import Link from 'next/link';

export default function NotificationDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">🔔 ศูนย์การแจ้งเตือน</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ส่วนที่ 1: ตั้งค่าการแจ้งเตือน */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 text-indigo-600">ตั้งค่าเงื่อนไข (Alert Rules)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">สาขาที่สนใจ</label>
                  <select className="w-full p-2 border border-slate-300 rounded-md text-sm">
                    <option>Information Technology</option>
                    <option>Engineering</option>
                    <option>Medicine</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-600">รับแจ้งเตือนผ่าน Email</span>
                  <input type="checkbox" className="w-4 h-4 text-indigo-600" defaultChecked />
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm">
                  บันทึกการตั้งค่า
                </button>
              </div>
            </div>

            {/* ส่วน Webhook สำหรับ Pro Tier */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 bg-indigo-50/30">
              <h2 className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-2">Developer Webhook</h2>
              <input 
                type="text" 
                placeholder="https://your-api.com/webhook" 
                className="w-full p-2 border border-indigo-200 rounded-md text-xs mb-2"
              />
              <p className="text-[10px] text-indigo-600">ระบบจะยิง JSON Payload ไปยัง URL นี้เมื่อพบทุนที่ตรงเงื่อนไข</p>
            </div>
          </div>

          {/* ส่วนที่ 2: ประวัติการแจ้งเตือน (Logs) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-semibold text-slate-700">ประวัติการแจ้งเตือนล่าสุด</h2>
                <span className="text-xs text-indigo-600 font-medium">Live Updates</span>
              </div>
              <div className="divide-y divide-slate-100">
                {/* ตัวอย่าง Log 1 */}
                <div className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-slate-800">พบทุนใหม่: Full Stack Bootcamp 2026</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold uppercase">Sent</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">ตรงกับเงื่อนไข: สาขา IT | ส่งเมื่อ: 2 นาทีที่แล้ว</p>
                  <a href="http://localhost:3003/scholarships/1" className="text-xs text-indigo-600 hover:underline font-medium">
                    ดูรายละเอียดทุนนี้ที่ Core API →
                  </a>
                </div>

                {/* ตัวอย่าง Log 2 */}
                <div className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-slate-800">ทุนปิดรับสมัคร: Global MBA Scholarship</h3>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full font-bold uppercase">Queued</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">แจ้งเตือนล่วงหน้า 3 วัน | รอดำเนินการส่ง...</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Navigation Bridge */}
        <div className="mt-12 flex justify-center space-x-6 border-t border-slate-200 pt-8">
           <a href="http://localhost:3001/dashboard/keys" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">🔑 จัดการ API Key (Service 1)</a>
           <a href="http://localhost:3004/analytics" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">📊 ดูสถิติทุน (Service 4)</a>
        </div>
      </div>
    </div>
  );
}