import Link from "next/link"
import { BookOpen } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">Scholarship API</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              แพลตฟอร์ม API สำหรับค้นหาทุนการศึกษา สำหรับนักพัฒนาและผู้ใช้ทั่วไป
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">ผลิตภัณฑ์</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="text-sm text-muted-foreground hover:text-primary">
                  ค้นหาทุน
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-sm text-muted-foreground hover:text-primary">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">บัญชี</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
                  เข้าสู่ระบบ
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-primary">
                  สมัครสมาชิก
                </Link>
              </li>
              <li>
                <Link href="/dashboard/keys" className="text-sm text-muted-foreground hover:text-primary">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Scholarship API. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
