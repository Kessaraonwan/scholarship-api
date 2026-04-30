import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT, generateJWT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'ไม่มี refresh token' },
        { status: 401 }
      )
    }

    // ตรวจสอบ refresh token
    const decoded = verifyJWT(refreshToken)
    if (!decoded) {
      return NextResponse.json(
        { error: 'refresh token ไม่ถูกต้อง' },
        { status: 401 }
      )
    }

    // ตรวจสอบ refresh token ใน database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    })

    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'refresh token หมดอายุหรือถูกเพิกถอน' },
        { status: 401 }
      )
    }

    // สร้าง access token ใหม่
    const newAccessToken = generateJWT({
      userId: tokenRecord.user.id,
      email: tokenRecord.user.email,
      firstName: tokenRecord.user.firstName,
      lastName: tokenRecord.user.lastName,
      tier: tokenRecord.user.tier,
    })

    const response = NextResponse.json({
      message: 'refresh token สำเร็จ',
      accessToken: newAccessToken,
    })

    // อัปเดต access token cookie
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 วัน
    })

    return response
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการ refresh token' },
      { status: 500 }
    )
  }
}