import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    // Support both Cookie and Authorization: Bearer header
    let token = req.cookies.get('accessToken')?.value

    if (!token) {
      const authHeader = req.headers.get('authorization')
      if (authHeader?.toLowerCase().startsWith('bearer ')) {
        token = authHeader.slice('bearer '.length).trim()
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized', isAdmin: false }, { status: 401 })
    }

    const decoded = await verifyJWT(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token', isAdmin: false }, { status: 401 })
    }

    // Check for 'admin' role (case-sensitive match with database)
    const isAdmin = decoded?.role === 'admin'

    return NextResponse.json({ isAdmin: !!isAdmin })
  } catch (error) {
    console.error('verify-admin error:', error)
    return NextResponse.json({ error: 'Server error', isAdmin: false }, { status: 500 })
  }
}