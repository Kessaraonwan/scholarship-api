'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

interface LoginForm {
  email: string
  password: string
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  const router = useRouter()

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError('')

    try {
      console.log('Attempting login with:', { email: data.email, password: '***' })

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('Login response status:', response.status)

      const result = await response.json()
      console.log('Login response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'เข้าสู่ระบบไม่สำเร็จ')
      }

      console.log('Login successful, redirecting to dashboard...')

      // เข้าสู่ระบบสำเร็จ - redirect ไป dashboard
      // Cookies จะถูกส่งโดย server
      window.location.href = '/dashboard/keys'
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-950 shadow-lg shadow-black/30">
            <span className="text-2xl font-bold">S</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">เข้าสู่ระบบ</h1>
          <p className="mt-3 text-sm text-slate-300">เข้าสู่ระบบเพื่อจัดการ API Key และดูสถิติการใช้งาน</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'กรุณากรอกอีเมล',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'รูปแบบอีเมลไม่ถูกต้อง',
                },
              })}
              className="mt-2 w-full rounded-full border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'กรุณากรอกรหัสผ่าน',
                minLength: {
                  value: 6,
                  message: 'รหัสผ่านต้องมีขั้นต่ำ 6 ตัวอักษร',
                },
              })}
              className="mt-2 w-full rounded-full border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-4">
              <p className="text-sm text-rose-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-slate-400">
          ยังไม่มีบัญชี?{' '}
          <Link href="/register" className="font-semibold text-white hover:text-slate-200">
            สมัครสมาชิกเลย
          </Link>
        </div>
      </div>
    </div>
  )
}
