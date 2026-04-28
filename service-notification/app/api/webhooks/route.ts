import { prisma } from '@/lib/prisma'

// GET /api/webhooks - List user's webhooks
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
  const total = await prisma.webhook.count({ where })
  const userWebhooks = await prisma.webhook.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  return Response.json({
    data: userWebhooks,
    meta: { total, page, limit },
  })
}

// POST /api/webhooks - Register new webhook
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, url, events } = body

    if (!userId || !url || !events || !Array.isArray(events)) {
      return Response.json(
        { error: "Missing required fields: userId, url, events (array)" },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return Response.json(
        { error: "Invalid webhook URL" },
        { status: 400 }
      )
    }

    // Validate events
    const validEvents = ["notification.sent", "notification.delivered", "notification.failed"]
    const invalidEvents = events.filter((e: string) => !validEvents.includes(e))
    if (invalidEvents.length > 0) {
      return Response.json(
        { error: `Invalid events: ${invalidEvents.join(", ")}` },
        { status: 400 }
      )
    }

    const newWebhook = await prisma.webhook.create({
      data: {
        userId,
        url,
        events,
        active: true,
      },
    })

    return Response.json(
      { data: newWebhook },
      { status: 201 }
    )
  } catch (error) {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
