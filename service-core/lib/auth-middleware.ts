import { NextRequest, NextResponse } from 'next/server'

export async function withAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return { 
      isValid: false, 
      response: NextResponse.json({ error: 'Missing API key' }, { status: 401 }) 
    }
  }

  const apiKey = authHeader.replace('Bearer ', '').trim()

  try {
    const response = await fetch(`${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}/api/keys/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: apiKey }), 
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { 
        isValid: false, 
        response: NextResponse.json(errorData, { status: response.status }) 
      }
    }

    const userData = await response.json()
    return { user: userData, isValid: true }

  } catch (error) {
    console.warn('Auth service unavailable:', error)
    // ใน Dev mode อนุญาตให้ผ่านถ้าเซอร์วิสพัง แต่ถ้าใช้งานจริงควรเปลี่ยนเป็น isValid: false
    return { user: null, isValid: true }
  }
}

export function createAuthMiddleware(protectedRoutes: string[]) {
  return async function authMiddleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const needsAuth = protectedRoutes.some(route => pathname.startsWith(route))

    if (needsAuth) {
      const authResult: any = await withAuth(request)
      
      // จุดสำคัญ: ถ้าไม่ Valid ต้อง return authResult.response เพื่อหยุด Request ทันที
      if (!authResult.isValid) {
        return authResult.response
      }
    }

    return NextResponse.next()
  }
}