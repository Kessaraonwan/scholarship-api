import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyApiKey } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

  const days = parseInt(request.nextUrl.searchParams.get('days') || '30')

  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)

  const scholarships = await prisma.scholarship.findMany({
    where: {
      deadline: {
        gte: new Date(),
        lte: futureDate,
      },
    },
    orderBy: { deadline: 'asc' },
    take: 20,
  })

  return NextResponse.json({
    data: scholarships,
    meta: { total: scholarships.length, days },
  })
}