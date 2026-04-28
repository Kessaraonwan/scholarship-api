import { prisma } from '@/lib/prisma'

// GET /api/webhooks/[id] - Get specific webhook
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const webhook = await prisma.webhook.findUnique({ where: { id } })

  if (!webhook) {
    return Response.json(
      { error: "Webhook not found" },
      { status: 404 }
    )
  }

  return Response.json({ data: webhook })
}

// DELETE /api/webhooks/[id] - Delete webhook
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const existing = await prisma.webhook.findUnique({ where: { id } })
  if (!existing) {
    return Response.json(
      { error: "Webhook not found" },
      { status: 404 }
    )
  }

  const deletedWebhook = await prisma.webhook.delete({ where: { id } })

  return Response.json({ data: deletedWebhook })
}

// PATCH /api/webhooks/[id] - Update webhook status/events/url
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const existing = await prisma.webhook.findUnique({ where: { id } })
    if (!existing) {
      return Response.json(
        { error: "Webhook not found" },
        { status: 404 }
      )
    }

    const updatedWebhook = await prisma.webhook.update({
      where: { id },
      data: {
        url: body.url ?? undefined,
        events: Array.isArray(body.events) ? body.events : undefined,
        active: typeof body.active === 'boolean' ? body.active : undefined,
      },
    })

    return Response.json({ data: updatedWebhook })
  } catch (error) {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
