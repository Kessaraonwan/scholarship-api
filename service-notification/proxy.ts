import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isProtectedPath = request.nextUrl.pathname.startsWith('/dashboard')

  if (isProtectedPath) {
    const token = request.cookies.get('accessToken')?.value
    if (!token) {
      return NextResponse.redirect('http://localhost:3001/login')
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
