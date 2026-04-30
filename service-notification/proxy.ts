import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isProtectedPath = request.nextUrl.pathname.startsWith('/dashboard')
  const tier = request.nextUrl.searchParams.get('tier')

  if (isProtectedPath) {
    const token = request.cookies.get('accessToken')?.value
    if (!token) {
      return NextResponse.redirect('http://localhost:3001/login')
    }

    if (request.nextUrl.pathname.startsWith('/dashboard/webhooks') && tier === 'free') {
      return NextResponse.redirect(new URL('/dashboard/billing?tier=free', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
