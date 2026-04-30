import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005'
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || 'internal-secret-key'

async function triggerNotification(scholarship: any): Promise<void> {
  try {
    await fetch(`${NOTIFICATION_SERVICE_URL}/api/internal/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': INTERNAL_SECRET,
      },
      body: JSON.stringify({ scholarship }),
    })
  } catch (error) {
    console.error('Failed to trigger notification:', error)
  }
}

export async function POST(request: NextRequest) {
  const internalSecret = request.headers.get('x-internal-secret')

  if (internalSecret !== process.env.INTERNAL_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { scholarships } = body

    if (!scholarships || !Array.isArray(scholarships) || scholarships.length === 0) {
      return NextResponse.json(
        { error: 'Missing or empty scholarships array' },
        { status: 400 }
      )
    }

    let created = 0
    let updated = 0
    let failed = 0

    for (const s of scholarships) {
      try {
        const result = await prisma.scholarship.upsert({
          where: { url: s.url },
          create: {
            name: s.name,
            level: s.level || '',
            field: s.field || '',
            country: s.country || '',
            deadline: s.deadline ? new Date(s.deadline) : null,
            amount: s.amount ?? null,
            currency: s.currency || 'USD',
            url: s.url,
            source: s.source,
            description: s.description ?? null,
          },
          update: {
            name: s.name,
            level: s.level || '',
            field: s.field || '',
            country: s.country || '',
            deadline: s.deadline ? new Date(s.deadline) : null,
            amount: s.amount ?? null,
            currency: s.currency || 'USD',
            description: s.description ?? null,
          },
        })

        const createdRecently = new Date().getTime() - result.createdAt.getTime() < 1000
        if (createdRecently) {
          created++
          // trigger notification เฉพาะทุนใหม่
          await triggerNotification(result)
        } else {
          updated++
        }
      } catch (err) {
        failed++
        console.error(`Failed to upsert scholarship "${s.name}":`, err)
      }
    }

    return NextResponse.json({
      data: { created, updated, failed, total: scholarships.length },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}