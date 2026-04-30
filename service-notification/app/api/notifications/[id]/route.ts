import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const rule = await prisma.notificationRule.findUnique({
    where: { id: params.id },
  })

  if (!rule) {
    return Response.json(
      { error: 'Notification rule not found' },
      { status: 404 }
    )
  }

  return Response.json({ data: rule })
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const rule = await prisma.notificationRule.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.triggers && { triggers: body.triggers }),
        ...(body.channels && { channels: body.channels }),
        ...(body.active !== undefined && { active: body.active }),
      },
    })

    return Response.json({ data: rule })
  } catch (error) {
    return Response.json(
      { error: 'Notification rule not found or invalid request' },
      { status: 404 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rule = await prisma.notificationRule.delete({
      where: { id: params.id },
    })

    return Response.json({ data: rule })
  } catch (error) {
    return Response.json(
      { error: 'Notification rule not found' },
      { status: 404 }
    )
  }
}