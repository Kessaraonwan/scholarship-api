import { NextRequest, NextResponse } from 'next/server'

/**
 * ตรวจสอบ API key สำหรับ route ที่ต้องการล็อกอิน
 * เรียกไปที่ service-auth เพื่อตรวจสอบ
 */
export async function withAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return NextResponse.json(
      { error: 'กรุณาใส่ API key - ส่ง Authorization: Bearer <your-api-key>' },
      { status: 401 }
    )
  }

  try {
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001'
    // เรียก service-auth ตรวจสอบ API key (ล็อกไว้ที่ endpoint เดียว)
    const response = await fetch(`${authServiceUrl}/api/keys/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: authHeader.replace(/^Bearer\s+/i, '').trim() }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const payload = await response.json()
    return { user: payload.user || null, isValid: true }
  } catch (error) {
    // ถ้า service-auth ไม่พร้อม ให้ return 503 Service Unavailable
    // ไม่ควร bypass authentication เพราะนั่นคือ security risk
    console.error('Auth service unavailable:', error)
    return NextResponse.json(
      { error: 'Authentication service unavailable', code: 503 },
      { status: 503 }
    )
  }
}

/**
 * สร้าง middleware function สำหรับป้องกัน route
 */
export function createAuthMiddleware(protectedRoutes: string[]) {
  return async function authMiddleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // ตรวจสอบว่า route นี้ต้องการป้องกันหรือไม่
    const needsAuth = protectedRoutes.some(route => pathname.startsWith(route))

    if (needsAuth) {
      const authResult = await withAuth(request)
      
      if (!authResult.isValid) {
        return authResult
      }
    }

    return { user: null, isValid: true }
  }
}