'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BadgeCheck, Check, Crown, Zap, ArrowRight, Sparkles, Shield } from 'lucide-react'

const features = [
  { label: 'API Keys', free: '1 ชุด', pro: 'ไม่จำกัด' },
  { label: 'Usage Stats', free: 'พื้นฐาน', pro: 'ละเอียด + Export' },
  { label: 'Notifications', free: 'Email', pro: 'Email + Webhook' },
  { label: 'Analytics', free: 'ไม่มี', pro: 'มี' },
  { label: 'Priority Support', free: 'ไม่มี', pro: 'มี' },
]

export default function BillingPage() {
  const router = useRouter()
  const [tier, setTier] = useState<'free' | 'pro'>('free')
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const storedTier = localStorage.getItem('userTier')
    if (storedTier === 'pro') setTier('pro')
  }, [])

  const handleMockUpgrade = async () => {
    setIsUpgrading(true)
    setMessage('')

    try {
      const response = await fetch('/api/billing/mock-upgrade', { method: 'POST' })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'อัปเกรดไม่สำเร็จ')
      }

      localStorage.setItem('userTier', result.user?.tier || 'pro')
      if (result.user?.id) {
        localStorage.setItem('userId', result.user.id)
      }
      setTier('pro')
      setMessage('อัปเกรดเป็น Pro เรียบร้อยแล้ว')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleReset = () => {
    localStorage.setItem('userTier', 'free')
    setTier('free')
    setMessage('รีเซ็ตกลับเป็น Free สำหรับเดโมแล้ว')
    router.refresh()
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-700 text-white p-8 shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              Demo Billing Flow
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              เลือกแพ็คเกจ แล้วกดอัปเกรดเพื่อดูความต่างได้ทันที
            </h1>
            <p className="text-sm leading-6 text-white/75 sm:text-base">
              สมัครสมาชิกจะเริ่มที่ Free ก่อน จากนั้นกดปุ่มด้านล่างเพื่อเปลี่ยนเป็น Pro แบบ mock
              และดูเมนู/สิทธิ์ที่ปลดล็อกในระบบได้เลย
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Current plan</p>
            <div className="mt-2 flex items-center gap-2 text-lg font-bold">
              {tier === 'pro' ? <Crown className="h-5 w-5 text-amber-300" /> : <Shield className="h-5 w-5 text-sky-300" />}
              {tier === 'pro' ? 'Pro Plan' : 'Free Plan'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Free</p>
              <h2 className="text-2xl font-bold text-slate-900">เริ่มต้นฟรี</h2>
            </div>
            <Shield className="h-10 w-10 text-slate-300" />
          </div>
          <div className="mt-6 text-4xl font-extrabold text-slate-900">฿0</div>
          <p className="mt-1 text-sm text-slate-500">เหมาะสำหรับลองระบบและสร้าง API Key ชุดแรก</p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> API Key 1 ชุด</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Dashboard พื้นฐาน</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> ดูทุน + stats เบื้องต้น</li>
          </ul>
        </div>

        <div className="rounded-3xl border-2 border-indigo-600 bg-indigo-600 p-6 text-white shadow-xl shadow-indigo-200/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-100">Pro</p>
              <h2 className="text-2xl font-bold text-white">ปลดล็อกฟีเจอร์ทั้งหมด</h2>
            </div>
            <Crown className="h-10 w-10 text-amber-300" />
          </div>
          <div className="mt-6 text-4xl font-extrabold text-white">฿299</div>
          <p className="mt-1 text-sm text-indigo-100">สำหรับดูความต่างของแพ็คเกจใน demo</p>
          <ul className="mt-6 space-y-3 text-sm text-indigo-50">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-300" /> API Keys ไม่จำกัด</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-300" /> Analytics + Webhook</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-300" /> Notifications ขั้นสูง</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-300" /> Priority support</li>
          </ul>

          <button
            onClick={handleMockUpgrade}
            disabled={isUpgrading || tier === 'pro'}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-bold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {tier === 'pro' ? (
              <>
                <BadgeCheck className="h-4 w-4" />
                ใช้งาน Pro อยู่แล้ว
              </>
            ) : isUpgrading ? (
              'กำลังอัปเกรด...'
            ) : (
              <>
                อัปเกรดเป็น Pro (mock)
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            กลับเป็น Free เพื่อเดโม
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">เปรียบเทียบฟีเจอร์</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.label} className="rounded-2xl border border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-900">{feature.label}</div>
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Free</p>
                  <p className="mt-1 font-semibold text-slate-700">{feature.free}</p>
                </div>
                <div className="rounded-xl bg-indigo-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-indigo-400">Pro</p>
                  <p className="mt-1 font-semibold text-indigo-700">{feature.pro}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}