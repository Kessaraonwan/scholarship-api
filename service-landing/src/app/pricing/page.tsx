'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, X, Zap, Shield, Star } from 'lucide-react';
import { AUTH_BASE_URL } from '@/lib/config';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'เหมาะสำหรับนักพัฒนาที่เริ่มต้นหรือทดลองใช้งาน',
    color: 'slate',
    icon: Shield,
    cta: 'เริ่มใช้งานฟรี',
    ctaHref: `${AUTH_BASE_URL}/register`,
    features: [
      { text: 'API Key 1 ชุด', included: true },
      { text: '100 requests / วัน', included: true },
      { text: 'ค้นหาทุน (filter พื้นฐาน)', included: true },
      { text: 'ดูรายละเอียดทุน', included: true },
      { text: 'Usage Dashboard', included: true },
      { text: 'Analytics & Match', included: false },
      { text: 'Webhook Notifications', included: false },
      { text: 'Priority Support', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '299',
    description: 'สำหรับนักพัฒนาและทีมที่ต้องการข้อมูลเชิงลึก',
    color: 'indigo',
    icon: Zap,
    cta: 'อัปเกรดเป็น Pro',
    ctaHref: `${AUTH_BASE_URL}/register?plan=pro`,
    badge: 'แนะนำ',
    features: [
      { text: 'API Key สูงสุด 10 ชุด', included: true },
      { text: '10,000 requests / วัน', included: true },
      { text: 'ค้นหาทุน (filter ขั้นสูง)', included: true },
      { text: 'ดูรายละเอียดทุน', included: true },
      { text: 'Usage Dashboard', included: true },
      { text: 'Analytics & Smart Match', included: true },
      { text: 'Webhook Notifications', included: true },
      { text: 'Priority Support', included: true },
    ],
  },
  {
    name: 'Enterprise',
    price: 'ติดต่อทีม',
    description: 'สำหรับองค์กรขนาดใหญ่ที่ต้องการ SLA และ custom integration',
    color: 'purple',
    icon: Star,
    cta: 'ติดต่อเรา',
    ctaHref: '#contact',
    features: [
      { text: 'API Key ไม่จำกัด', included: true },
      { text: 'Requests ไม่จำกัด', included: true },
      { text: 'ทุกฟีเจอร์ของ Pro', included: true },
      { text: 'Custom Webhooks', included: true },
      { text: 'Dedicated Support', included: true },
      { text: 'SLA 99.9% Uptime', included: true },
      { text: 'On-premise deployment', included: true },
      { text: 'Custom Integration', included: true },
    ],
  },
];

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
              Service Packages
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 mb-4">
              เลือกแพ็คเกจที่{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                เหมาะกับคุณ
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              เริ่มต้นฟรี ไม่ต้องใช้บัตรเครดิต อัปเกรดเมื่อพร้อม
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isHighlighted = plan.name === 'Pro';
                return (
                  <div
                    key={plan.name}
                    className={`relative rounded-[2rem] p-8 flex flex-col ${
                      isHighlighted
                        ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105'
                        : 'bg-white border border-slate-100 shadow-xl shadow-slate-200/50'
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full">
                        {plan.badge}
                      </div>
                    )}

                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                      isHighlighted ? 'bg-white/20' : 'bg-indigo-50'
                    }`}>
                      <Icon className={`w-6 h-6 ${isHighlighted ? 'text-white' : 'text-indigo-600'}`} />
                    </div>

                    <h2 className={`text-2xl font-bold mb-1 ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </h2>
                    <p className={`text-sm mb-6 ${isHighlighted ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {plan.description}
                    </p>

                    <div className="mb-8">
                      {plan.price === 'ติดต่อทีม' ? (
                        <span className={`text-2xl font-bold ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>
                          ติดต่อทีม
                        </span>
                      ) : (
                        <div className="flex items-end gap-1">
                          <span className={`text-4xl font-extrabold ${isHighlighted ? 'text-white' : 'text-slate-900'}`}>
                            ฿{plan.price}
                          </span>
                          <span className={`text-sm mb-1 ${isHighlighted ? 'text-indigo-200' : 'text-slate-400'}`}>
                            /เดือน
                          </span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((f) => (
                        <li key={f.text} className="flex items-center gap-3">
                          {f.included ? (
                            <Check className={`w-4 h-4 shrink-0 ${isHighlighted ? 'text-indigo-200' : 'text-green-500'}`} />
                          ) : (
                            <X className={`w-4 h-4 shrink-0 ${isHighlighted ? 'text-indigo-400' : 'text-slate-300'}`} />
                          )}
                          <span className={`text-sm ${
                            !f.included
                              ? isHighlighted ? 'text-indigo-400' : 'text-slate-400'
                              : isHighlighted ? 'text-indigo-100' : 'text-slate-700'
                          }`}>
                            {f.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={plan.ctaHref}
                      className={`block text-center py-3 rounded-xl font-bold transition-all ${
                        isHighlighted
                          ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-16 bg-slate-50">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">เปรียบเทียบฟีเจอร์</h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-6 py-4 text-slate-600 font-semibold">ฟีเจอร์</th>
                    <th className="text-center px-6 py-4 text-slate-600 font-semibold">Free</th>
                    <th className="text-center px-6 py-4 text-indigo-600 font-bold">Pro</th>
                    <th className="text-center px-6 py-4 text-purple-600 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    ['API Requests / วัน', '100', '10,000', 'ไม่จำกัด'],
                    ['API Keys', '1', '10', 'ไม่จำกัด'],
                    ['Scholarship Search', '✓', '✓', '✓'],
                    ['Advanced Filters', '—', '✓', '✓'],
                    ['Analytics Dashboard', '—', '✓', '✓'],
                    ['Smart Match', '—', '✓', '✓'],
                    ['Webhook Notifications', '—', '✓', '✓'],
                    ['SLA Guarantee', '—', '—', '99.9%'],
                    ['Support', 'Community', 'Priority', 'Dedicated'],
                  ].map(([feature, free, pro, enterprise]) => (
                    <tr key={feature} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 text-slate-700">{feature}</td>
                      <td className="px-6 py-3 text-center text-slate-500">{free}</td>
                      <td className="px-6 py-3 text-center text-indigo-600 font-medium">{pro}</td>
                      <td className="px-6 py-3 text-center text-purple-600">{enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white" id="contact">
          <div className="container text-center">
            <div className="max-w-2xl mx-auto p-12 rounded-[3rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-200">
              <h2 className="text-3xl font-bold mb-4">พร้อมเริ่มต้นแล้วใช่ไหม?</h2>
              <p className="text-indigo-100 mb-8">สมัครฟรีวันนี้ ไม่ต้องใช้บัตรเครดิต</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a href={`${AUTH_BASE_URL}/register`} className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all">
                  สมัครฟรี
                </a>
                <a href="/docs" className="border border-indigo-400 px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all">
                  อ่าน Docs
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
