import { prisma } from '@/lib/prisma'

const validEvents = ['notification.sent', 'notification.delivered', 'notification.failed']

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return Response.json(
      { error: 'userId query parameter is required' },
      { status: 400 }
    )
  }

  const webhooks = await prisma.webhook.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json({
    data: webhooks,
    meta: { total: webhooks.length },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, url, events } = body

    if (!userId || !url || !events || !Array.isArray(events)) {
      return Response.json(
        { error: 'Missing required fields: userId, url, events (array)' },
        { status: 400 }
      )
    }

    try {
      new URL(url)
    } catch {
      return Response.json(
        { error: 'Invalid webhook URL' },
        { status: 400 }
      )
    }

    const invalidEvents = events.filter((e: string) => !validEvents.includes(e))
    if (invalidEvents.length > 0) {
      return Response.json(
        { error: `Invalid events: ${invalidEvents.join(', ')}` },
        { status: 400 }
      )
    }

    const webhook = await prisma.webhook.create({
      data: { userId, url, events },
    })

    return Response.json({ data: webhook }, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}