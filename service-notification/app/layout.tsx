import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scholarship API - ค้นหาทุนการศึกษา API สำหรับนักพัฒนา',
  description: 'แพลตฟอร์ม API สำหรับค้นหาทุนการศึกษา สำหรับนักพัฒนาและผู้ใช้ทั่วไป',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
