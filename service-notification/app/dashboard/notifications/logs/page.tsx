"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface NotificationLog {
  id: string
  scholarshipName: string
  channel: "email" | "webhook"
  status: "delivered" | "failed" | "sent"
  sentAt: string
  errorMessage?: string | null
}

type FilterStatus = "all" | "delivered" | "failed"

export default function NotificationLogsPage() {
  const [logs, setLogs] = useState<NotificationLog[]>([])
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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
        const response = await fetch(`/api/notifications/logs?userId=${encodeURIComponent(userId)}&page=1&limit=100`)
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || "โหลด logs ไม่สำเร็จ")
        setLogs(payload.data || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : "โหลด logs ไม่สำเร็จ")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [userId])

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true
    return log.status === filter
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">ประวัติการแจ้งเตือน</h1>
        <p className="mt-2 text-muted-foreground">
          ดูประวัติการส่งการแจ้งเตือนทั้งหมด
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          ทั้งหมด
        </Button>
        <Button
          variant={filter === "delivered" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("delivered")}
        >
          สำเร็จ
        </Button>
        <Button
          variant={filter === "failed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("failed")}
        >
          ล้มเหลว
        </Button>
      </div>

      {/* Logs Table */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>ประวัติการแจ้งเตือน</CardTitle>
          <CardDescription>รายการการส่งการแจ้งเตือนล่าสุด</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">กำลังโหลด...</p>
          ) : filteredLogs.length === 0 ? (
            <p className="text-center text-muted-foreground">ไม่พบประวัติการแจ้งเตือน</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      ชื่อทุน
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      ประเภท
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      สถานะ
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      เวลา
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      รายละเอียด
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border last:border-0">
                      <td className="py-4 font-medium text-foreground">{log.scholarshipName}</td>
                      <td className="py-4">
                        <Badge
                          variant={log.channel === "email" ? "secondary" : "outline"}
                          className="capitalize"
                        >
                          {log.channel}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Badge
                          className={
                            log.status === "delivered"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {log.status === "delivered" ? "สำเร็จ" : "ล้มเหลว"}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">{new Date(log.sentAt).toLocaleString("th-TH")}</td>
                      <td className="py-4 text-sm text-muted-foreground">{log.errorMessage || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
