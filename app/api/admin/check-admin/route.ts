import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { isAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)
    if (user instanceof NextResponse) return user

    const isUserAdmin = await isAdmin(user.userId)
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      )
    }

    return NextResponse.json({ isAdmin: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}