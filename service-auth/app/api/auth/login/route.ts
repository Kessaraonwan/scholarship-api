import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { findUserByEmail, verifyPassword, generateJWT, generateRefreshToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const loginSchema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // ค้นหาผู้ใช้
    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }

    // ตรวจสอบรหัสผ่าน
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }

    // สร้าง JWT tokens
    const accessToken = generateJWT({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const refreshToken = generateRefreshToken({ userId: user.id })

    // บันทึก refresh token ใน database
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 วัน
      },
    })

    // ส่ง response กลับ
    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    })

    // ตั้งค่า httpOnly cookie สำหรับ access token
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // ไม่ใช้ secure ใน development
      sameSite: 'lax', // เปลี่ยนเป็น lax แทน strict
      maxAge: 7 * 24 * 60 * 60, // 7 วัน
    })

    // ตั้งค่า httpOnly cookie สำหรับ refresh token
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // ไม่ใช้ secure ใน development
      sameSite: 'lax', // เปลี่ยนเป็น lax แทน strict
      maxAge: 30 * 24 * 60 * 60, // 30 วัน
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    )
  }
}