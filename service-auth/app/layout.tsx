import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // เพิ่ม Font Inter
import './globals.css'
import { SiteNavbar } from '@/components/site-navbar'
import { SiteFooter } from '@/components/site-footer'

// ตั้งค่า Font
const inter = Inter({
  subsets: ['latin'], // รองรับภาษาไทยด้วย
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: ' | Scholarship API',
    default: 'Scholarship API Gateway',
  },
  description: 'Authentication service and management for Scholarship API',
  icons: {
    icon: '/favicon.ico', // อย่าลืมใส่ไฟล์ไอคอนนะ
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${inter.variable}`}>
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900`}>
        <div className="relative flex min-h-screen flex-col">
          <SiteNavbar />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}