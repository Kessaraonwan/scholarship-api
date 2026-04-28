import { prisma } from '@/lib/prisma'

// GET /api/notifications - List all rules for user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  if (!userId) {
    return Response.json(
      { error: "userId query parameter is required" },
      { status: 400 }
    )
  }

  const where = { userId }
  const total = await prisma.notificationRule.count({ where })
  const userRules = await prisma.notificationRule.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  return Response.json({
    data: userRules,
    meta: { total, page, limit },
  })
}

// POST /api/notifications - Create new rule
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, name, triggers, channels } = body

    if (!userId || !name || !triggers || !Array.isArray(channels || ['email'])) {
      return Response.json(
        { error: "Missing required fields: userId, name, triggers, channels(array)" },
        { status: 400 }
      )
    }

    const newRule = await prisma.notificationRule.create({
      data: {
        userId,
        name,
        triggers,
        channels: channels || ['email'],
        active: true,
      },
    })

    return Response.json(
      { data: newRule },
      { status: 201 }
    )
  } catch (error) {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
