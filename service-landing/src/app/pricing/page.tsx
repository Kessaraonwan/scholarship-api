'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, X, Zap, Shield } from 'lucide-react';
import { AUTH_BASE_URL } from '@/lib/config';

const features = [
  { name: 'ราคา', free: 'ฟรี', pro: 'พรีเมียม' },
  { name: 'Requests/วัน', free: '1,000', pro: '10,000' },
  { name: 'ค้นหาทุน', free: true, pro: true },
  { name: 'ดูรายละเอียดทุน', free: true, pro: true },
  { name: 'ทุนใกล้หมดเขต', free: true, pro: true },
  { name: 'ตั้งแจ้งเตือน', free: true, pro: true },
  { name: 'Analytics', free: false, pro: true },
  { name: 'Match ทุนกับโปรไฟล์', free: false, pro: true },
  { name: 'Webhook URL', free: false, pro: true },
  { name: 'API Key', free: '1 key', pro: 'หลาย key' },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-5 h-5 text-green-500 mx-auto" />;
  if (value === false) return <X className="w-5 h-5 text-red-400 mx-auto" />;
  return <span className="text-slate-700">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24">

        {/* Hero */}
        <section className="bg-gradient-to-b from-indigo-50 via-white to-white py-20">
          <div className="container text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-6">
              <Zap className="w-4 h-4" />
              2 Packages ที่แนะนำ
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 mb-4">
              เลือกแพ็คเกจที่{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                เหมาะกับคุณ
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              เริ่มต้นฟรี อัปเกรดเมื่อต้องการฟีเจอร์เพิ่ม
            </p>
          </div>
        </section>

        {/* Pricing Cards — 2 plans only */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">

              {/* Free */}
              <div className="relative rounded-[2rem] p-8 flex flex-col bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-indigo-50">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold mb-1 text-slate-900">Free</h2>
                <p className="text-sm mb-6 text-slate-500">สำหรับนักพัฒนาที่เริ่มต้น</p>
                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-slate-900">฿0</span>
                  <span className="text-sm text-slate-400">/เดือน</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1 text-sm">
                  {[
                    [true, '100 requests / วัน'],
                    [true, 'API Key 1 ชุด'],
                    [true, 'ค้นหาทุน'],
                    [true, 'ดูรายละเอียดทุน'],
                    [true, 'ทุนใกล้หมดเขต'],
                    [true, 'ตั้งแจ้งเตือน'],
                    [false, 'Analytics'],
                    [false, 'Match ทุนกับโปรไฟล์'],
                    [false, 'Webhook URL'],
                  ].map(([included, text]) => (
                    <li key={text as string} className="flex items-center gap-3">
                      {included
                        ? <Check className="w-4 h-4 shrink-0 text-green-500" />
                        : <X className="w-4 h-4 shrink-0 text-slate-300" />}
                      <span className={included ? 'text-slate-700' : 'text-slate-400'}>{text as string}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`${AUTH_BASE_URL}/register`}
                  className="block text-center py-3 rounded-xl font-bold transition-all bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  เริ่มใช้งานฟรี
                </a>
              </div>

              {/* Pro */}
              <div className="relative rounded-[2rem] p-8 flex flex-col bg-indigo-600 text-white shadow-2xl shadow-indigo-200">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                  แนะนำ
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/20">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-1 text-white">Pro</h2>
                <p className="text-sm mb-6 text-indigo-200">สำหรับนักพัฒนาที่ต้องการข้อมูลเชิงลึก</p>
                <div className="mb-8">
                  <span className="text-3xl font-extrabold text-white">฿299</span>
                  <span className="text-sm text-indigo-200">/เดือน</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1 text-sm">
                  {[
                    '10,000 requests / วัน',
                    'API Key หลายชุด',
                    'ค้นหาทุน',
                    'ดูรายละเอียดทุน',
                    'ทุนใกล้หมดเขต',
                    'ตั้งแจ้งเตือน',
                    'Analytics',
                    'Match ทุนกับโปรไฟล์',
                    'Webhook URL',
                  ].map((text) => (
                    <li key={text} className="flex items-center gap-3">
                      <Check className="w-4 h-4 shrink-0 text-indigo-200" />
                      <span className="text-indigo-100">{text}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`${AUTH_BASE_URL}/register?plan=pro`}
                  className="block text-center py-3 rounded-xl font-bold transition-all bg-white text-indigo-600 hover:bg-indigo-50"
                >
                  อัปเกรดเป็น Pro
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-slate-50">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">เปรียบเทียบฟีเจอร์</h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-6 py-4 text-slate-600 font-semibold">ฟีเจอร์</th>
                    <th className="text-center px-6 py-4 text-slate-600 font-semibold">Free</th>
                    <th className="text-center px-6 py-4 text-indigo-600 font-bold">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {features.map((f) => (
                    <tr key={f.name} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 text-slate-700 font-medium">{f.name}</td>
                      <td className="px-6 py-3 text-center"><Cell value={f.free} /></td>
                      <td className="px-6 py-3 text-center"><Cell value={f.pro} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}