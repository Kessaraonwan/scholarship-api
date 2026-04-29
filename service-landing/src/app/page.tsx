'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ShieldCheck, Zap, Key, Database, ArrowRight, Lock, LayoutDashboard } from 'lucide-react';
import { AUTH_BASE_URL } from '@/lib/config';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        
        {/* Hero Section - ปรับให้เข้ากับ Indigo Theme */}
        <section className="relative bg-gradient-to-b from-indigo-50 via-white to-white py-24 overflow-hidden">
          <div className="container relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-6">
                <ShieldCheck className="w-4 h-4" />
                Centralized Authentication Gateway
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Scholarship API</span> Keys
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                ระบบจัดการสิทธิ์การเข้าถึงข้อมูลทุนการศึกษา (Auth Service) 
                สร้างและควบคุม API Key ของคุณเพื่อเชื่อมต่อกับทุกบริการในเครือข่าย
              </p>
              
              <div className="flex gap-4 justify-center flex-wrap">
                <a href={`${AUTH_BASE_URL}/register`} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Get Started Free
                </a>
                <Link href="http://localhost:3003" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                  Browse Scholarships
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* ส่วนโชว์ Role ของ Service 3001 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Secure Auth</h3>
                <p className="text-slate-500 leading-relaxed">
                  ระบบลงทะเบียนและเข้าสู่ระบบที่ปลอดภัย จัดเก็บข้อมูลผู้ใช้และสิทธิ์การใช้งานอย่างเป็นระบบ
                </p>
              </div>

              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Key className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Key Management</h3>
                <p className="text-slate-500 leading-relaxed">
                  สร้าง แก้ไข หรือระงับ API Key ได้ทันที พร้อมระบบ Usage Tracking ตรวจสอบการใช้งานแบบ Real-time
                </p>
              </div>

              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-200 transition-all">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Developer Metrics</h3>
                <p className="text-slate-500 leading-relaxed">
                  แดชบอร์ดสรุปสถิติการยิง API ทั้งหมดในระบบ ช่วยให้คุณวิเคราะห์พฤติกรรมการใช้งานได้อย่างแม่นยำ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section เชื่อมโยง Microservices */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-16">The Microservices Ecosystem</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <p className="font-bold">Auth Service (3001)</p>
                <p className="text-slate-400 text-sm mt-2">Manage Identity & Keys</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                  <Database className="w-8 h-8" />
                </div>
                <p className="font-bold">Ingestion Service (3002)</p>
                <p className="text-slate-400 text-sm mt-2">Data Scraping & Storage</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8" />
                </div>
                <p className="font-bold">Core Service (3003)</p>
                <p className="text-slate-400 text-sm mt-2">Scholarship Discovery</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container text-center">
            <div className="max-w-3xl mx-auto p-12 rounded-[3rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-200">
              
              <p className="text-xl mb-8 text-indigo-100">
                สมัครสมาชิกเพื่อรับ API Key และเริ่มต้นดึงข้อมูลทุนจากทั่วโลกไปใช้งานในแอปพลิเคชันของคุณ
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a href={`${AUTH_BASE_URL}/register`} className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all">
                  Register Now
                </a>
                <a href="http://localhost:3002" className="border border-indigo-400 px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all">
                  Admin Dashboard
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}