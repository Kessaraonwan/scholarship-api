import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createUser, findUserByEmail } from '@/lib/auth'

const registerSchema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
  firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = registerSchema.parse(body)

    // ตรวจสอบว่าอีเมลซ้ำหรือไม่
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 400 }
      )
    }

    // สร้างผู้ใช้ใหม่
    const user = await createUser(email, password, firstName, lastName)

    // ส่ง response กลับ (ไม่รวม password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'สมัครสมาชิกสำเร็จ',
      user: userWithoutPassword,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' },
      { status: 500 }
    )
  }
}