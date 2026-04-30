import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const webhook = await prisma.webhook.findUnique({
    where: { id: params.id },
  })

  if (!webhook) {
    return Response.json(
      { error: 'Webhook not found' },
      { status: 404 }
    )
  }

  return Response.json({ data: webhook })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const webhook = await prisma.webhook.delete({
      where: { id: params.id },
    })

    return Response.json({ data: webhook })
  } catch (error) {
    return Response.json(
      { error: 'Webhook not found' },
      { status: 404 }
    )
  }
}