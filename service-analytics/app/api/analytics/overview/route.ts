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
  try {
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing x-api-key header', code: 401 }, { status: 401 })
    }

    const verifyResult = await verifyApiKey(apiKey)
    const proCheck = requireProTier(verifyResult)
    if (!proCheck.ok) {
      return NextResponse.json(proCheck.body, { status: proCheck.status })
    }

    let allScholarships: Scholarship[] = []
    let page = 1
    const limit = 100

    // Paginate through all scholarships
    while (true) {
      try {
        const response = await fetch(
          `${CORE_SERVICE_URL}/api/scholarships?page=${page}&limit=${limit}`,
          {
            headers: { 'x-api-key': apiKey },
            cache: 'no-store',
          }
        )

        if (!response.ok) {
          console.error(`Failed to fetch scholarships page ${page}:`, response.status)
          break
        }

        const payload = await response.json()
        const scholarships: Scholarship[] = payload?.data || []

        if (scholarships.length === 0) break

        allScholarships = allScholarships.concat(scholarships)

        // Check if we have all records
        const total = payload?.meta?.total ?? 0
        if (allScholarships.length >= total) break

        page++
      } catch (error) {
        console.error(`Error fetching scholarships page ${page}:`, error)
        break
      }
    }

    const byCountry: Record<string, number> = {}
    const byField: Record<string, number> = {}
    const byLevel: Record<string, number> = {}
    let upcoming30Days = 0
    const now = new Date()
    const in30Days = new Date()
    in30Days.setDate(in30Days.getDate() + 30)

    for (const s of allScholarships) {
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
          scholarships: allScholarships.length,
          upcoming30Days,
        },
        breakdown: {
          byCountry,
          byField,
          byLevel,
        },
      },
    })
  } catch (error) {
    console.error('Analytics overview error:', error)
    return NextResponse.json(
      { error: 'Failed to generate analytics overview', code: 500 },
      { status: 500 }
    )
  }
}

