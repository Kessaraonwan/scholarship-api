"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Scholarship API</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/docs"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/docs") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Docs
          </Link>
          <Link
            href="/scholarships"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/scholarships") ? "text-primary" : "text-muted-foreground"
            )}
          >
            ค้นหาทุน
          </Link>
          <Link
            href="/status"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/status") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Status
          </Link>
          <Link
            href="/support"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/support") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Support
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">เข้าสู่ระบบ</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">เริ่มใช้งานฟรี</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link
              href="/scholarships"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              ค้นหาทุน
            </Link>
            <Link
              href="/status"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Status
            </Link>
            <Link
              href="/support"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Support
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">เข้าสู่ระบบ</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">เริ่มใช้งานฟรี</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
