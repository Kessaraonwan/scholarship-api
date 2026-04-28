import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type IncomingScholarship = {
  name: string
  level: string
  field: string
  country: string
  deadline?: string | null
  amount?: number | null
  currency?: string | null
  url: string
  source: string
  description?: string | null
}

function requireInternalSecret(request: NextRequest) {
  const expected = process.env.INTERNAL_SECRET
  const got = request.headers.get('x-internal-secret')

  if (!expected) {
    return NextResponse.json({ error: 'INTERNAL_SECRET is not configured', code: 500 }, { status: 500 })
  }

  if (!got || got !== expected) {
    return NextResponse.json({ error: 'Forbidden', code: 403 }, { status: 403 })
  }

  return null
}

export async function POST(request: NextRequest) {
  const secretError = requireInternalSecret(request)
  if (secretError) return secretError

  const body = await request.json().catch(() => null)
  const scholarships: IncomingScholarship[] = Array.isArray(body?.scholarships) ? body.scholarships : []

  if (scholarships.length === 0) {
    return NextResponse.json({ error: 'scholarships must be a non-empty array', code: 400 }, { status: 400 })
  }

  const urls = scholarships.map((s) => s?.url).filter((u): u is string => typeof u === 'string' && u.length > 0)
  const existing = await prisma.scholarship.findMany({
    where: { url: { in: urls } },
    select: { url: true },
  })
  const existingSet = new Set(existing.map((e) => e.url))

  const upserts = await prisma.$transaction(
    scholarships.map((s) =>
      prisma.scholarship.upsert({
        where: { url: s.url },
        create: {
          name: s.name,
          level: s.level,
          field: s.field,
          country: s.country,
          deadline: s.deadline ? new Date(s.deadline) : null,
          amount: s.amount ?? null,
          currency: s.currency ?? null,
          url: s.url,
          source: s.source,
          description: s.description ?? null,
        },
        update: {
          name: s.name,
          level: s.level,
          field: s.field,
          country: s.country,
          deadline: s.deadline ? new Date(s.deadline) : null,
          amount: s.amount ?? null,
          currency: s.currency ?? null,
          source: s.source,
          description: s.description ?? null,
        },
      })
    )
  )

  const created = upserts.filter((s) => !existingSet.has(s.url))
  const updated = upserts.length - created.length

  // Fire-and-forget trigger to notification (only for new scholarships)
  if (created.length > 0) {
    const notificationUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://service-notification:3005'
    fetch(`${notificationUrl}/api/internal/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': process.env.INTERNAL_SECRET || '',
      },
      body: JSON.stringify({ newScholarships: created }),
    }).catch(() => {
      // ignore delivery failures here; logs will be handled by notification service
    })
  }

  return NextResponse.json({
    data: {
      created: created.length,
      updated,
      total: upserts.length,
    },
  })
}

