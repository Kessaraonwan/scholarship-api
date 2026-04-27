import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

  console.log('🍪 Test cookies - accessToken present:', !!token)
  console.log('🔑 Auth header present:', !!authHeader)
  console.log('🎫 Bearer token present:', !!bearerToken)

  const tokenToVerify = bearerToken || token
  if (tokenToVerify) {
    const decoded = verifyJWT(tokenToVerify)
    console.log('✅ Token decoded:', decoded)
    console.log('❌ Token valid:', !!decoded)
  }

  return NextResponse.json({
    hasCookieToken: !!token,
    hasAuthHeader: !!authHeader,
    hasBearerToken: !!bearerToken,
    tokenValid: !!(tokenToVerify && verifyJWT(tokenToVerify)),
  })
}