"use client"

import { BookOpen } from "lucide-react"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="http://localhost:3000" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Scholarship API</span>
        </a>

        <span className="text-sm text-muted-foreground">Notification Service</span>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="http://localhost:3003/scholarships" className="transition-colors hover:text-primary">
            ค้นหาทุน
          </a>
          <a href="http://localhost:3001/dashboard/keys" className="transition-colors hover:text-primary">
            API Keys
          </a>
          <a href="http://localhost:3000/docs" className="transition-colors hover:text-primary">
            Docs
          </a>
        </div>
      </div>
    </nav>
  )
}
