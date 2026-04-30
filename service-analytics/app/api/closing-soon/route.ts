import { NextRequest, NextResponse } from 'next/server'
import { resolveApiKeyFromRequest } from '@/lib/request-auth'
import { verifyApiKey } from '@/lib/auth'

const CORE_SERVICE_URL = process.env.CORE_SERVICE_URL || 'http://localhost:3003'

export async function GET(request: NextRequest) {
  // Try to resolve API key from request (supports cookies, headers, etc.)
  const { apiKey, response: authError } = await resolveApiKeyFromRequest(request)

  if (authError) {
    return authError
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing authentication', data: [] },
      { status: 401 }
    )
  }

  // Verify API key
  const verifyResult = await verifyApiKey(apiKey)
  if (!verifyResult.valid) {
    return NextResponse.json(
      { error: 'Invalid API key', data: [] },
      { status: 401 }
    )
  }

  try {
    // Fetch closing soon scholarships from core service
    const response = await fetch(`${CORE_SERVICE_URL}/api/scholarships/upcoming?days=30`, {
      headers: {
        'x-api-key': apiKey,
      },
    })

    if (!response.ok) {
      console.error(`Core service error: ${response.status}`)
      // Return empty list instead of error to be graceful
      return NextResponse.json({
        data: [],
        meta: { total: 0, days: 30 },
      })
    }

    const data = await response.json()

    return NextResponse.json({
      data: data.data || [],
      meta: data.meta || { total: 0, days: 30 },
    })
  } catch (error) {
    console.error('Error fetching closing soon scholarships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scholarships', data: [] },
      { status: 500 }
    )
  }
}


