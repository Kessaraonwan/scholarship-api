"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Webhook,
  Plus,
  MoreHorizontal,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Copy,
  Play,
  AlertTriangle,
} from "lucide-react"

interface WebhookEndpoint {
  id: string
  url: string
  events: string[]
  active: boolean
  secret: string
  createdAt: string
  lastDelivery?: {
    status: "success" | "failed"
    timestamp: string
    statusCode: number
  }
}

interface WebhookLog {
  id: string
  webhookId: string
  event: string
  status: "success" | "failed" | "pending"
  statusCode: number
  timestamp: string
  duration: number
  retryCount: number
}

const eventTypes = [
  { id: "scholarship.new", name: "ทุนใหม่", description: "เมื่อมีทุนการศึกษาใหม่" },
  { id: "scholarship.updated", name: "ทุนอัปเดต", description: "เมื่อมีการอัปเดตข้อมูลทุน" },
  { id: "scholarship.deadline", name: "ใกล้หมดเขต", description: "เมื่อทุนใกล้หมดเขตรับสมัคร" },
  { id: "match.found", name: "พบทุนที่ตรงกัน", description: "เมื่อพบทุนที่ตรงกับโปรไฟล์" },
]

const initialWebhooks: WebhookEndpoint[] = [
  {
    id: "wh_001",
    url: "https://myapp.com/webhooks/scholarships",
    events: ["scholarship.new", "scholarship.updated"],
    active: true,
    secret: "whsec_abc123xyz789",
    createdAt: "2024-03-01",
    lastDelivery: {
      status: "success",
      timestamp: "2024-03-15 14:30:00",
      statusCode: 200,
    },
  },
  {
    id: "wh_002",
    url: "https://myapp.com/webhooks/deadlines",
    events: ["scholarship.deadline"],
    active: false,
    secret: "whsec_def456uvw012",
    createdAt: "2024-02-15",
    lastDelivery: {
      status: "failed",
      timestamp: "2024-03-14 10:15:00",
      statusCode: 500,
    },
  },
]

const webhookLogs: WebhookLog[] = [
  {
    id: "log_001",
    webhookId: "wh_001",
    event: "scholarship.new",
    status: "success",
    statusCode: 200,
    timestamp: "2024-03-15 14:30:00",
    duration: 245,
    retryCount: 0,
  },
  {
    id: "log_002",
    webhookId: "wh_001",
    event: "scholarship.updated",
    status: "success",
    statusCode: 200,
    timestamp: "2024-03-15 12:00:00",
    duration: 180,
    retryCount: 0,
  },
  {
    id: "log_003",
    webhookId: "wh_002",
    event: "scholarship.deadline",
    status: "failed",
    statusCode: 500,
    timestamp: "2024-03-14 10:15:00",
    duration: 1500,
    retryCount: 3,
  },
  {
    id: "log_004",
    webhookId: "wh_001",
    event: "scholarship.new",
    status: "success",
    statusCode: 200,
    timestamp: "2024-03-13 09:45:00",
    duration: 210,
    retryCount: 0,
  },
]

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(initialWebhooks)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  const [secretDialogOpen, setSecretDialogOpen] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookEndpoint | null>(null)
  const [showSecret, setShowSecret] = useState(false)

  const [newWebhook, setNewWebhook] = useState({
    url: "",
    events: [] as string[],
  })

  const handleCreateWebhook = () => {
    const webhook: WebhookEndpoint = {
      id: `wh_${Date.now()}`,
      url: newWebhook.url,
      events: newWebhook.events,
      active: true,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setWebhooks([...webhooks, webhook])
    setNewWebhook({ url: "", events: [] })
    setCreateDialogOpen(false)
  }

  const handleToggleWebhook = (id: string) => {
    setWebhooks(
      webhooks.map((wh) =>
        wh.id === id ? { ...wh, active: !wh.active } : wh
      )
    )
  }

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((wh) => wh.id !== id))
  }

  const handleEventToggle = (eventId: string) => {
    setNewWebhook((prev) => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter((e) => e !== eventId)
        : [...prev.events, eventId],
    }))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Webhooks</h1>
          <p className="mt-2 text-muted-foreground">
            รับการแจ้งเตือนแบบ real-time เมื่อเกิด events ใน API
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              สร้าง Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>สร้าง Webhook Endpoint</DialogTitle>
              <DialogDescription>
                เพิ่ม URL ที่ต้องการรับ webhook events
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-app.com/webhooks"
                  value={newWebhook.url}
                  onChange={(e) =>
                    setNewWebhook({ ...newWebhook, url: e.target.value })
                  }
                />
              </div>
              <div className="space-y-3">
                <Label>Events ที่ต้องการรับ</Label>
                <div className="space-y-3">
                  {eventTypes.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 rounded-lg border border-border p-3"
                    >
                      <Checkbox
                        id={event.id}
                        checked={newWebhook.events.includes(event.id)}
                        onCheckedChange={() => handleEventToggle(event.id)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={event.id}
                          className="text-sm font-medium text-foreground cursor-pointer"
                        >
                          {event.name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {event.description}
                        </p>
                        <code className="mt-1 text-xs text-muted-foreground">
                          {event.id}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button
                onClick={handleCreateWebhook}
                disabled={!newWebhook.url || newWebhook.events.length === 0}
              >
                สร้าง Webhook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gold Package Notice */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Webhook className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              Webhooks เป็นฟีเจอร์สำหรับแพ็คเกจ Gold
            </p>
            <p className="text-sm text-muted-foreground">
              อัพเกรดเพื่อรับ real-time notifications ผ่าน webhooks
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href="/dashboard/billing">ดูแพ็คเกจ</a>
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="endpoints">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Endpoints</CardTitle>
              <CardDescription>
                จัดการ webhook endpoints ที่สร้างไว้
              </CardDescription>
            </CardHeader>
            <CardContent>
              {webhooks.length > 0 ? (
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div
                      key={webhook.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <code className="text-sm font-medium text-foreground">
                            {webhook.url}
                          </code>
                          {webhook.active ? (
                            <Badge className="bg-green-500/10 text-green-600">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                        {webhook.lastDelivery && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {webhook.lastDelivery.status === "success" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span>
                              Last delivery: {webhook.lastDelivery.timestamp} (
                              {webhook.lastDelivery.statusCode})
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={webhook.active}
                          onCheckedChange={() => handleToggleWebhook(webhook.id)}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedWebhook(webhook)
                                setTestDialogOpen(true)
                              }}
                            >
                              <Play className="mr-2 h-4 w-4" />
                              ทดสอบ
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedWebhook(webhook)
                                setSecretDialogOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              ดู Secret
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteWebhook(webhook.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              ลบ
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Webhook className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="font-medium text-foreground">
                    ยังไม่มี Webhook Endpoints
                  </p>
                  <p className="text-sm text-muted-foreground">
                    สร้าง webhook endpoint เพื่อรับ real-time notifications
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Logs</CardTitle>
              <CardDescription>
                ประวัติการส่ง webhook events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Status Code</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhookLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <code className="text-sm">{log.event}</code>
                      </TableCell>
                      <TableCell>
                        {log.status === "success" ? (
                          <Badge className="bg-green-500/10 text-green-600">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Success
                          </Badge>
                        ) : log.status === "failed" ? (
                          <Badge className="bg-red-500/10 text-red-600">
                            <XCircle className="mr-1 h-3 w-3" />
                            Failed
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{log.statusCode}</TableCell>
                      <TableCell>{log.duration}ms</TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.timestamp}
                      </TableCell>
                      <TableCell className="text-right">
                        {log.status === "failed" && (
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="mr-1 h-4 w-4" />
                            Retry
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Webhook Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ทดสอบ Webhook</DialogTitle>
            <DialogDescription>
              ส่ง test event ไปยัง webhook endpoint
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Endpoint URL</Label>
              <code className="block rounded-lg bg-muted p-3 text-sm">
                {selectedWebhook?.url}
              </code>
            </div>
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select defaultValue="scholarship.new">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name} ({event.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={() => setTestDialogOpen(false)}>
              <Play className="mr-2 h-4 w-4" />
              ส่ง Test Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Secret Dialog */}
      <Dialog open={secretDialogOpen} onOpenChange={setSecretDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Webhook Secret</DialogTitle>
            <DialogDescription>
              ใช้ secret นี้ในการ verify webhook signatures
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <code className="text-sm">
                  {showSecret
                    ? selectedWebhook?.secret
                    : "whsec_••••••••••••••••"}
                </code>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSecret(!showSecret)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (selectedWebhook?.secret) {
                        navigator.clipboard.writeText(selectedWebhook.secret)
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600" />
              <p className="text-sm text-muted-foreground">
                รักษา secret นี้ไว้เป็นความลับ อย่าเปิดเผยใน client-side code
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSecretDialogOpen(false)}>ปิด</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
