import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return Response.json(
      { error: 'userId query parameter is required' },
      { status: 400 }
    )
  }

  const rules = await prisma.notificationRule.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json({
    data: rules,
    meta: { total: rules.length },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, name, triggers, channels } = body

    if (!userId || !name || !triggers) {
      return Response.json(
        { error: 'Missing required fields: userId, name, triggers' },
        { status: 400 }
      )
    }

    const rule = await prisma.notificationRule.create({
      data: {
        userId,
        name,
        triggers,
        channels: channels || ['email'],
      },
    })

    return Response.json({ data: rule }, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}