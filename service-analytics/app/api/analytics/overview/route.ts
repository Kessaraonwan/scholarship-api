import { NextRequest, NextResponse } from 'next/server'
import { requireProTier, verifyApiKey } from '@/lib/auth'

const CORE_SERVICE_URL = process.env.CORE_SERVICE_URL || 'http://service-core:3003'

type Scholarship = {
  id: string
  level: string
  field: string
  country: string
  deadline: string | null
}

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header', code: 401 }, { status: 401 })
  }

  const verifyResult = await verifyApiKey(apiKey)
  const proCheck = requireProTier(verifyResult)
  if (!proCheck.ok) {
    return NextResponse.json(proCheck.body, { status: proCheck.status })
  }

  const response = await fetch(`${CORE_SERVICE_URL}/api/scholarships?page=1&limit=200`, {
    headers: { 'x-api-key': apiKey },
    cache: 'no-store',
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch scholarships', code: 502 }, { status: 502 })
  }

  const payload = await response.json()
  const scholarships: Scholarship[] = payload?.data || []

  const byCountry: Record<string, number> = {}
  const byField: Record<string, number> = {}
  const byLevel: Record<string, number> = {}
  let upcoming30Days = 0
  const now = new Date()
  const in30Days = new Date()
  in30Days.setDate(in30Days.getDate() + 30)

  for (const s of scholarships) {
    byCountry[s.country] = (byCountry[s.country] || 0) + 1
    byField[s.field] = (byField[s.field] || 0) + 1
    byLevel[s.level] = (byLevel[s.level] || 0) + 1
    if (s.deadline) {
      const deadline = new Date(s.deadline)
      if (deadline >= now && deadline <= in30Days) upcoming30Days += 1
    }
  }

  return NextResponse.json({
    data: {
      totals: {
        scholarships: payload?.meta?.total ?? scholarships.length,
        upcoming30Days,
      },
      breakdown: {
        byCountry,
        byField,
        byLevel,
      },
    },
  })
}

