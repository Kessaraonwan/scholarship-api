import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateJWT, verifyJWT } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'ไม่พบ access token' }, { status: 401 })
    }

    const decoded = verifyJWT(token)

    if (!decoded?.userId) {
      return NextResponse.json({ error: 'token ไม่ถูกต้อง' }, { status: 401 })
    }

    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: { tier: 'pro' },
    })

    const newAccessToken = generateJWT({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      tier: user.tier,
    })

    const response = NextResponse.json({
      message: 'อัปเกรดเป็น Pro สำเร็จ (mock)',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tier: user.tier,
      },
    })

    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error('Mock upgrade error:', error)
    return NextResponse.json({ error: 'อัปเกรดไม่สำเร็จ' }, { status: 500 })
  }
}