import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { isAdmin, prisma } from '@/lib/auth'

// GET /api/admin/users - ดูรายชื่อผู้ใช้ทั้งหมด (เฉพาะ admin)
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)
    if (user instanceof NextResponse) return user

    // ตรวจสอบว่าเป็น admin หรือไม่
    const isUserAdmin = await isAdmin(user.userId)
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            apiKeys: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Get admin users error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' },
      { status: 500 }
    )
  }
}