"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CreditCard, Zap, Shield, Check, ArrowUpRight, Receipt, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { persistTier, readTierFromBrowser, fetchTierFromServer, type Tier } from "@/lib/tier"

const plans = [
  {
    name: "Free",
    price: "฿0",
    period: "/เดือน",
    description: "เหมาะสำหรับเริ่มต้น",
    icon: Shield,
    current: true,
    features: ["API Key 1 ชุด", "100 requests/วัน", "ค้นหาทุนพื้นฐาน", "Usage Dashboard"],
  },
  {
    name: "Pro",
    price: "฿299",
    period: "/เดือน",
    description: "สำหรับนักพัฒนาและทีม",
    icon: Zap,
    current: false,
    highlight: true,
    features: ["API Key 10 ชุด", "10,000 requests/วัน", "Analytics & Smart Match", "Webhook Notifications", "Priority Support"],
  },
]

const invoices = [
  { id: "INV-001", date: "2026-04-01", amount: "฿0", status: "Free Plan", plan: "Free" },
  { id: "INV-002", date: "2026-03-01", amount: "฿0", status: "Free Plan", plan: "Free" },
]

export default function BillingPage() {
  const searchParams = useSearchParams()
  const [tier, setTier] = useState<Tier>('free')

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

    return () => (mounted = false)
  }, [searchParams])

  const plans = [
    {
      name: "Free",
      price: "฿0",
      period: "/เดือน",
      description: "เหมาะสำหรับเริ่มต้น",
      icon: Shield,
      current: tier === 'free',
      features: ["API Key 1 ชุด", "100 requests/วัน", "ค้นหาทุนพื้นฐาน", "Usage Dashboard"],
    },
    {
      name: "Pro",
      price: "฿299",
      period: "/เดือน",
      description: "สำหรับนักพัฒนาและทีม",
      icon: Zap,
      current: tier === 'pro',
      highlight: true,
      features: ["API Key 10 ชุด", "10,000 requests/วัน", "Analytics & Smart Match", "Webhook Notifications", "Priority Support"],
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-1">Billing Center กลางสำหรับดูแพ็คเกจและอัปเกรดจาก Free {'->'} Pro</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">แพ็คเกจปัจจุบัน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{tier === 'pro' ? 'Pro Plan' : 'Free Plan'}</span>
                  <Badge variant={tier === 'pro' ? 'default' : 'secondary'}>{tier === 'pro' ? 'Active' : 'Current'}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{tier === 'pro' ? '10,000 requests/วัน · API Key 10 ชุด' : '100 requests/วัน · API Key 1 ชุด'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{tier === 'pro' ? '฿299' : '฿0'}</p>
              <p className="text-sm text-muted-foreground">/เดือน</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">อัปเกรดแพ็คเกจ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <Card
                key={plan.name}
                className={plan.highlight ? "border-primary shadow-md" : ""}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        plan.highlight ? "bg-primary text-primary-foreground" : "bg-secondary"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{plan.name}</CardTitle>
                        <CardDescription className="text-xs">{plan.description}</CardDescription>
                      </div>
                    </div>
                    {plan.current && <Badge variant="outline">แพ็คเกจของคุณ</Badge>}
                    {plan.highlight && <Badge>แนะนำ</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground mb-1">{plan.period}</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.current ? (
                    <Button variant="outline" className="w-full" disabled>
                      แพ็คเกจปัจจุบัน
                    </Button>
                  ) : (
                    <Button className="w-full" asChild>
                      <a href="http://localhost:3001/dashboard/billing" target="_blank" rel="noopener noreferrer">
                        ไปที่ Billing Center เพื่ออัปเกรด
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">ประวัติการชำระเงิน</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{inv.id}</p>
                  <p className="text-xs text-muted-foreground">{inv.date} · {inv.plan}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground">{inv.amount}</span>
                  <Badge variant="outline" className="text-xs">{inv.status}</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 p-3 bg-muted/40 rounded-lg">
            <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              การอัปเกรดจริงเกิดที่ Billing Center ของ service-auth เพื่อให้อัปเดต tier ได้ตรงกลางเพียงจุดเดียว
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
