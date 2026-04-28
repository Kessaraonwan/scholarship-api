import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyApiKey } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header', code: 401 }, { status: 401 })
  }

  const verificationResult = await verifyApiKey(apiKey)
  if (!verificationResult.valid) {
    return NextResponse.json(
      { error: verificationResult.error || 'Invalid API key', code: 401 },
      { status: 401 }
    )
  }

  const searchParams = request.nextUrl.searchParams
  const days = Math.max(1, parseInt(searchParams.get('days') || '90'))
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.max(1, parseInt(searchParams.get('limit') || '10'))

  const now = new Date()
  const until = new Date()
  until.setDate(until.getDate() + days)

  const where = {
    deadline: {
      gte: now,
      lte: until,
    },
  }

  const total = await prisma.scholarship.count({ where })
  const data = await prisma.scholarship.findMany({
    where,
    orderBy: { deadline: 'asc' },
    skip: (page - 1) * limit,
    take: limit,
  })

  return NextResponse.json({
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      days,
    },
  })
}

