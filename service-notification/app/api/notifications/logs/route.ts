import { prisma } from '@/lib/prisma'

// GET /api/notifications/logs - Get notification delivery logs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const ruleId = searchParams.get("ruleId")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const offset = (page - 1) * limit

  const where: Record<string, string> = {}

  if (userId) {
    where.userId = userId
  }

  if (ruleId) {
    where.ruleId = ruleId
  }

  const total = await prisma.notificationLog.count({ where })
  const paginatedLogs = await prisma.notificationLog.findMany({
    where,
    orderBy: { sentAt: 'desc' },
    skip: offset,
    take: limit,
  })

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
