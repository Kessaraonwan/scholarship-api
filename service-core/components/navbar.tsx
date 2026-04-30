"use client"
import Link from "next/link"
import { Shield, Key, LogIn, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    try {
      setIsLoggedIn(Boolean(localStorage.getItem("userId") || localStorage.getItem("userTier")))
    } catch {
      setIsLoggedIn(false)
    }
  }, [])

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Scholarship API</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/scholarships" className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1">
              <Search className="w-4 h-4" />
              ค้นหาทุน
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <a href="http://localhost:3001/dashboard/keys">
              <Button variant="ghost" className="text-indigo-600 hover:bg-indigo-50 gap-2">
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">จัดการ API Key</span>
              </Button>
            </a>
            {isLoggedIn ? (
              <a href="http://localhost:3001/dashboard">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>แดชบอร์ด</span>
                </Button>
              </a>
            ) : (
              <a href="http://localhost:3001/login">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>เข้าสู่ระบบ</span>
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
