'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Search, Bell, Key, BookOpen, ArrowRight, Database, BarChart3 } from 'lucide-react';
import { AUTH_BASE_URL } from '@/lib/config';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-16">

        {/* Hero */}
        <section className="bg-gradient-to-b from-indigo-50 via-white to-white py-24">
          <div className="container text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-6">
              <BookOpen className="w-4 h-4" />
              Scholarship API Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
              ค้นหาทุนการศึกษา{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                ผ่าน API
              </span>
            </h1>

            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              แพลตฟอร์มรวมข้อมูลทุนการศึกษาจากทั่วโลก สำหรับนักพัฒนาที่ต้องการดึงข้อมูลทุน
              เข้าแอปพลิเคชันของตัวเอง พร้อมระบบแจ้งเตือนและ Analytics
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href={`${AUTH_BASE_URL}/register`}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 flex items-center gap-2"
              >
                <Key className="w-5 h-5" />
                เริ่มต้นฟรี
              </a>
              <Link
                href="/pricing"
                className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                ดูราคา
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">ทำอะไรได้บ้าง?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">ค้นหาทุน</h3>
                <p className="text-slate-500 leading-relaxed">
                  กรองตามประเทศ ระดับการศึกษา สาขาวิชา และคำค้นหา พร้อม pagination รองรับข้อมูลจำนวนมาก
                </p>
              </div>

              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Bell className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">แจ้งเตือนทุนใหม่</h3>
                <p className="text-slate-500 leading-relaxed">
                  ตั้งเงื่อนไขแจ้งเตือนอัตโนมัติเมื่อมีทุนใหม่ที่ตรงกับโปรไฟล์ รองรับ Webhook สำหรับ Pro
                </p>
              </div>

              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Analytics & Match</h3>
                <p className="text-slate-500 leading-relaxed">
                  วิเคราะห์แนวโน้มทุน และจับคู่ทุนที่เหมาะสมกับโปรไฟล์ผู้ใช้โดยอัตโนมัติ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* API Preview */}
        <section className="py-20 bg-slate-50">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">เริ่มใช้งาน API ใน 3 ขั้นตอน</h2>
            <p className="text-slate-500 text-center mb-12">สมัครฟรี รับ API Key แล้วเรียกใช้งานได้เลย</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { step: '1', title: 'สมัครสมาชิก', desc: 'สร้างบัญชีฟรีใน 1 นาที' },
                { step: '2', title: 'รับ API Key', desc: 'สร้าง key จาก dashboard' },
                { step: '3', title: 'เรียกใช้ API', desc: 'ดึงข้อมูลทุนได้ทันที' },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm overflow-x-auto">
              <p className="text-slate-400 mb-2"># ตัวอย่างการเรียกใช้ API</p>
              <p className="text-green-400">curl -X GET http://localhost:3003/api/scholarships \</p>
              <p className="text-green-400">&nbsp;&nbsp;-H <span className="text-amber-300">"x-api-key: sk_your_api_key"</span> \</p>
              <p className="text-green-400">&nbsp;&nbsp;-G -d <span className="text-amber-300">"country=japan&level=masters"</span></p>
            </div>
          </div>
        </section>

        {/* Microservices Architecture */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Microservices Architecture</h2>
            <p className="text-slate-400 mb-12">ระบบแบ่งเป็น 6 services ทำงานร่วมกัน</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { name: 'Landing', port: 3000, icon: BookOpen, color: 'bg-indigo-600' },
                { name: 'Auth', port: 3001, icon: Key, color: 'bg-purple-600' },
                { name: 'Ingestion', port: 3002, icon: Database, color: 'bg-slate-600' },
                { name: 'Core', port: 3003, icon: Search, color: 'bg-slate-600' },
                { name: 'Analytics', port: 3004, icon: BarChart3, color: 'bg-slate-600' },
                { name: 'Notification', port: 3005, icon: Bell, color: 'bg-slate-600' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.name} className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-sm">{s.name} Service</p>
                    <p className="text-slate-400 text-xs mt-1">:{s.port}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
