import { NextRequest, NextResponse } from 'next/server'
import { requireProTier, verifyApiKey } from '@/lib/auth'

const CORE_SERVICE_URL = process.env.CORE_SERVICE_URL || 'http://service-core:3003'

type Scholarship = {
  id: string
  name: string
  level: string
  field: string
  country: string
  deadline: string | null
}

function scoreScholarship(
  scholarship: Scholarship,
  profile: { level?: string; fields?: string[]; countries?: string[] }
) {
  let score = 0

  if (profile.level && scholarship.level === profile.level) score += 40
  if (profile.fields?.includes(scholarship.field)) score += 35
  if (profile.countries?.includes(scholarship.country)) score += 25

  return Math.min(score, 100)
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header', code: 401 }, { status: 401 })
  }

  const verifyResult = await verifyApiKey(apiKey)
  const proCheck = requireProTier(verifyResult)
  if (!proCheck.ok) {
    return NextResponse.json(proCheck.body, { status: proCheck.status })
  }

  const body = await request.json().catch(() => ({}))
  const profile = {
    level: typeof body?.level === 'string' ? body.level : undefined,
    fields: Array.isArray(body?.fields) ? body.fields : [],
    countries: Array.isArray(body?.countries) ? body.countries : [],
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

  const matches = scholarships
    .map((scholarship) => ({
      scholarship,
      score: scoreScholarship(scholarship, profile),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

  return NextResponse.json({
    data: matches,
    meta: {
      total: matches.length,
      page: 1,
      limit: 20,
    },
  })
}

