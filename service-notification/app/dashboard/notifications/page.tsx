"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface NotificationRule {
  id: string
  userId: string
  name: string
  triggers: {
    scholarshipField?: string
    scholarshipLevel?: string
    country?: string
  }
  channels: string[]
  active: boolean
  createdAt: string
}

const fields = ["ทุกสาขา", "IT", "วิทยาศาสตร์", "เศรษฐศาสตร์"]
const levels = ["ทุกระดับ", "มัธยม", "ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก"]
const countries = ["ทุกประเทศ", "ไทย", "UK", "US", "Japan", "Germany"]

export default function NotificationsPage() {
  const [rules, setRules] = useState<NotificationRule[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState("")
  const [newRule, setNewRule] = useState({
    name: "",
    field: "",
    level: "",
    country: "",
    channels: ["email"] as string[],
  })

  useEffect(() => {
    const savedUserId = localStorage.getItem("user_id") || "user-123"
    setUserId(savedUserId)
  }, [])

  useEffect(() => {
    async function loadRules() {
      if (!userId) return
      setIsLoading(true)
      setError("")
      try {
        const response = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}&page=1&limit=50`)
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || "โหลดกฎไม่สำเร็จ")
        setRules(payload.data || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : "โหลดกฎไม่สำเร็จ")
      } finally {
        setIsLoading(false)
      }
    }
    loadRules()
  }, [userId])

  const handleAddRule = async () => {
    if (!userId || !newRule.name || !newRule.field || !newRule.level || !newRule.country) return

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: newRule.name,
          triggers: {
            scholarshipField: newRule.field,
            scholarshipLevel: newRule.level,
            country: newRule.country,
          },
          channels: newRule.channels,
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "สร้างกฎไม่สำเร็จ")
      setRules((prev) => [payload.data, ...prev])
      setNewRule({
        name: "",
        field: "",
        level: "",
        country: "",
        channels: ["email"],
      })
      setShowForm(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "สร้างกฎไม่สำเร็จ")
    }
  }

  const handleDeleteRule = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, { method: "DELETE" })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "ลบกฎไม่สำเร็จ")
      setRules((prev) => prev.filter((rule) => rule.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : "ลบกฎไม่สำเร็จ")
    }
  }

  const handleToggleRule = async (id: string) => {
    const current = rules.find((rule) => rule.id === id)
    if (!current) return
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !current.active }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "อัปเดตกฎไม่สำเร็จ")
      setRules((prev) => prev.map((rule) => (rule.id === id ? payload.data : rule)))
    } catch (e) {
      setError(e instanceof Error ? e.message : "อัปเดตกฎไม่สำเร็จ")
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">ตั้งค่าการแจ้งเตือน</h1>
          <p className="mt-2 text-muted-foreground">
            สร้างกฎการแจ้งเตือนเมื่อมีทุนใหม่ที่ตรงกับเงื่อนไขของคุณ
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มกฎใหม่
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add New Rule Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>เพิ่มกฎการแจ้งเตือนใหม่</CardTitle>
            <CardDescription>ระบุเงื่อนไขที่ต้องการรับการแจ้งเตือน</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>ชื่อกฎ</Label>
                <Input
                  placeholder="เช่น ทุนสาย IT ในญี่ปุ่น"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>สาขาวิชา</Label>
                <Select
                  value={newRule.field}
                  onValueChange={(value) => setNewRule({ ...newRule, field: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสาขา" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ระดับการศึกษา</Label>
                <Select
                  value={newRule.level}
                  onValueChange={(value) => setNewRule({ ...newRule, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกระดับ" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ประเทศ</Label>
                <Select
                  value={newRule.country}
                  onValueChange={(value) => setNewRule({ ...newRule, country: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเทศ" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Channels</Label>
                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newRule.channels.includes("email")}
                      onChange={(e) =>
                        setNewRule((prev) => ({
                          ...prev,
                          channels: e.target.checked
                            ? [...new Set([...prev.channels, "email"])]
                            : prev.channels.filter((c) => c !== "email"),
                        }))
                      }
                    />
                    email
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newRule.channels.includes("webhook")}
                      onChange={(e) =>
                        setNewRule((prev) => ({
                          ...prev,
                          channels: e.target.checked
                            ? [...new Set([...prev.channels, "webhook"])]
                            : prev.channels.filter((c) => c !== "webhook"),
                        }))
                      }
                    />
                    webhook
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button onClick={handleAddRule}>บันทึกกฎ</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules List */}
      <Card>
        <CardHeader>
          <CardTitle>กฎการแจ้งเตือนของคุณ</CardTitle>
          <CardDescription>รายการกฎที่คุณสร้างไว้</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">กำลังโหลด...</p>
          ) : rules.length === 0 ? (
            <p className="text-center text-muted-foreground">ยังไม่มีกฎการแจ้งเตือน</p>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{rule.name}</Badge>
                      <Badge variant="outline">{rule.triggers?.scholarshipField || "ทุกสาขา"}</Badge>
                      <Badge variant="outline">{rule.triggers?.scholarshipLevel || "ทุกระดับ"}</Badge>
                      <Badge variant="outline">{rule.triggers?.country || "ทุกประเทศ"}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span>Channels: {rule.channels?.join(", ") || "-"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={rule.active}
                      onCheckedChange={() => handleToggleRule(rule.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
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
