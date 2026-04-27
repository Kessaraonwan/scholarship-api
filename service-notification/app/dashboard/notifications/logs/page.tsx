"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface NotificationLog {
  id: string
  scholarshipName: string
  type: "email" | "webhook"
  status: "success" | "failed"
  timestamp: string
  details: string
}

const logs: NotificationLog[] = [
  {
    id: "1",
    scholarshipName: "ทุน DAAD",
    type: "email",
    status: "success",
    timestamp: "2025-01-20 10:30",
    details: "ส่งไปที่ user@example.com สำเร็จ",
  },
  {
    id: "2",
    scholarshipName: "ทุน Chevening",
    type: "webhook",
    status: "failed",
    timestamp: "2025-01-20 09:15",
    details: "Webhook timeout",
  },
  {
    id: "3",
    scholarshipName: "ทุน กยศ.",
    type: "email",
    status: "success",
    timestamp: "2025-01-19 14:22",
    details: "ส่งไปที่ user@example.com สำเร็จ",
  },
  {
    id: "4",
    scholarshipName: "ทุน JASSO",
    type: "email",
    status: "success",
    timestamp: "2025-01-19 11:05",
    details: "ส่งไปที่ user@example.com สำเร็จ",
  },
  {
    id: "5",
    scholarshipName: "ทุน Fulbright",
    type: "webhook",
    status: "failed",
    timestamp: "2025-01-18 16:45",
    details: "Connection refused",
  },
]

type FilterStatus = "all" | "success" | "failed"

export default function NotificationLogsPage() {
  const [filter, setFilter] = useState<FilterStatus>("all")

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
          variant={filter === "success" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("success")}
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
      <Card>
        <CardHeader>
          <CardTitle>ประวัติการแจ้งเตือน</CardTitle>
          <CardDescription>รายการการส่งการแจ้งเตือนล่าสุด</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
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
                          variant={log.type === "email" ? "secondary" : "outline"}
                          className="capitalize"
                        >
                          {log.type}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Badge
                          className={
                            log.status === "success"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {log.status === "success" ? "สำเร็จ" : "ล้มเหลว"}
                        </Badge>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">{log.timestamp}</td>
                      <td className="py-4 text-sm text-muted-foreground">{log.details}</td>
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
