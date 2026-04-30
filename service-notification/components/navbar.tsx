"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Menu, X, LayoutDashboard, Search, Bell } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (url: string) => {
    if (url.startsWith('http')) {
      if (typeof window !== 'undefined') {
        return window.location.origin === new URL(url).origin
      }
      return false
    }
    return pathname === url
  }

  const navLinks = [
    { name: "Documentation", href: "http://localhost:3000/docs", icon: BookOpen },
    { name: "ค้นหาทุน", href: "http://localhost:3003/scholarships", icon: Search },
    { name: "แจ้งเตือน", href: "/dashboard/notifications", icon: Bell },
  ]

  const NavItem = ({ link, mobile = false }: { link: typeof navLinks[0], mobile?: boolean }) => {
    const active = isActive(link.href)
    return (
      <a
        href={link.href}
        onClick={() => mobile && setMobileMenuOpen(false)}
        className={cn(
          "flex items-center gap-2 text-sm font-medium transition-all duration-200",
          mobile ? "px-2 py-2 rounded-md" : "relative py-2",
          active
            ? "text-indigo-600"
            : "text-muted-foreground hover:text-indigo-500"
        )}
      >
        <link.icon className={cn("h-4 w-4", active ? "text-indigo-600" : "text-muted-foreground")} />
        {link.name}
        {!mobile && active && (
          <span className="absolute inset-x-0 -bottom-[21px] h-0.5 bg-indigo-600" />
        )}
      </a>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="http://localhost:3000" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-indigo-200 shadow-lg transition-transform group-hover:scale-105">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none text-slate-900">Scholarship</span>
            <span className="text-[10px] font-medium text-indigo-600 tracking-wider uppercase">Micro-API</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <NavItem key={link.name} link={link} />
            ))}
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50" asChild>
              <a href="http://localhost:3001/login">เข้าสู่ระบบ</a>
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100" asChild>
              {/* แดชบอร์ดอยู่ที่ :3005 ไม่ใช่ :3001 */}
              <a href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                แดชบอร์ด
              </a>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <NavItem key={link.name} link={link} mobile />
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
              <Button variant="outline" className="w-full border-slate-200 text-slate-600" asChild>
                <a href="http://localhost:3001/login">เข้าสู่ระบบ</a>
              </Button>
              <Button className="w-full bg-indigo-600" asChild>
                <a href="/dashboard">แดชบอร์ด</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}