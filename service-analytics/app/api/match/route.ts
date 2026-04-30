import { NextRequest, NextResponse } from 'next/server'
import { verifyApiKey } from '@/lib/auth'
import { resolveApiKeyFromRequest } from '@/lib/request-auth'

const CORE_SERVICE_URL = process.env.CORE_SERVICE_URL || 'http://localhost:3003'

export async function POST(request: NextRequest) {
  const resolved = await resolveApiKeyFromRequest(request)
  if (resolved.response) {
    return resolved.response
  }

  const apiKey = resolved.apiKey
  if (!apiKey) {
    return NextResponse.json({ error: 'Unable to resolve API key' }, { status: 401 })
  }

  // Verify จริงกับ service-auth
  const auth = await verifyApiKey(apiKey)
  if (!auth.valid) {
    return NextResponse.json({ error: auth.error || 'Invalid API key' }, { status: 401 })
  }

  try {
    const { level, field, country } = await request.json()
    const params = new URLSearchParams()
    if (level) params.set('level', level)
    if (field) params.set('field', field)
    if (country) params.set('country', country)

    const coreRes = await fetch(
      `${CORE_SERVICE_URL}/api/scholarships?${params.toString()}`,
      {
        headers: {
          'x-api-key': apiKey, // ส่งต่อด้วย x-api-key เหมือนกัน
        },
      }
    )

    if (!coreRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch scholarships' },
        { status: coreRes.status }
      )
    }

    const coreData = await coreRes.json()
    return NextResponse.json({
      data: coreData.data,
      meta: coreData.meta,
    })
  } catch (error) {
    console.error('Match error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}