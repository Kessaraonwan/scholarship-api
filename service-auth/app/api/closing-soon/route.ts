import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3004'

export async function GET(request: NextRequest) {
  try {
    // Get accessToken from cookies
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized', data: [] },
        { status: 401 }
      )
    }

    // Fetch from analytics service with auth header
    const response = await fetch(`${ANALYTICS_SERVICE_URL}/api/closing-soon`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      console.error(`Analytics API error: ${response.status}`)
      // Return empty list instead of error to be graceful
      return NextResponse.json({
        data: [],
        meta: { total: 0, days: 30 },
      })
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching closing soon scholarships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scholarships', data: [] },
      { status: 500 }
    )
  }
}
