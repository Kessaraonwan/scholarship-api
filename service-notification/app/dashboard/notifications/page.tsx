"use client"

import { useState } from "react"
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
  field: string
  level: string
  country: string
  email: string
  webhookUrl?: string
  enabled: boolean
}

const initialRules: NotificationRule[] = [
  {
    id: "1",
    field: "IT",
    level: "ปริญญาโท",
    country: "UK",
    email: "user@example.com",
    enabled: true,
  },
  {
    id: "2",
    field: "ทุกสาขา",
    level: "ปริญญาตรี",
    country: "ไทย",
    email: "user@example.com",
    webhookUrl: "https://webhook.example.com/notify",
    enabled: false,
  },
]

const fields = ["ทุกสาขา", "IT", "วิทยาศาสตร์", "เศรษฐศาสตร์"]
const levels = ["ทุกระดับ", "มัธยม", "ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก"]
const countries = ["ทุกประเทศ", "ไทย", "UK", "US", "Japan", "Germany"]

export default function NotificationsPage() {
  const [rules, setRules] = useState<NotificationRule[]>(initialRules)
  const [showForm, setShowForm] = useState(false)
  const [newRule, setNewRule] = useState({
    field: "",
    level: "",
    country: "",
    email: "",
    webhookUrl: "",
  })
  const isPro = false // Mock: change to true to enable webhook

  const handleAddRule = () => {
    if (!newRule.field || !newRule.level || !newRule.country || !newRule.email) return

    const rule: NotificationRule = {
      id: Date.now().toString(),
      field: newRule.field,
      level: newRule.level,
      country: newRule.country,
      email: newRule.email,
      webhookUrl: isPro ? newRule.webhookUrl : undefined,
      enabled: true,
    }

    setRules([...rules, rule])
    setNewRule({ field: "", level: "", country: "", email: "", webhookUrl: "" })
    setShowForm(false)
  }

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const handleToggleRule = (id: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    )
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
                <Label>อีเมล</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={newRule.email}
                  onChange={(e) => setNewRule({ ...newRule, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Webhook URL</Label>
                  {!isPro && (
                    <Badge variant="secondary" className="text-xs">
                      Pro only
                    </Badge>
                  )}
                </div>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={newRule.webhookUrl}
                  onChange={(e) => setNewRule({ ...newRule, webhookUrl: e.target.value })}
                  disabled={!isPro}
                />
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
          {rules.length === 0 ? (
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
                      <Badge variant="outline">{rule.field}</Badge>
                      <Badge variant="outline">{rule.level}</Badge>
                      <Badge variant="outline">{rule.country}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span>Email: {rule.email}</span>
                      {rule.webhookUrl && (
                        <span className="ml-4">Webhook: {rule.webhookUrl}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={rule.enabled}
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
