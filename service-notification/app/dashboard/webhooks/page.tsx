"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Webhook, Plus, Trash2 } from "lucide-react"

interface WebhookEndpoint {
  id: string
  userId: string
  url: string
  events: string[]
  active: boolean
  createdAt: string
}

const eventTypes = [
  { id: "notification.sent", name: "Notification Sent" },
  { id: "notification.delivered", name: "Notification Delivered" },
  { id: "notification.failed", name: "Notification Failed" },
]

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [url, setUrl] = useState("")
  const [events, setEvents] = useState<string[]>(["notification.sent"])

  useEffect(() => {
    const uid = localStorage.getItem("user_id") || "user-123"
    setUserId(uid)
  }, [])

  useEffect(() => {
    async function load() {
      if (!userId) return
      setIsLoading(true)
      setError("")
      try {
        const response = await fetch(`/api/webhooks?userId=${encodeURIComponent(userId)}&page=1&limit=100`)
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || "โหลด webhooks ไม่สำเร็จ")
        setWebhooks(payload.data || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : "โหลด webhooks ไม่สำเร็จ")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [userId])

  async function createWebhook() {
    if (!userId || !url || events.length === 0) return
    try {
      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, url, events }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "สร้าง webhook ไม่สำเร็จ")
      setWebhooks((prev) => [payload.data, ...prev])
      setUrl("")
      setEvents(["notification.sent"])
      setShowForm(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "สร้าง webhook ไม่สำเร็จ")
    }
  }

  async function deleteWebhook(id: string) {
    try {
      const response = await fetch(`/api/webhooks/${id}`, { method: "DELETE" })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "ลบ webhook ไม่สำเร็จ")
      setWebhooks((prev) => prev.filter((w) => w.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : "ลบ webhook ไม่สำเร็จ")
    }
  }

  async function toggleWebhook(id: string) {
    const current = webhooks.find((w) => w.id === id)
    if (!current) return
    try {
      const response = await fetch(`/api/webhooks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !current.active }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "อัปเดต webhook ไม่สำเร็จ")
      setWebhooks((prev) => prev.map((w) => (w.id === id ? payload.data : w)))
    } catch (e) {
      setError(e instanceof Error ? e.message : "อัปเดต webhook ไม่สำเร็จ")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Webhooks</h1>
          <p className="mt-2 text-muted-foreground">จัดการ webhook endpoints ของบัญชีคุณ</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" />
          เพิ่ม Webhook
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>สร้าง Webhook Endpoint</CardTitle>
            <CardDescription>URL นี้จะได้รับ notification events แบบ real-time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Endpoint URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-app.com/webhook" />
            </div>
            <div className="space-y-2">
              <Label>Events</Label>
              <div className="flex flex-wrap gap-4">
                {eventTypes.map((ev) => (
                  <label key={ev.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={events.includes(ev.id)}
                      onChange={(e) =>
                        setEvents((prev) =>
                          e.target.checked ? [...new Set([...prev, ev.id])] : prev.filter((item) => item !== ev.id)
                        )
                      }
                    />
                    {ev.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={createWebhook}>บันทึก</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>ยกเลิก</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Webhook Endpoints</CardTitle>
          <CardDescription>รายการ endpoint ที่ระบบจะส่ง event ไปให้</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">กำลังโหลด...</p>
          ) : webhooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Webhook className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="font-medium text-foreground">ยังไม่มี Webhook Endpoints</p>
              <p className="text-sm text-muted-foreground">เพิ่ม endpoint เพื่อรับ events แบบ real-time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <code className="text-sm font-medium text-foreground">{webhook.url}</code>
                      {webhook.active ? <Badge className="bg-green-100 text-green-800">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">{event}</Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      created: {new Date(webhook.createdAt).toLocaleDateString("th-TH")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={webhook.active} onCheckedChange={() => toggleWebhook(webhook.id)} />
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteWebhook(webhook.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
