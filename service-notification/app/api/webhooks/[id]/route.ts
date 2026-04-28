// Mock webhooks (shared with parent route.ts)
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

// GET /api/webhooks/[id] - Get specific webhook
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const webhook = webhooks.find(w => w.id === id)

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
  const webhookIndex = webhooks.findIndex(w => w.id === id)

  if (webhookIndex === -1) {
    return Response.json(
      { error: "Webhook not found" },
      { status: 404 }
    )
  }

  const deletedWebhook = webhooks[webhookIndex]
  webhooks.splice(webhookIndex, 1)

  return Response.json({ data: deletedWebhook })
}
