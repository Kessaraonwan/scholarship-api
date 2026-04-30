"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Bell, History, Webhook, CreditCard, Settings } from "lucide-react"

const navigation = [
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { title: "Notification Logs", href: "/dashboard/notifications/logs", icon: History },
  { title: "Webhooks", href: "/dashboard/webhooks", icon: Webhook },
  { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
      <nav className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
        <h4 className="mb-4 text-sm font-semibold text-sidebar-foreground">Dashboard</h4>
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent font-medium text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
