import Link from 'next/link'
import { ArrowRight, ShieldCheck, Zap, Lock, Search, Bell, Key, BookOpen } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_35%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <BookOpen className="h-16 w-16 text-blue-300" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                Scholarship API Gateway
              </h1>
              <p className="mt-4 max-w-2xl text-lg md:text-xl text-blue-100 mx-auto mb-10">
                ศูนย์รวม API และข้อมูลทุนการศึกษาที่ใหญ่ที่สุดสำหรับนักเรียนและนักพัฒนา
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/demo" className="bg-white text-blue-900 hover:bg-gray-50 font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center">
                  ดู Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/login" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold py-3 px-8 rounded-full transition flex items-center justify-center">
                  เข้าสู่ระบบ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">ค้นหาง่าย</h3>
            <p className="text-gray-500">กรองตามประเทศ ระดับชั้น และสาขาวิชาได้อย่างแม่นยำ</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="p-3 bg-green-50 text-green-600 rounded-full mb-4">
              <Bell className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">ไม่พลาดทุกทุน</h3>
            <p className="text-gray-500">รับการแจ้งเตือนผ่าน Email เมื่อมีทุนใหม่ที่ตรงกับคุณ</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full mb-4">
              <Key className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">สำหรับนักพัฒนา</h3>
            <p className="text-gray-500">เชื่อมต่อ API ข้อมูลทุนเข้ากับแอปพลิเคชันของคุณได้อย่างง่ายดาย</p>
          </div>
        </div>
      </div>

      {/* API Info */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">เริ่มใช้งาน API</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              ใช้ API key เพื่อเข้าถึงข้อมูลทุนการศึกษาจากระบบของเรา
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">API Endpoint</h3>
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Active</span>
            </div>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
              curl -X GET http://localhost:3001/api/example \<br/>
              &nbsp;&nbsp;-H "Authorization: Bearer sk_your_api_key"
            </div>
            <div className="mt-4 flex gap-4">
              <Link href="/demo" className="text-blue-600 hover:text-blue-800 font-medium">
                ดู Developer Dashboard →
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-gray-800 font-medium">
                สมัครใช้งานฟรี →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
