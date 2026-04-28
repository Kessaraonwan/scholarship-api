import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // --- 1. ส่วนเช็คสิทธิ์เข้าหน้าเว็บ (Dashboard) ---
  const protectedPaths = ['/dashboard']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath) {
    const token = request.cookies.get('accessToken')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // --- 2. ส่วนของ API Gateway (ดักจับ API Key) ---
  // สมมติว่า Endpoint ที่ User ต้องใช้ยิงข้อมูลคือที่ขึ้นต้นด้วย /api/v1/
  if (pathname.startsWith('/api/v1/')) {
    const authHeader = request.headers.get('authorization')

    // ถ้าไม่มี Header หรือไม่ได้ส่งแบบ Bearer มา
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid API Key format' },
        { status: 401 }
      )
    }

    // ดึงเฉพาะตัว Key ออกมา (ตัดคำว่า Bearer ออก)
    const apiKey = authHeader.split(' ')[1]

    // ส่ง Key แนบไปกับ Header (เช่น x-api-key) เพื่อให้ Service ปลายทางหรือ API Route เอาไปเช็คกับ DB ต่อ
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-api-key', apiKey)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}