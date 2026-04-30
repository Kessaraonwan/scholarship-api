'use client'

import Link from 'next/link'
import { CheckCircle, Key, Zap, ArrowRight, BookOpen } from 'lucide-react'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
          ยินดีต้อนรับ!
        </h1>
        <p className="text-slate-500 text-lg mb-10">
          สมัครสมาชิกเสร็จแล้ว พร้อมใช้งาน Scholarship API แล้ววันนี้
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-10 text-left">
          <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-900">สร้าง API Key</p>
              <p className="text-sm text-slate-500 mt-0.5">
                ไปที่ Dashboard → API Keys แล้วสร้าง key สำหรับเรียกใช้งาน API
              </p>
            </div>
            <Key className="w-5 h-5 text-indigo-400 shrink-0 mt-1" />
          </div>

          <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-900">ค้นหาทุนการศึกษา</p>
              <p className="text-sm text-slate-500 mt-0.5">
                เรียก <span className="font-mono text-indigo-600 text-xs">GET /api/scholarships</span> พร้อม API Key เพื่อดึงข้อมูลทุน
              </p>
            </div>
            <BookOpen className="w-5 h-5 text-indigo-400 shrink-0 mt-1" />
          </div>

          <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="w-9 h-9 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold shrink-0">
              3
            </div>
            <div>
              <p className="font-semibold text-slate-900">อัปเกรดเป็น Pro <span className="text-xs text-slate-400 font-normal">(ถ้าต้องการ)</span></p>
              <p className="text-sm text-slate-500 mt-0.5">
                ปลดล็อก Analytics, Smart Match และ Webhook Notifications
              </p>
            </div>
            <Zap className="w-5 h-5 text-slate-300 shrink-0 mt-1" />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/keys"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
          >
            ไปสร้าง API Key
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="http://localhost:3000/docs"
            className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            อ่าน Docs
          </a>
        </div>

      </div>
    </div>
  )
}
