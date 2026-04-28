"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "http://localhost:3000/", label: "Home" },
  { href: "http://localhost:3000/docs", label: "Docs" },
  { href: "http://localhost:3003/scholarships", label: "ค้นหาทุน" },
  { href: "http://localhost:3000/status", label: "Status" },
]

export function SiteNavbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Scholarship API
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors ${
                pathname === item.href ? "font-semibold text-indigo-600" : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

