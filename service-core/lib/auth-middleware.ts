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
    // เรียก service-auth ตรวจสอบ API key
    const response = await fetch(`${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const user = await response.json()
    return { user, isValid: true }
  } catch (error) {
    // Fallback: ถ้า service-auth ไม่พร้อม อนุญาตให้ผ่านได้ชั่วคราว (dev mode)
    console.warn('Auth service unavailable, allowing request:', error)
    return { user: null, isValid: true }
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