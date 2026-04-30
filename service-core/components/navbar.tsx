"use client"

import Link from "next/link"
import { Shield, Key, Database, LogIn, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* โลโก้ */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Scholarship API</span>
          </Link>

          {/* เมนูหลัก */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/scholarships"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
              ค้นหาทุน
            </Link>

            {/* ingestion = :3002 (มิก) — admin only จึงไม่แสดงใน navbar ทั่วไป */}
          </div>

          {/* ปุ่มด้านขวา */}
          <div className="flex items-center gap-3">

            {/* จัดการ API Key → :3001/dashboard/keys */}
            <a href="http://localhost:3001/dashboard/keys">
              <Button variant="ghost" className="text-indigo-600 hover:bg-indigo-50 gap-2">
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">จัดการ API Key</span>
              </Button>
            </a>

            {/* ✅ ปุ่ม Login ที่หายไป — เพิ่มกลับ */}
            <a href="http://localhost:3001/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </Button>
            </a>

          </div>
        </div>
      </div>
    </nav>
  )
}