import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export function middleware(request: NextRequest) {
  // ตรวจสอบเส้นทางที่ต้องการการ authentication
  const protectedPaths = ['/dashboard']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath) {
    const token = request.cookies.get('accessToken')?.value

    if (!token) {
      // ไม่มี token - redirect ไป login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // ไม่ verify token ใน middleware เพื่อหลีกเลี่ยง edge runtime crypto issue
    // ให้ API routes handle verification แทน
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}