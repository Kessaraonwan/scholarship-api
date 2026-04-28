// Mock notification logs
const notificationLogs: any[] = [
  {
    id: "log-1",
    ruleId: "rule-1",
    userId: "user-123",
    scholarshipId: "scholarship-abc",
    scholarshipName: "Thailand Digital Scholarship 2026",
    channel: "email",
    status: "sent",
    sentAt: new Date(Date.now() - 3600000).toISOString(),
    deliveredAt: new Date(Date.now() - 3595000).toISOString(),
  },
  {
    id: "log-2",
    ruleId: "rule-1",
    userId: "user-123",
    scholarshipId: "scholarship-def",
    scholarshipName: "Merit-based IT Award",
    channel: "webhook",
    status: "delivered",
    sentAt: new Date(Date.now() - 7200000).toISOString(),
    deliveredAt: new Date(Date.now() - 7190000).toISOString(),
  },
]

// GET /api/notifications/logs - Get notification delivery logs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const ruleId = searchParams.get("ruleId")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const offset = (page - 1) * limit

  let filtered = [...notificationLogs]

  if (userId) {
    filtered = filtered.filter(l => l.userId === userId)
  }

  if (ruleId) {
    filtered = filtered.filter(l => l.ruleId === ruleId)
  }

  const total = filtered.length
  const paginatedLogs = filtered.slice(offset, offset + limit)

  return Response.json({
    data: paginatedLogs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}
