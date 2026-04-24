import Link from 'next/link'
import { ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-sm shadow-black/10">
                Scholarship API Authentication · Minimal design
              </div>
              <div className="space-y-6">
                <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
                  Scholarship <span className="bg-gradient-to-r from-white via-slate-300 to-white bg-clip-text text-transparent">API Gateway</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  ระบบล็อกอินและจัดการ API Key สำหรับนักพัฒนา ช่วยให้เชื่อมต่อ Scholarship services ได้อย่างปลอดภัย พร้อมแดชบอร์ดสถิติแบบสวยงาม
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100"
                >
                  สมัครสมาชิก
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300 shadow-lg shadow-black/10">
                  <div className="flex items-center gap-2 text-white">
                    <ShieldCheck className="h-4 w-4" /> ปลอดภัยสูง
                  </div>
                  <p className="mt-3 leading-6">ระบบตรวจสอบสิทธิ์และคีย์ API ที่ปลอดภัย</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300 shadow-lg shadow-black/10">
                  <div className="flex items-center gap-2 text-white">
                    <Zap className="h-4 w-4" /> เร็วทันใจ
                  </div>
                  <p className="mt-3 leading-6">ตอบสนอง API ได้รวดเร็ว พร้อมแดชบอร์ดข้อมูลเรียลไทม์</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300 shadow-lg shadow-black/10">
                  <div className="flex items-center gap-2 text-white">
                    <Lock className="h-4 w-4" /> ควบคุมง่าย
                  </div>
                  <p className="mt-3 leading-6">จัดการคีย์และสิทธิ์ได้จากหน้าเดียว</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="rounded-[1.75rem] bg-slate-950/95 p-6 shadow-inner shadow-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
                    <h2 className="mt-4 text-3xl font-semibold text-white">API Keys</h2>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">Active</div>
                </div>
                <div className="mt-8 space-y-5">
                  <div className="rounded-3xl bg-slate-900/90 p-5">
                    <p className="text-sm text-slate-400">คีย์ล่าสุด</p>
                    <p className="mt-2 text-lg font-semibold text-white">sk_live_abc123xyz</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                      <span>Usage 1.2k</span>
                      <span>Created 2d ago</span>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-900/90 p-4 text-sm text-slate-300">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Requests</p>
                      <p className="mt-3 text-2xl font-semibold text-white">15.4k</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/90 p-4 text-sm text-slate-300">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Error Rate</p>
                      <p className="mt-3 text-2xl font-semibold text-white">2.3%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
