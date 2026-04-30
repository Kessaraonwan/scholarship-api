import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyApiKey } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiKey = request.headers.get('x-api-key')

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing x-api-key header' },
      { status: 401 }
    )
  }

  const verificationResult = await verifyApiKey(apiKey)

  if (!verificationResult.valid) {
    return NextResponse.json(
      { error: verificationResult.error || 'Invalid API key' },
      { status: 401 }
    )
  }

  const scholarship = await prisma.scholarship.findUnique({
    where: { id: params.id },
  })

  if (!scholarship) {
    return NextResponse.json(
      { error: 'Scholarship not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ data: scholarship })
}