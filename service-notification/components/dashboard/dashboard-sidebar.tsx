"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Bell, History, Webhook, CreditCard, Settings, Lock } from "lucide-react"
import { persistTier, readTierFromBrowser, fetchTierFromServer, type Tier } from "@/lib/tier"

const allNavigation = [
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell, proOnly: false },
  { title: "Notification Logs", href: "/dashboard/notifications/logs", icon: History, proOnly: false },
  { title: "Webhooks", href: "/dashboard/webhooks", icon: Webhook, proOnly: true },
  { title: "Billing", href: "/dashboard/billing", icon: CreditCard, proOnly: false },
  { title: "Settings", href: "/dashboard/settings", icon: Settings, proOnly: false },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tier, setTier] = useState<Tier | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const serverTier = await fetchTierFromServer().catch(() => null)
      if (mounted && serverTier) {
        setTier(serverTier)
        persistTier(serverTier)
        return
      }

      const resolvedTier = readTierFromBrowser(searchParams)
      if (mounted) {
        setTier(resolvedTier)
        persistTier(resolvedTier)
      }
    })()

    return () => {
      mounted = false
    }
  }, [searchParams])

  const withTier = (href: string) => {
    if (!tier) return href
    return `${href}${href.includes('?') ? '&' : '?'}tier=${tier}`
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
      <nav className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
        <h4 className="mb-4 text-sm font-semibold text-sidebar-foreground">Dashboard</h4>
        <ul className="space-y-1">
          {allNavigation.map((item) => {
            const isActive = pathname === item.href
            const isLocked = item.proOnly && tier === "free"

            if (isLocked) {
              // แสดงแต่ lock ไว้ — ไม่ให้กด
              return (
                <li key={item.href}>
                  <div
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/40 cursor-not-allowed select-none"
                    title="Pro only — อัปเกรดเพื่อใช้งาน"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                    <Lock className="h-3 w-3 ml-auto" />
                  </div>
                </li>
              )
            }

            return (
              <li key={item.href}>
                <Link
                  href={withTier(item.href)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent font-medium text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                  {item.proOnly && (
                    <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                      Pro
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {tier === "free" && (
          <div className="mt-6 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
            <p className="text-xs font-medium text-indigo-700 mb-1">อัปเกรดเป็น Pro</p>
            <p className="text-xs text-indigo-600 mb-2">ปลดล็อก Webhooks และ Analytics</p>
            <Link
              href={withTier("/dashboard/billing")}
              className="block text-center text-xs font-medium py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              ดูแพ็คเกจ
            </Link>
          </div>
        )}
      </nav>
    </aside>
  )
}