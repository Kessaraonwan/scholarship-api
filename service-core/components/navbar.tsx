"use client"

import Link from "next/link"
import { Shield, Key, Database, LogIn, Search } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* ส่วนโลโก้ */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Scholarship API</span>
          </Link>

          {/* ส่วนเมนูหลัก */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/scholarships" className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1">
              <Search className="w-4 h-4" />
              ค้นหาทุน
            </Link>
            
            {/* ลิงก์ไปหน้าของภูมิ (3002) */}
            <a 
              href="http://localhost:3002" 
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1"
            >
              <Database className="w-4 h-4" />
              จัดการข้อมูลทุน
            </a>
          </div>

          {/* ส่วนปุ่ม Action ด้านขวา */}
          <div className="flex items-center gap-3">
            {/* ลิงก์ไปหน้าขอ Key ของแบงค์ (3001) */}
            <a href="http://localhost:3001/dashboard/keys">
              <Button variant="ghost" className="text-indigo-600 hover:bg-indigo-50 gap-2">
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">จัดการ API Key</span>
              </Button>
            </a>

            {/* ลิงก์ไปหน้า Login ของแบงค์ (3001) */}
            <a href="http://localhost:3001/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6">
                <LogIn className="w-4 h-4 mr-2" />
                เข้าสู่ระบบ
              </Button>
            </a>
          </div>

        </div>
      </div>
    </nav>
  )
}