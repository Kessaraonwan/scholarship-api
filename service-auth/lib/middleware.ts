import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value

  if (!token) {
    return null
  }

  const decoded = verifyJWT(token)
  return decoded
}

export function requireAuth(request: NextRequest) {
  const user = getUserFromToken(request)

  if (!user) {
    return NextResponse.json(
      { error: 'ไม่ได้รับอนุญาต' },
      { status: 401 }
    )
  }

  return user
}