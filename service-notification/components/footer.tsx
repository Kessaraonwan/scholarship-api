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

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">ผลิตภัณฑ์</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="http://localhost:3000/docs" className="text-sm text-muted-foreground hover:text-primary">
                  Documentation
                </a>
              </li>
              <li>
                <a href="http://localhost:3003/scholarships" className="text-sm text-muted-foreground hover:text-primary">
                  ค้นหาทุน (Core API)
                </a>
              </li>
              <li>
                <a href="http://localhost:3004/analytics" className="text-sm text-muted-foreground hover:text-primary">
                  Analytics
                </a>
              </li>
              <li>
                <a href="http://localhost:3005/dashboard/notifications" className="text-sm text-muted-foreground hover:text-primary">
                  ตั้งค่าการแจ้งเตือน
                </a>
              </li>
            </ul>
          </div>

          {/* Account & Status */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">บัญชีและสถานะ</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="http://localhost:3001/dashboard/keys" className="text-sm text-muted-foreground hover:text-primary">
                  จัดการ API Keys
                </a>
              </li>
              <li>
                <a href="http://localhost:3000/status" className="text-sm text-muted-foreground hover:text-primary">
                  สถานะระบบ (Health Check)
                </a>
              </li>
              <li>
                <a href="http://localhost:3001/login" className="text-sm text-muted-foreground hover:text-primary">
                  เข้าสู่ระบบ
                </a>
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