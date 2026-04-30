import { NextResponse } from 'next/server'
import { verifyApiKey } from '@/lib/auth'

const CORE_SERVICE_URL = process.env.CORE_SERVICE_URL || 'http://localhost:3003'

async function fetchAllScholarships(apiKey: string) {
  const firstRes = await fetch(
    `${CORE_SERVICE_URL}/api/scholarships?limit=100&page=1`,
    { headers: { 'x-api-key': apiKey } }
  )
  if (!firstRes.ok) throw new Error('Failed to fetch from service-core')
  const firstData = await firstRes.json()

  const { totalPages } = firstData.pagination
  let all = [...firstData.data]

  if (totalPages > 1) {
    const requests = []
    for (let page = 2; page <= totalPages; page++) {
      requests.push(
        fetch(`${CORE_SERVICE_URL}/api/scholarships?limit=100&page=${page}`, {
          headers: { 'x-api-key': apiKey },
        }).then(r => r.json())
      )
    }
    const rest = await Promise.all(requests)
    rest.forEach(d => { all = [...all, ...d.data] })
  }

  return all
}

export async function GET(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 })
  }

  const auth = await verifyApiKey(apiKey)
  if (!auth.valid) {
    return NextResponse.json({ error: auth.error || 'Invalid API key' }, { status: 401 })
  }

  if (auth.user?.tier !== 'pro') {
    return NextResponse.json(
      { error: 'This endpoint requires a Pro plan', code: 'UPGRADE_REQUIRED' },
      { status: 403 }
    )
  }

  try {
    const scholarships = await fetchAllScholarships(apiKey)

    const byLevel: Record<string, number> = {}
    scholarships.forEach((s: any) => {
      byLevel[s.level] = (byLevel[s.level] || 0) + 1
    })

    const byCountry: Record<string, number> = {}
    scholarships.forEach((s: any) => {
      byCountry[s.country] = (byCountry[s.country] || 0) + 1
    })

    const now = new Date()
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const closingSoon = scholarships.filter((s: any) => {
      if (!s.deadline) return false
      const d = new Date(s.deadline)
      return d >= now && d <= in30Days
    }).length

    return NextResponse.json({
      data: {
        totalScholarships: scholarships.length,
        byLevel,
        byCountry,
        closingSoon,
      },
    })
  } catch (error) {
    console.error('Overview error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 502 })
  }
}