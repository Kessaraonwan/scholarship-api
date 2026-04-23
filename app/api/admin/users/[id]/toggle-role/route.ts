import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { isAdmin, prisma } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json()
    const { role } = body

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'บทบาทไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // อัปเดตบทบาทผู้ใช้
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    })

    return NextResponse.json({
      message: 'อัปเดตบทบาทผู้ใช้สำเร็จ',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Toggle user role error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดตบทบาทผู้ใช้' },
      { status: 500 }
    )
  }
}