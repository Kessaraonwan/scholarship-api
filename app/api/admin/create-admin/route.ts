import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminUser, findUserByEmail } from '@/lib/auth'

const createAdminSchema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
  firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
  secretKey: z.string().min(1, 'กรุณาระบุ secret key'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, secretKey } = createAdminSchema.parse(body)

    // ตรวจสอบ secret key
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Secret key ไม่ถูกต้อง' },
        { status: 403 }
      )
    }

    // ตรวจสอบว่าอีเมลซ้ำหรือไม่
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 400 }
      )
    }

    // สร้าง admin user
    const adminUser = await createAdminUser(email, password, firstName, lastName)

    // ส่ง response กลับ (ไม่รวม password)
    const { password: _, ...userWithoutPassword } = adminUser

    return NextResponse.json({
      message: 'สร้างผู้ดูแลระบบสำเร็จ',
      user: userWithoutPassword,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create admin error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างผู้ดูแลระบบ' },
      { status: 500 }
    )
  }
}