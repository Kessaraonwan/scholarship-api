import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
  icons: { icon: '/favicon.ico' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  )
}