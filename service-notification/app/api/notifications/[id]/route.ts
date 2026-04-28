import { Response } from "next/server"
import { prisma } from '@/lib/prisma'

// GET /api/notifications/[id] - Get specific rule
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const rule = await prisma.notificationRule.findUnique({ where: { id } })

  if (!rule) {
    return Response.json(
      { error: "Notification rule not found" },
      { status: 404 }
    )
  }

  return Response.json({ data: rule })
}

// PUT /api/notifications/[id] - Update rule
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const existing = await prisma.notificationRule.findUnique({ where: { id } })
    if (!existing) {
      return Response.json(
        { error: "Notification rule not found" },
        { status: 404 }
      )
    }

    const updatedRule = await prisma.notificationRule.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        triggers: body.triggers ?? undefined,
        channels: body.channels ?? undefined,
        active: typeof body.active === 'boolean' ? body.active : undefined,
      },
    })

    return Response.json({ data: updatedRule })
  } catch (error) {
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}

// DELETE /api/notifications/[id] - Delete rule
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const existing = await prisma.notificationRule.findUnique({ where: { id } })
  if (!existing) {
    return Response.json(
      { error: "Notification rule not found" },
      { status: 404 }
    )
  }

  const deletedRule = await prisma.notificationRule.delete({ where: { id } })

  return Response.json({ data: deletedRule })
}
