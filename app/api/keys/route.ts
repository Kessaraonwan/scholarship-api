import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/middleware'
import { createApiKey, getUserApiKeys } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createKeySchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ API Key'),
})

// GET /api/keys - ดู API keys ของผู้ใช้
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)
    if (user instanceof NextResponse) return user

    const apiKeys = await getUserApiKeys(user.userId)

    return NextResponse.json({ apiKeys })
  } catch (error) {
    console.error('Get API keys error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึง API keys' },
      { status: 500 }
    )
  }
}

// POST /api/keys - สร้าง API key ใหม่
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request)
    if (user instanceof NextResponse) return user

    const body = await request.json()
    const { name } = createKeySchema.parse(body)

    const apiKey = await createApiKey(user.userId, name)

    return NextResponse.json({
      message: 'สร้าง API key สำเร็จ',
      apiKey,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create API key error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้าง API key' },
      { status: 500 }
    )
  }
}

// DELETE /api/keys/[id] - ลบ API key
export async function DELETE(request: NextRequest) {
  try {
    const user = requireAuth(request)
    if (user instanceof NextResponse) return user

    const url = new URL(request.url)
    const keyId = url.searchParams.get('id')

    if (!keyId) {
      return NextResponse.json(
        { error: 'กรุณาระบุ API key ID' },
        { status: 400 }
      )
    }

    // ตรวจสอบว่า API key เป็นของผู้ใช้นี้หรือไม่
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: user.userId,
      },
    })

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ไม่พบ API key หรือไม่มีสิทธิ์เข้าถึง' },
        { status: 404 }
      )
    }

    // ลบ API key
    await prisma.apiKey.delete({
      where: { id: keyId },
    })

    return NextResponse.json({
      message: 'ลบ API key สำเร็จ',
    })
  } catch (error) {
    console.error('Delete API key error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบ API key' },
      { status: 500 }
    )
  }
}