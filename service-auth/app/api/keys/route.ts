import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto' 

const createKeySchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อ API Key'),
})

// ดึงข้อมูล API Key ทั้งหมดของผู้ใช้
export async function GET(request: NextRequest) {
  try {
    // ใส่ ID ของ test@gmail.com ไว้ให้เทสก่อน พอเชื่อม Auth เสร็จค่อยมาแก้ตรงนี้
    const currentUserId = 'cmoh4f3cc000013va3ah2ynr4'; 

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: currentUserId }, // แก้เป็น camelCase ตามกฎ Prisma
      orderBy: { createdAt: 'desc' }    // แก้เป็น camelCase ตามกฎ Prisma
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error('Get API keys error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึง API keys' }, { status: 500 })
  }
}

// สร้าง API Key ใหม่ลง Database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = createKeySchema.parse(body)
    
    // ใส่ ID ของ test@gmail.com ไว้ให้เทสก่อน
    const currentUserId = 'cmoh4f3cc000013va3ah2ynr4'; 

    // สุ่มสร้าง API Key (ใช้อักษรฐาน 16 ความยาว 32 ตัวอักษร)
    const rawKey = `sk_live_${crypto.randomBytes(16).toString('hex')}`

    // บันทึกลงตาราง api_keys
    const newApiKey = await prisma.apiKey.create({
      data: {
        name: name,
        key: rawKey, 
        userId: currentUserId, 
        isActive: true, 
      }
    });

    // ส่วนที่หายไป: ต้อง return ค่ากลับไปบอกหน้าเว็บว่าสำเร็จแล้ว
    return NextResponse.json({
      message: 'สร้าง API key สำเร็จ',
      apiKey: newApiKey,
    })

  // ส่วนที่หายไป: บล็อก catch สำหรับดักจับ Error
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง', details: error.issues }, { status: 400 })
    }

    console.error('Create API key error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการสร้าง API key' }, { status: 500 })
  }
}