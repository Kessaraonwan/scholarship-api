// Mock webhooks
const webhooks: any[] = [
  {
    id: "webhook-1",
    userId: "user-123",
    url: "https://example.com/webhooks/notifications",
    events: ["notification.sent", "notification.delivered"],
    active: true,
    createdAt: new Date().toISOString(),
  },
]

// GET /api/webhooks - List user's webhooks
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return Response.json(
      { error: "userId query parameter is required" },
      { status: 400 }
    )
  }

  const userWebhooks = webhooks.filter(w => w.userId === userId)

  return Response.json({
    data: userWebhooks,
    meta: { total: userWebhooks.length },
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

    const newWebhook = {
      id: `webhook-${Date.now()}`,
      userId,
      url,
      events,
      active: true,
      createdAt: new Date().toISOString(),
    }

    webhooks.push(newWebhook)

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
