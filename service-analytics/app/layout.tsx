import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SiteNavbar } from '@/components/site-navbar'
import { SiteFooter } from '@/components/site-footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: ' | สถิติทุนการศึกษา',
    default: 'แดชบอร์ดสถิติทุนการศึกษา',
  },
  description: 'สถิติและแดชบอร์ดสำหรับ Scholarship API',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={inter.variable}>
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
          <SiteNavbar />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}