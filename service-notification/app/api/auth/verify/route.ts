import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authService = process.env.AUTH_SERVICE_URL || 'http://localhost:3001'

    // Forward cookies to auth service so it can verify session
    const cookieHeader = request.headers.get('cookie') || ''

    const res = await fetch(`${authService}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    })

    const data = await res.json()

    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    console.error('notification/api/auth/verify error', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
